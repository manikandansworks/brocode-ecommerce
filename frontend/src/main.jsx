import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import logoAsset from './assets/brocode-logo.svg';
import { products as seedProducts, categories as seedCategories, blogs as seedBlogs, reviews, orders as seedOrders, customers } from './data/storeData';

const logoFallback = logoAsset;
const siteUrl = 'https://manikandansworks.github.io/brocode-ecommerce/';
const apiBase = import.meta.env.VITE_API_URL || '';

function apiUrl(path) {
  return `${apiBase}${path}`;
}

function Honeypot() {
  return <input className="honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />;
}

function usePageSeo(page, product) {
  useEffect(() => {
    const title = product ? `${product.name} | Brocode` : {
      home: 'Brocode Clothing | Premium Streetwear',
      shop: 'Shop Streetwear | Brocode Clothing',
      blogs: 'Brocode Journal | Style Guides and Trends',
      about: 'About Brocode | Everyday Streetwear',
      contact: 'Contact Brocode Clothing',
      login: 'Login | Brocode Clothing',
      admin: 'Owner Dashboard | Brocode',
      wishlist: 'Wishlist | Brocode Clothing',
      cart: 'Shopping Cart | Brocode Clothing',
      checkout: 'Checkout | Brocode Clothing',
      privacy: 'Privacy Policy | Brocode Clothing',
      terms: 'Terms and Conditions | Brocode Clothing'
    }[page] || 'Brocode Clothing';
    const description = product?.description || 'Shop premium streetwear, oversized tees, jackets, hoodies and everyday fits from Brocode Clothing.';
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', siteUrl);
  }, [page, product]);
}

function useAnalytics(consent) {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (consent !== 'accepted' || !measurementId || document.getElementById('brocode-analytics')) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args) => window.dataLayer.push(args);
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { anonymize_ip: true });
    const script = document.createElement('script');
    script.id = 'brocode-analytics';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }, [consent]);
}

function CookieBanner({ onChoice }) {
  return (
    <aside className="cookie-banner" role="dialog" aria-label="Cookie preferences">
      <div>
        <strong>Cookie preferences</strong>
        <p>We use essential storage for your cart and preferences. Optional analytics load only after you accept.</p>
      </div>
      <div className="cookie-actions">
        <button onClick={() => onChoice('declined')}>Decline optional</button>
        <button className="primary" onClick={() => onChoice('accepted')}>Accept analytics</button>
      </div>
    </aside>
  );
}

