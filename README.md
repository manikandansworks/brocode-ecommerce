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
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:5173/` after Vite starts. On Windows PowerShell, use
`npm.cmd` when script execution policy blocks `npm.ps1`.

To allow a temporary review tunnel to reach Vite, run the frontend directly:

```powershell
npm.cmd --prefix frontend run dev -- --host 0.0.0.0
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
$env:FORCE_HTTPS="true"
$env:CORS_ORIGINS="https://manikandansworks.github.io"
```

For the frontend, configure deployment variables without committing them:

```powershell
$env:VITE_API_URL="https://your-api.example.com"
$env:VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

`VITE_API_URL` connects customer/admin forms to the Flask API. `VITE_GA_MEASUREMENT_ID`
enables analytics only after cookie consent. GitHub Pages hosts the static frontend;
the Flask API and MySQL database must be deployed separately.

## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. In the repository
settings, set **Pages > Build and deployment > Source** to **GitHub Actions**.
Every push to `main` then builds and publishes `frontend/dist`.
