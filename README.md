# Brocode Clothing E-Commerce

Full-stack clothing store scaffold with a React customer storefront, owner/admin dashboard, Flask JWT API, and MySQL schema.

## Features

- Responsive customer pages: home, login/register, shop filters, product details, cart, checkout, about, contact, blogs.
- Storefront extras: wishlist, reviews, dark mode, order tracking copy, recently viewed storage, recommendation-ready product data.
- Admin panel: analytics metrics, recent orders, status changes, product form, customer management, blog/inventory sections.
- Backend: Flask API with JWT auth, admin guards, products, categories, orders, customers, blogs, contact messages and analytics.
- Database: MySQL schema for Users, Admin, Products, Categories, Product Images, Orders, Order Items, Cart, Payments, Blogs and Contact Messages, plus wishlist and reviews.

## Run Frontend

```powershell
npm install
npm run dev
```

## Run Backend

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r backend\requirements.txt
python backend\run.py
```

## MySQL Setup

```powershell
mysql -u root -p < backend\schema\brocode_store.sql
```

Set environment variables as needed:

```powershell
$env:MYSQL_HOST="localhost"
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="your_password"
$env:MYSQL_DATABASE="brocode_store"
$env:JWT_SECRET="replace_me"
```