function money(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function Stars({ value = 5 }) {
  return <span className="stars" aria-label={`${value} star rating`}>{'★'.repeat(Math.round(value))}</span>;
}

function Header({ page, setPage, cartCount, wishlistCount, dark, setDark }) {
  const nav = ['home', 'shop', 'blogs', 'about', 'contact', 'admin'];
  return (
    <header className="site-header">
      <button className="brand" onClick={() => setPage('home')} aria-label="Brocode home">
        <img src={logoFallback} alt="Brocode logo" />
        <span>Brocode</span>
      </button>
      <nav>
        {nav.map((item) => (
          <button key={item} className={page === item ? 'active' : ''} onClick={() => setPage(item)}>
            {item}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <button title="Dark mode" onClick={() => setDark(!dark)}>{dark ? '☀' : '☾'}</button>
        <button title="Wishlist" onClick={() => setPage('wishlist')}>♡ {wishlistCount}</button>
        <button title="Cart" onClick={() => setPage('cart')}>Bag {cartCount}</button>
        <button className="login-btn" onClick={() => setPage('login')}>Login</button>
      </div>
    </header>
  );
}

function ProductCard({ product, onOpen, onCart, onWish, wished }) {
  return (
    <article className="product-card">
      <button className="wish" onClick={() => onWish(product.id)} aria-label="Toggle wishlist">{wished ? '♥' : '♡'}</button>
      <div className="product-image" style={{ background: product.bg }}>
        <img src={product.images[0]} alt={product.name} />
      </div>
      <div className="product-info">
        <p>{product.brand}</p>
        <h3>{product.name}</h3>
        <div className="price-row">
          <strong>{money(product.price)}</strong>
          <span>{product.discount}% off</span>
        </div>
        <Stars value={product.rating} />
        <div className="card-actions">
          <button onClick={() => onOpen(product.id)}>View</button>
          <button className="primary" onClick={() => onCart(product)}>Add</button>
        </div>
      </div>
    </article>
  );
}

function Newsletter() {
  const [status, setStatus] = useState('');

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('website')) return;
    setStatus('Thanks. You are on the Brocode drop list.');
    event.currentTarget.reset();
  }

  return (
    <section className="newsletter">
      <div>
        <h2>Get first access to limited Brocode drops.</h2>
        {status && <p className="form-success" role="status">{status}</p>}
      </div>
      <form onSubmit={submit}>
        <Honeypot />
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <input id="newsletter-email" name="email" type="email" placeholder="Email address" required />
        <button className="primary" type="submit">Subscribe</button>
      </form>
    </section>
  );
}

function Home({ catalog, categoryList, setPage, setSelected, addCart, toggleWish, wishlist }) {
  const featured = catalog.filter((p) => p.featured);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <img src={logoFallback} alt="Brocode logo" />
          <p>Summer drop live now</p>
          <h1>Brocode</h1>
          <h2>Street-ready clothing with sharp comfort.</h2>
          <div className="hero-actions">
            <button className="primary large" onClick={() => setPage('shop')}>Shop Collection</button>
            <button className="ghost large" onClick={() => setPage('admin')}>Owner Panel</button>
          </div>
        </div>
        <div className="hero-gallery">
          {catalog.slice(0, 3).map((p) => <img key={p.id} src={p.images[0]} alt={p.name} />)}
        </div>
      </section>

      <Section title="Featured Products" action={() => setPage('shop')}>
        <ProductGrid products={featured} setSelected={setSelected} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist} />
      </Section>

      <section className="category-band">
        <div>
          <p>Shop by fit</p>
          <h2>Categories made for every day and every plan.</h2>
        </div>
        <div className="category-grid">
          {categoryList.map((cat) => (
            <button key={cat.name} onClick={() => setPage('shop')}>
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <Section title="New Arrivals">
        <ProductGrid products={catalog.filter((p) => p.newArrival)} setSelected={setSelected} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist} />
      </Section>

      <Section title="Best Sellers">
        <ProductGrid products={catalog.filter((p) => p.bestSeller)} setSelected={setSelected} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist} />
      </Section>

      <section className="reviews-band">
        {reviews.map((review) => (
          <article key={review.name}>
            <Stars value={review.rating} />
            <p>"{review.text}"</p>
            <strong>{review.name}</strong>
          </article>
        ))}
      </section>

      <Newsletter />
    </>
  );
}

function Section({ title, children, action }) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        {action && <button onClick={action}>View all</button>}
      </div>
      {children}
    </section>
  );
}

function ProductGrid({ products: list, setSelected, addCart, toggleWish, wishlist }) {
  return (
    <div className="product-grid">
      {list.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpen={(id) => setSelected(id)}
          onCart={addCart}
          onWish={toggleWish}
          wished={wishlist.includes(product.id)}
        />
      ))}
    </div>
  );
}

