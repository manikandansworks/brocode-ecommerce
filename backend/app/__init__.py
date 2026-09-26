from datetime import datetime, timedelta, timezone
from functools import wraps
import os

import jwt
from flask import Flask, jsonify, redirect, request
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.security import check_password_hash, generate_password_hash


def create_app():
    app = Flask(__name__)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
    allowed_origins = os.getenv("CORS_ORIGINS", "http://127.0.0.1:5173,http://localhost:5173").split(",")
    CORS(app, origins=[origin.strip() for origin in allowed_origins if origin.strip()])
    jwt_secret = os.getenv("JWT_SECRET")
    if not jwt_secret and os.getenv("FLASK_ENV") == "production":
        raise RuntimeError("JWT_SECRET must be configured in production.")
    app.config["SECRET_KEY"] = jwt_secret or "dev-only-brocode-secret"

    @app.before_request
    def force_https():
        if os.getenv("FORCE_HTTPS", "false").lower() != "true":
            return None
        forwarded_proto = request.headers.get("X-Forwarded-Proto", request.scheme)
        if forwarded_proto != "https":
            return redirect(request.url.replace("http://", "https://", 1), code=308)
        return None

    def db():
        import mysql.connector

        return mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "localhost"),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASSWORD", ""),
            database=os.getenv("MYSQL_DATABASE", "brocode_store"),
        )

    def token_for(user):
        payload = {
            "sub": user["id"],
            "role": user.get("role", "customer"),
            "exp": datetime.now(timezone.utc) + timedelta(days=7),
        }
        return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")

    def require_auth(role=None):
        def decorator(fn):
            @wraps(fn)
            def wrapper(*args, **kwargs):
                auth = request.headers.get("Authorization", "")
                if not auth.startswith("Bearer "):
                    return jsonify({"error": "Missing token"}), 401
                try:
                    payload = jwt.decode(auth.removeprefix("Bearer "), app.config["SECRET_KEY"], algorithms=["HS256"])
                except jwt.PyJWTError:
                    return jsonify({"error": "Invalid token"}), 401
                if role and payload.get("role") != role:
                    return jsonify({"error": "Forbidden"}), 403
                request.user = payload
                return fn(*args, **kwargs)
            return wrapper
        return decorator

    def query(sql, params=None, one=False, commit=False):
        connection = db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(sql, params or ())
        data = cursor.fetchone() if one else cursor.fetchall()
        if commit:
            connection.commit()
            data = {"id": cursor.lastrowid}
        cursor.close()
        connection.close()
        return data

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "brocode-api"})

    @app.post("/api/auth/register")
    def register():
        body = request.json or {}
        password_hash = generate_password_hash(body.get("password", ""))
        result = query(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
            (body.get("name"), body.get("email"), password_hash),
            commit=True,
        )
        user = {"id": result["id"], "role": "customer"}
        return jsonify({"token": token_for(user), "user": user}), 201

    @app.post("/api/auth/login")
    def login():
        body = request.json or {}
        user = query("SELECT id, name, email, password_hash, role FROM users WHERE email=%s", (body.get("email"),), one=True)
        if not user or not check_password_hash(user["password_hash"], body.get("password", "")):
            return jsonify({"error": "Invalid email or password"}), 401
        return jsonify({"token": token_for(user), "user": {k: user[k] for k in ("id", "name", "email", "role")}})

    @app.post("/api/auth/forgot-password")
    def forgot_password():
        return jsonify({"message": "Password reset link queued if the email exists."})

    @app.get("/api/products")
    def products():
        rows = query(
            """
            SELECT p.*, c.name AS category
            FROM products p
            JOIN categories c ON c.id = p.category_id
            ORDER BY p.created_at DESC
            """
        )
        return jsonify(rows)

    @app.post("/api/admin/products")
    @require_auth("admin")
    def add_product():
        body = request.json or {}
        result = query(
            """
            INSERT INTO products (category_id, name, brand, description, price, discount, sizes, colors, stock_quantity)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """,
            (
                body.get("category_id"),
                body.get("name"),
                body.get("brand"),
                body.get("description"),
                body.get("price"),
                body.get("discount", 0),
                ",".join(body.get("sizes", [])),
                ",".join(body.get("colors", [])),
                body.get("stock_quantity", 0),
            ),
            commit=True,
        )
        return jsonify(result), 201

    @app.put("/api/admin/products/<int:product_id>")
    @require_auth("admin")
    def update_product(product_id):
        body = request.json or {}
        query(
            """
            UPDATE products SET name=%s, description=%s, price=%s, discount=%s, stock_quantity=%s
            WHERE id=%s
            """,
            (body.get("name"), body.get("description"), body.get("price"), body.get("discount"), body.get("stock_quantity"), product_id),
            commit=True,
        )
        return jsonify({"updated": True})

    @app.delete("/api/admin/products/<int:product_id>")
    @require_auth("admin")
    def delete_product(product_id):
        query("DELETE FROM products WHERE id=%s", (product_id,), commit=True)
        return jsonify({"deleted": True})

    @app.get("/api/categories")
    def list_categories():
        return jsonify(query("SELECT * FROM categories ORDER BY name"))

    @app.post("/api/admin/categories")
    @require_auth("admin")
    def add_category():
        body = request.json or {}
        return jsonify(query("INSERT INTO categories (name, slug) VALUES (%s,%s)", (body.get("name"), body.get("slug")), commit=True)), 201

    @app.get("/api/orders")
    @require_auth()
    def list_orders():
        if request.user["role"] == "admin":
            return jsonify(query("SELECT * FROM orders ORDER BY created_at DESC"))
        return jsonify(query("SELECT * FROM orders WHERE user_id=%s ORDER BY created_at DESC", (request.user["sub"],)))

    @app.post("/api/orders")
    @require_auth()
    def create_order():
        body = request.json or {}
        result = query(
            "INSERT INTO orders (user_id, shipping_address, status, total_amount) VALUES (%s,%s,%s,%s)",
            (request.user["sub"], body.get("shipping_address"), "Pending", body.get("total_amount")),
            commit=True,
        )
        return jsonify(result), 201

    @app.patch("/api/admin/orders/<int:order_id>/status")
    @require_auth("admin")
    def update_order_status(order_id):
        status = (request.json or {}).get("status")
        query("UPDATE orders SET status=%s WHERE id=%s", (status, order_id), commit=True)
        return jsonify({"updated": True})

    @app.get("/api/admin/customers")
    @require_auth("admin")
    def list_customers():
        return jsonify(query("SELECT id, name, email, created_at FROM users WHERE role='customer'"))

    @app.post("/api/contact")
    def contact():
        body = request.json or {}
        result = query(
            "INSERT INTO contact_messages (name, email, message) VALUES (%s,%s,%s)",
            (body.get("name"), body.get("email"), body.get("message")),
            commit=True,
        )
        return jsonify(result), 201

    @app.get("/api/blogs")
    def list_blogs():
        return jsonify(query("SELECT * FROM blogs ORDER BY created_at DESC"))

    @app.post("/api/admin/blogs")
    @require_auth("admin")
    def add_blog():
        body = request.json or {}
        return jsonify(query(
            "INSERT INTO blogs (title, slug, excerpt, content, image_url) VALUES (%s,%s,%s,%s,%s)",
            (body.get("title"), body.get("slug"), body.get("excerpt"), body.get("content"), body.get("image_url")),
            commit=True,
        )), 201

    @app.get("/api/admin/analytics")
    @require_auth("admin")
    def analytics():
        return jsonify({
            "orders": query("SELECT COUNT(*) AS total FROM orders", one=True),
            "products": query("SELECT COUNT(*) AS total FROM products", one=True),
            "customers": query("SELECT COUNT(*) AS total FROM users WHERE role='customer'", one=True),
            "revenue": query("SELECT COALESCE(SUM(total_amount),0) AS total FROM orders WHERE status != 'Cancelled'", one=True),
            "low_stock": query("SELECT id, name, stock_quantity FROM products WHERE stock_quantity < 10"),
        })

    return app