function Shop({ catalog, categoryList, setSelected, addCart, toggleWish, wishlist }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [size, setSize] = useState('All');
  const [brand, setBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(3500);
  const brands = ['All', ...new Set(catalog.map((p) => p.brand))];
  const filtered = catalog.filter((p) =>
    (category === 'All' || p.category === category) &&
    (size === 'All' || p.sizes.includes(size)) &&
    (brand === 'All' || p.brand === brand) &&
    p.price <= maxPrice &&
    `${p.name} ${p.category} ${p.brand}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="shop-layout">
      <aside className="filters">
        <h2>Shop Brocode</h2>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" />
        <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}><option>All</option>{categoryList.map((c) => <option key={c.name}>{c.name}</option>)}</select></label>
        <label>Size<select value={size} onChange={(e) => setSize(e.target.value)}>{['All', 'S', 'M', 'L', 'XL'].map((s) => <option key={s}>{s}</option>)}</select></label>
        <label>Brand<select value={brand} onChange={(e) => setBrand(e.target.value)}>{brands.map((b) => <option key={b}>{b}</option>)}</select></label>
        <label>Price up to {money(maxPrice)}<input type="range" min="900" max="3500" step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} /></label>
        <div className="swatches">{['Black', 'White', 'Red', 'Blue', 'Olive'].map((c) => <span key={c} title={c} className={c.toLowerCase()} />)}</div>
      </aside>
      <section className="shop-results">
        <div className="section-head"><h2>{filtered.length} Products</h2><p>Sizes, colors, discounts and fast checkout ready.</p></div>
        <ProductGrid products={filtered} setSelected={setSelected} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist} />
      </section>
    </main>
  );
}

function ProductDetails({ product, catalog, addCart, setPage, setSelected }) {
  const [image, setImage] = useState(product.images[0]);
  const related = catalog.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  return (
    <main className="details-page">
      <div className="details-media">
        <img className="main-product" src={image} alt={product.name} />
        <div className="thumbs">{product.images.map((img, index) => <button key={img} onClick={() => setImage(img)} aria-label={`View ${product.name} image ${index + 1}`}><img src={img} alt={`${product.name} view ${index + 1}`} /></button>)}</div>
      </div>
      <div className="details-copy">
        <p>{product.brand} / {product.category}</p>
        <h1>{product.name}</h1>
        <div className="price-row big"><strong>{money(product.price)}</strong><span>{product.discount}% off</span></div>
        <Stars value={product.rating} />
        <p>{product.description}</p>
        <div className="option-row">{product.sizes.map((s) => <button key={s}>{s}</button>)}</div>
        <div className="option-row">{product.colors.map((c) => <button key={c}>{c}</button>)}</div>
        <div className="hero-actions">
          <button className="primary large" onClick={() => addCart(product)}>Add to Cart</button>
          <button className="large" onClick={() => { addCart(product); setPage('checkout'); }}>Buy Now</button>
        </div>
        <div className="tracking">
          <span>Order tracking</span>
          <strong>Dispatched in 24 hours after payment confirmation.</strong>
        </div>
      </div>
      <Section title="Related Products">
        <ProductGrid products={related} setSelected={setSelected} addCart={addCart} toggleWish={() => {}} wishlist={[]} />
      </Section>
    </main>
  );
}

function Cart({ cart, setCart, setPage }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal > 4000 ? 400 : 0;
  return (
    <main className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-grid">
        <section>
          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.images[0]} alt={item.name} />
              <div><h3>{item.name}</h3><p>{money(item.price)}</p></div>
              <input type="number" min="1" value={item.qty} onChange={(e) => setCart(cart.map((p) => p.id === item.id ? { ...p, qty: Number(e.target.value) } : p))} />
              <button onClick={() => setCart(cart.filter((p) => p.id !== item.id))}>Remove</button>
            </article>
          ))}
        </section>
        <aside className="summary">
          <input placeholder="Coupon code" />
          <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <div><span>Discount</span><strong>- {money(discount)}</strong></div>
          <div><span>Total</span><strong>{money(subtotal - discount)}</strong></div>
          <button className="primary large" onClick={() => setPage('checkout')}>Checkout</button>
        </aside>
      </div>
    </main>
  );
}

function Checkout({ cart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const [payment, setPayment] = useState('Cash on Delivery');
  const [status, setStatus] = useState('');

  function placeOrder(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('website')) return;
    setStatus(`Demo order ready with ${payment}. Connect the payment gateway before accepting live orders.`);
  }

  return (
    <main className="checkout">
      <form className="form-panel" onSubmit={placeOrder}>
        <h1>Checkout</h1>
        <Honeypot />
        <label>Full name<input name="name" placeholder="Full name" autoComplete="name" required /></label>
        <label>Phone number<input name="phone" type="tel" placeholder="Phone number" autoComplete="tel" pattern="[0-9 +()-]{8,}" required /></label>
        <label>Street address<input name="address" placeholder="Street address" autoComplete="street-address" required /></label>
        <div className="split"><label>City<input name="city" placeholder="City" autoComplete="address-level2" required /></label><label>PIN code<input name="pin" inputMode="numeric" pattern="[0-9]{5,6}" placeholder="PIN code" autoComplete="postal-code" required /></label></div>
        <h3>Payment Method</h3>
        <div className="payment-methods">{['UPI', 'Credit/Debit Card', 'Cash on Delivery'].map((m) => <button type="button" className={payment === m ? 'selected' : ''} key={m} onClick={() => setPayment(m)}>{m}</button>)}</div>
        {status && <p className="form-success" role="status">{status}</p>}
        <button className="primary large" type="submit">Place Order</button>
      </form>
      <aside className="summary">
        <h2>Order Summary</h2>
        {cart.map((item) => <div key={item.id}><span>{item.name} x {item.qty}</span><strong>{money(item.price * item.qty)}</strong></div>)}
        <div><span>Total</span><strong>{money(total)}</strong></div>
      </aside>
    </main>
  );
}

function Login() {
  const [loginStatus, setLoginStatus] = useState('');
  const [signupStatus, setSignupStatus] = useState('');

  async function login(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.website) return;
    if (!apiBase) {
      setLoginStatus('Customer authentication is not connected in this preview.');
      return;
    }
    try {
      const response = await fetch(apiUrl('/api/auth/login'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      setLoginStatus(response.ok ? 'Logged in successfully.' : result.error || 'Unable to log in.');
    } catch {
      setLoginStatus('Authentication service is unavailable.');
    }
  }

  function signup(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.website) return;
    setSignupStatus(apiBase ? 'Account creation is ready for the connected API.' : 'Account creation is available after the API is connected.');
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={login}>
        <h1>Welcome Back</h1>
        <Honeypot />
        <label>Email address<input name="email" type="email" placeholder="Email address" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" placeholder="Password" autoComplete="current-password" minLength="8" required /></label>
        {loginStatus && <p className="form-status" role="status">{loginStatus}</p>}
        <button className="primary large" type="submit">Login</button>
        <button type="button" onClick={() => setLoginStatus('Password reset will be sent by the connected API.')}>Forgot Password?</button>
      </form>
      <form className="auth-card dark-card" onSubmit={signup}>
        <h1>Create Account</h1>
        <Honeypot />
        <label>Full name<input name="name" placeholder="Full name" autoComplete="name" required /></label>
        <label>Email address<input name="email" type="email" placeholder="Email address" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" placeholder="Password" autoComplete="new-password" minLength="8" required /></label>
        {signupStatus && <p className="form-status" role="status">{signupStatus}</p>}
        <button className="primary large" type="submit">Sign Up</button>
      </form>
    </main>
  );
}

function About() {
  return (
    <main className="content-page">
      <h1>Built for people who move with confidence.</h1>
      <p>Brocode is a modern clothing brand focused on crisp streetwear, reliable fabric, and everyday fits that hold up from workdays to weekends.</p>
      <div className="values">
        {['Company Story', 'Mission and Vision', 'Why Choose Us'].map((v) => <article key={v}><h3>{v}</h3><p>Premium materials, honest pricing, fast delivery, and product drops shaped by real customer feedback.</p></article>)}
      </div>
    </main>
  );
}

function Contact() {
  const [status, setStatus] = useState('');

  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.website) return;
    if (!apiBase) {
      setStatus('Message validated. Connect the API to deliver it to the Brocode inbox.');
      return;
    }
    try {
      const response = await fetch(apiUrl('/api/contact'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      setStatus(response.ok ? 'Message sent. We will get back to you soon.' : 'Unable to send the message right now.');
    } catch {
      setStatus('Contact service is unavailable.');
    }
  }

  return (
    <main className="contact-page">
      <form className="form-panel" onSubmit={submit}>
        <h1>Contact Us</h1>
        <Honeypot />
        <label>Name<input name="name" placeholder="Name" autoComplete="name" required /></label>
        <label>Email<input name="email" type="email" placeholder="Email" autoComplete="email" required /></label>
        <label>Message<textarea name="message" placeholder="Message" minLength="10" required /></label>
        {status && <p className="form-status" role="status">{status}</p>}
        <button className="primary large" type="submit">Send Message</button>
      </form>
      <aside className="contact-info">
        <h2>Brocode HQ</h2>
        <p>Phone: +91 98765 43210</p>
        <p>Email: hello@brocode.store</p>
        <p>Instagram / Facebook / X: @brocodewear</p>
        <div className="map">Google Maps Location</div>
      </aside>
    </main>
  );
}

function Blogs({ blogList }) {
  return (
    <main className="content-page">
      <h1>Brocode Journal</h1>
      <div className="blog-grid">
        {blogList.map((blog) => <article key={blog.title}><img src={blog.image} alt={blog.title} /><p>{blog.tag}</p><h3>{blog.title}</h3><span>{blog.excerpt}</span></article>)}
      </div>
    </main>
  );
}

function PrivacyPolicy() {
  return (
    <main className="content-page legal-page">
      <p className="eyebrow">Legal</p>
      <h1>Privacy Policy</h1>
      <p>Brocode uses the information you submit to process orders, answer enquiries, and improve the store experience.</p>
      <h2>What we collect</h2>
      <p>When connected to the production API, we may collect your name, email, phone number, shipping address, order details, and contact messages. Cart, wishlist, theme, and cookie choices may be stored locally in your browser.</p>
      <h2>How we use it</h2>
      <p>We use order and contact information only for fulfilment, support, fraud prevention, and service improvements. We do not store payment card details in this frontend.</p>
      <h2>Choices and contact</h2>
      <p>You can decline optional analytics in the cookie banner. For privacy requests, contact hello@brocode.store.</p>
    </main>
  );
}

function Terms() {
  return (
    <main className="content-page legal-page">
      <p className="eyebrow">Legal</p>
      <h1>Terms and Conditions</h1>
      <p>By using the Brocode store, you agree to provide accurate checkout information and use the service lawfully.</p>
      <h2>Orders and payment</h2>
      <p>Prices, availability, delivery estimates, and payment options are shown at checkout. An order is confirmed only after the production service accepts it.</p>
      <h2>Products and returns</h2>
      <p>Product colours may vary slightly by display. Return and exchange terms should be published here before live sales begin.</p>
      <h2>Updates</h2>
      <p>Brocode may update these terms as the store, delivery partners, and payment providers change.</p>
    </main>
  );
}

function LegacyAdmin() {
  return (
    <main className="admin-page">
      <aside className="admin-nav">
        <img src={logoFallback} alt="Brocode" />
        {['Dashboard', 'Products', 'Categories', 'Orders', 'Customers', 'Blogs', 'Inventory'].map((item) => <button key={item}>{item}</button>)}
      </aside>
      <section className="admin-main">
        <h1>Owner Dashboard</h1>
        <div className="metric-grid">
          <Metric title="Total Orders" value="1,248" />
          <Metric title="Total Products" value="86" />
          <Metric title="Total Customers" value="9,430" />
          <Metric title="Revenue" value="₹42.8L" />
        </div>
        <div className="admin-split">
          <section className="panel">
            <h2>Sales Analytics</h2>
            <div className="chart">{[40, 65, 52, 80, 72, 94, 88].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div>
          </section>
          <section className="panel">
            <h2>Add Product</h2>
            <div className="admin-form">
              {['Product Name', 'Category', 'Description', 'Price', 'Discount', 'Available Sizes', 'Colors', 'Stock Quantity'].map((f) => <input key={f} placeholder={f} />)}
              <button className="primary">Upload Multiple Images</button>
            </div>
          </section>
        </div>
        <section className="panel">
          <h2>Recent Orders</h2>
          <table><tbody>{seedOrders.map((o) => <tr key={o.id}><td>{o.id}</td><td>{o.customer}</td><td>{money(o.total)}</td><td><select defaultValue={o.status}>{['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table>
        </section>
        <section className="panel">
          <h2>Customer Management</h2>
          <table><tbody>{customers.map((c) => <tr key={c.email}><td>{c.name}</td><td>{c.email}</td><td>{c.orders} orders</td><td>{money(c.spent)}</td></tr>)}</tbody></table>
        </section>
        <section className="panel alerts">
          <h2>Inventory Alerts</h2>
          {seedProducts.filter((p) => p.stock < 10).map((p) => <p key={p.id}>{p.name} has only {p.stock} units left. Auto-stock deduction is enabled after orders.</p>)}
        </section>
      </section>
    </main>
  );
}

function AdminPanel({ catalog, setCatalog, categoryList, setCategoryList, blogList, setBlogList, orderList, setOrderList }) {
  const [adminAuthed, setAdminAuthed] = useState(Boolean(localStorage.getItem('brocodeAdminToken')));
  const [adminError, setAdminError] = useState('');
  const [active, setActive] = useState('Dashboard');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: categoryList[0]?.name || 'T-Shirts',
    brand: 'Brocode Core',
    description: '',
    price: '',
    discount: '',
    sizes: 'S,M,L,XL',
    colors: 'Black,White',
    stock: '',
    image: ''
  });
  const [categoryName, setCategoryName] = useState('');
  const [blogForm, setBlogForm] = useState({ title: '', tag: 'Style Guide', excerpt: '', image: '' });

  async function adminLogin(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.website) return;
    if (!apiBase) {
      setAdminError('Admin API is not configured for this preview.');
      return;
    }
    try {
      const response = await fetch(apiUrl('/api/auth/login'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok || result.user?.role !== 'admin') {
        setAdminError(response.ok ? 'This account does not have owner access.' : result.error || 'Invalid owner credentials.');
        return;
      }
      localStorage.setItem('brocodeAdminToken', result.token);
      setAdminAuthed(true);
      setAdminError('');
    } catch {
      setAdminError('Admin authentication service is unavailable.');
    }
  }

  function resetProductForm() {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: categoryList[0]?.name || 'T-Shirts',
      brand: 'Brocode Core',
      description: '',
      price: '',
      discount: '',
      sizes: 'S,M,L,XL',
      colors: 'Black,White',
      stock: '',
      image: ''
    });
  }

  function saveProduct(event) {
    event.preventDefault();
    const nextProduct = {
      id: editingProduct || Date.now(),
      name: productForm.name || 'Untitled Product',
      category: productForm.category,
      brand: productForm.brand || 'Brocode',
      description: productForm.description || 'Premium Brocode clothing item.',
      price: Number(productForm.price || 999),
      discount: Number(productForm.discount || 0),
      sizes: productForm.sizes.split(',').map((item) => item.trim()).filter(Boolean),
      colors: productForm.colors.split(',').map((item) => item.trim()).filter(Boolean),
      stock: Number(productForm.stock || 0),
      rating: 5,
      featured: true,
      newArrival: true,
      bestSeller: false,
      bg: 'linear-gradient(135deg,#111,#c80012)',
      images: [productForm.image || catalog[0]?.images?.[0] || logoFallback]
    };
    setCatalog((items) => editingProduct ? items.map((item) => item.id === editingProduct ? { ...item, ...nextProduct } : item) : [nextProduct, ...items]);
    resetProductForm();
  }

  function editProduct(product) {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      description: product.description,
      price: product.price,
      discount: product.discount,
      sizes: product.sizes.join(','),
      colors: product.colors.join(','),
      stock: product.stock,
      image: product.images[0]
    });
    setActive('Products');
  }

  function addCategory(event) {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name || categoryList.some((cat) => cat.name.toLowerCase() === name.toLowerCase())) return;
    setCategoryList((items) => [...items, { name, icon: name.slice(0, 2).toUpperCase() }]);
    setCategoryName('');
  }

  function addBlog(event) {
    event.preventDefault();
    if (!blogForm.title.trim()) return;
    setBlogList((items) => [{ ...blogForm, image: blogForm.image || catalog[0]?.images?.[0] }, ...items]);
    setBlogForm({ title: '', tag: 'Style Guide', excerpt: '', image: '' });
  }

  if (!adminAuthed) {
    return (
      <main className="admin-login-page">
        <form className="auth-card admin-login" onSubmit={adminLogin}>
          <img src={logoFallback} alt="Brocode" />
          <h1>Owner Login</h1>
          <p>Owner access is verified by the secure Brocode API.</p>
          <Honeypot />
          <label>Email<input name="email" type="email" placeholder="Owner email" autoComplete="username" required /></label>
          <label>Password<input name="password" type="password" placeholder="Password" autoComplete="current-password" minLength="8" required /></label>
          {adminError && <strong className="form-error">{adminError}</strong>}
          <button className="primary large">Login to Admin</button>
        </form>
      </main>
    );
  }

  const revenue = orderList.reduce((sum, item) => sum + item.total, 0);
  const navItems = ['Dashboard', 'Products', 'Categories', 'Orders', 'Customers', 'Blogs', 'Inventory'];

  return (
    <main className="admin-page">
      <aside className="admin-nav">
        <img src={logoFallback} alt="Brocode" />
        {navItems.map((item) => <button key={item} className={active === item ? 'active' : ''} onClick={() => setActive(item)}>{item}</button>)}
        <button className="danger" onClick={() => { localStorage.removeItem('brocodeAdminToken'); setAdminAuthed(false); }}>Logout</button>
      </aside>
      <section className="admin-main">
        <div className="admin-title">
          <h1>{active}</h1>
          <span>Owner secure panel</span>
        </div>

        {active === 'Dashboard' && (
          <>
            <div className="metric-grid">
              <Metric title="Total Orders" value={orderList.length} />
              <Metric title="Total Products" value={catalog.length} />
              <Metric title="Total Customers" value={customers.length} />
              <Metric title="Revenue" value={money(revenue)} />
            </div>
            <div className="admin-split">
              <section className="panel">
                <h2>Sales Analytics</h2>
                <div className="chart">{[40, 65, 52, 80, 72, 94, 88].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div>
              </section>
              <section className="panel alerts">
                <h2>Low Stock Alerts</h2>
                {catalog.filter((p) => p.stock < 10).map((p) => <p key={p.id}>{p.name} has only {p.stock} units left.</p>)}
              </section>
            </div>
          </>
        )}

        {active === 'Products' && (
          <>
            <section className="panel">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <form className="admin-form" onSubmit={saveProduct}>
                <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="Product Name" />
                <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>{categoryList.map((cat) => <option key={cat.name}>{cat.name}</option>)}</select>
                <input value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} placeholder="Brand" />
                <input value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="Price" />
                <input value={productForm.discount} onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })} placeholder="Discount" />
                <input value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} placeholder="Stock Quantity" />
                <input value={productForm.sizes} onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })} placeholder="Available Sizes" />
                <input value={productForm.colors} onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })} placeholder="Colors" />
                <input value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} placeholder="Image URL" />
                <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Description" />
                <button className="primary">{editingProduct ? 'Save Changes' : 'Add Product'}</button>
                {editingProduct && <button type="button" onClick={resetProductForm}>Cancel Edit</button>}
              </form>
            </section>
            <AdminTable headers={['Product', 'Category', 'Price', 'Stock', 'Actions']}>
              {catalog.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.category}</td><td>{money(p.price)}</td><td>{p.stock}</td><td><button onClick={() => editProduct(p)}>Edit</button><button className="danger-text" onClick={() => setCatalog(catalog.filter((item) => item.id !== p.id))}>Delete</button></td></tr>)}
            </AdminTable>
          </>
        )}

        {active === 'Categories' && (
          <section className="panel">
            <h2>Category Management</h2>
            <form className="inline-form" onSubmit={addCategory}>
              <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="New category name" />
              <button className="primary">Add Category</button>
            </form>
            <table><tbody>{categoryList.map((cat) => <tr key={cat.name}><td>{cat.name}</td><td>{cat.icon}</td><td><button onClick={() => setCategoryList(categoryList.filter((item) => item.name !== cat.name))}>Delete</button></td></tr>)}</tbody></table>
          </section>
        )}

        {active === 'Orders' && (
          <AdminTable headers={['Order', 'Customer', 'Total', 'Status']}>
            {orderList.map((o) => <tr key={o.id}><td>{o.id}</td><td>{o.customer}</td><td>{money(o.total)}</td><td><select value={o.status} onChange={(e) => setOrderList(orderList.map((item) => item.id === o.id ? { ...item, status: e.target.value } : item))}>{['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}</select></td></tr>)}
          </AdminTable>
        )}

        {active === 'Customers' && (
          <AdminTable headers={['Name', 'Email', 'Orders', 'Spent']}>
            {customers.map((c) => <tr key={c.email}><td>{c.name}</td><td>{c.email}</td><td>{c.orders}</td><td>{money(c.spent)}</td></tr>)}
          </AdminTable>
        )}

        {active === 'Blogs' && (
          <>
            <section className="panel">
              <h2>Blog Management</h2>
              <form className="admin-form" onSubmit={addBlog}>
                <input value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} placeholder="Blog title" />
                <input value={blogForm.tag} onChange={(e) => setBlogForm({ ...blogForm, tag: e.target.value })} placeholder="Category / Tag" />
                <input value={blogForm.image} onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })} placeholder="Blog image URL" />
                <textarea value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} placeholder="Excerpt" />
                <button className="primary">Add Blog</button>
              </form>
            </section>
            <AdminTable headers={['Title', 'Tag', 'Actions']}>
              {blogList.map((blog) => <tr key={blog.title}><td>{blog.title}</td><td>{blog.tag}</td><td><button className="danger-text" onClick={() => setBlogList(blogList.filter((item) => item.title !== blog.title))}>Delete</button></td></tr>)}
            </AdminTable>
          </>
        )}

        {active === 'Inventory' && (
          <AdminTable headers={['Product', 'Current Stock', 'Update Stock']}>
            {catalog.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.stock}</td><td><input type="number" value={p.stock} onChange={(e) => setCatalog(catalog.map((item) => item.id === p.id ? { ...item, stock: Number(e.target.value) } : item))} /></td></tr>)}
          </AdminTable>
        )}
      </section>
    </main>
  );
}

function AdminTable({ headers, children }) {
  return (
    <section className="panel table-panel">
      <table>
        <thead><tr>{headers.map((head) => <th key={head}>{head}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </section>
  );
}

function Metric({ title, value }) {
  return <article className="metric"><p>{title}</p><strong>{value}</strong></article>;
}

function Wishlist({ catalog, wishlist, setSelected, addCart, toggleWish }) {
  const list = catalog.filter((p) => wishlist.includes(p.id));
  return <main className="content-page"><h1>Wishlist</h1><ProductGrid products={list} setSelected={setSelected} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist} /></main>;
}

function App() {
  const [page, setPage] = useState('home');
  const [selected, setSelectedState] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [dark, setDark] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(() => localStorage.getItem('brocodeCookieConsent'));
  const [catalog, setCatalog] = useState(seedProducts);
  const [categoryList, setCategoryList] = useState(seedCategories);
  const [blogList, setBlogList] = useState(seedBlogs);
  const [orderList, setOrderList] = useState(seedOrders);
  const selectedProduct = useMemo(() => catalog.find((p) => p.id === selected), [catalog, selected]);
  usePageSeo(page, selectedProduct);
  useAnalytics(cookieConsent);

  function setSelected(id) {
    setSelectedState(id);
    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]').filter((x) => x !== id);
    localStorage.setItem('recentlyViewed', JSON.stringify([id, ...recent].slice(0, 6)));
    setPage('product');
  }

  function addCart(product) {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      return existing ? items.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...items, { ...product, qty: 1 }];
    });
  }

  function toggleWish(id) {
    setWishlist((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);
  }

  let screen = <Home catalog={catalog} categoryList={categoryList} setPage={setPage} setSelected={setSelected} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist} />;
  if (page === 'shop') screen = <Shop catalog={catalog} categoryList={categoryList} setSelected={setSelected} addCart={addCart} toggleWish={toggleWish} wishlist={wishlist} />;
  if (page === 'product' && selectedProduct) screen = <ProductDetails product={selectedProduct} catalog={catalog} addCart={addCart} setPage={setPage} setSelected={setSelected} />;
  if (page === 'cart') screen = <Cart cart={cart} setCart={setCart} setPage={setPage} />;
  if (page === 'checkout') screen = <Checkout cart={cart} />;
  if (page === 'login') screen = <Login />;
  if (page === 'about') screen = <About />;
  if (page === 'contact') screen = <Contact />;
  if (page === 'blogs') screen = <Blogs blogList={blogList} />;
  if (page === 'privacy') screen = <PrivacyPolicy />;
  if (page === 'terms') screen = <Terms />;
  if (page === 'admin') screen = <AdminPanel catalog={catalog} setCatalog={setCatalog} categoryList={categoryList} setCategoryList={setCategoryList} blogList={blogList} setBlogList={setBlogList} orderList={orderList} setOrderList={setOrderList} />;
  if (page === 'wishlist') screen = <Wishlist catalog={catalog} wishlist={wishlist} setSelected={setSelected} addCart={addCart} toggleWish={toggleWish} />;

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <Header page={page} setPage={setPage} cartCount={cart.reduce((s, i) => s + i.qty, 0)} wishlistCount={wishlist.length} dark={dark} setDark={setDark} />
      {screen}
      <footer>
        <div><strong>Brocode</strong><span>Premium clothing store with JWT-ready Flask backend, MySQL schema, analytics, wishlist, reviews, order tracking and recommendations.</span></div>
        <div className="footer-links"><button onClick={() => setPage('privacy')}>Privacy Policy</button><button onClick={() => setPage('terms')}>Terms and Conditions</button></div>
      </footer>
      {!cookieConsent && <CookieBanner onChoice={(choice) => { localStorage.setItem('brocodeCookieConsent', choice); setCookieConsent(choice); }} />}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
