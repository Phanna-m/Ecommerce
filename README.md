# 🛒 Clean E-Commerce Full-Stack Flow (React & Node.js)

គម្រោងអនុវត្ត E-Commerce តាមលំហាត់អនុវត្ត (Practical Exercise) ទាំង ៤ ដំណាក់កាល ដោយប្រើ **React 19 + Vite + Tailwind CSS** និង **Node.js Express Backend** ជាមួយទិន្នន័យទំនាក់ទំនង relational schema (ERD) យ៉ាងស្អាត មិនរញ៉េរញ៉ៃ។

---

## 📁 រចនាសម្ព័ន្ធ Folder (Clean Project Structure)

```
d:\Ecommerce\
├── backend/                  # Node.js Express REST API Server
│   ├── data/
│   │   └── database.json     # Relational database persistence
│   ├── db.js                 # Database engine & SQL schema metadata
│   ├── server.js             # Express API endpoints
│   ├── schema.sql            # ANSI SQL DDL (5 Tables: Customers, Categories, Products, Orders, Order_Items)
│   ├── seed.sql              # Initial SQL seed data (4 products)
│   └── package.json
│
├── frontend/                 # Modern React Vite Application
│   ├── src/
│   │   ├── api.js            # API client with automatic fallback
│   │   ├── context/
│   │   │   └── CartContext.jsx  # Cart state, QTY modifiers, discount & totals
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation with live Cart badge
│   │   │   ├── ProductCard.jsx  # 4 product cards with Add to Cart animation
│   │   │   ├── StepProgress.jsx # Cart > Shipping & Payment > Confirmation
│   │   │   ├── OrderSummary.jsx # Subtotal, Shipping, Promo code, Grand Total
│   │   │   └── ERDViewer.jsx    # Interactive Database ERD & SQL viewer
│   │   ├── pages/
│   │   │   ├── ProductsPage.jsx       # Exercise 1: 4 Products display
│   │   │   ├── CartPage.jsx           # Exercise 1 & 2: Cart & QTY view
│   │   │   ├── CheckoutPage.jsx       # Exercise 2: Shipping form & validation
│   │   │   ├── ConfirmationPage.jsx   # Exercise 3: ORD-0001 success receipt
│   │   │   ├── OrdersHistoryPage.jsx  # Order history list
│   │   │   └── DatabaseERDPage.jsx    # Exercise 4: ERD Architecture
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── start-backend.bat         # 1-Click to run Node.js backend
├── start-frontend.bat        # 1-Click to run React frontend
└── README.md                 # Project documentation
```

---

## 🚀 របៀប Run ដំណើរការ (How to Run)

### 1. ដំណើរការ Backend Server (Node.js API)
បើក Terminal ឬចុច Double-click លើ `start-backend.bat`:
```bash
cd backend
node server.js
```
API នឹងដំណើរការលើ `http://localhost:5000`

### 2. ដំណើរការ Frontend (React Vite)
បើក Terminal មួយទៀត ឬចុច Double-click លើ `start-frontend.bat`:
```bash
cd frontend
npm.cmd run dev
```
បើក Browser ទៅកាន់ `http://localhost:5173`

---

## 📋 ការអនុវត្តតាមតម្រូវការទាំង ៤ ក្នុងឯកសារ PDF

### 1. Practical Exercise 1: Products & Shopping Cart
- **ផលិតផលទាំង ៤:**
  1. Laptop: **$650**
  2. Mouse: **$15**
  3. Keyboard: **$25**
  4. Monitor: **$120**
- **មុខងារ:**
  - បង្ហាញផលិតផលទាំង ៤ ជាមួយរូបភាពស្អាត, Specifications, និងតម្លៃ
  - ប៊ូតុង **Add to Cart** ជាមួយចំនួន QTY selector
  - ទំព័រ **Shopping Cart**:
    - View Cart (រូបភាព, ឈ្មោះ, specs, តម្លៃ)
    - Update QTY (`-` និង `+` ប៊ូតុង)
    - Remove QTY / Delete Item (ប៊ូតុងធុងសំរាម)
    - គណនា **Subtotal** និង **Grand Total**
    - ប៊ូតុង **Proceed to Checkout**

### 2. Practical Exercise 2: Checkout Form
- ទម្រង់បែបបទបំពេញព័ត៌មានអតិថិជន (Customer Shipping Form):
  1. First Name (Required *)
  2. Last Name (Required *)
  3. Email (Required * ជាមួយ format validation)
  4. Phone Number (Required *)
  5. City, State, Zip Code (Required *)
  6. Address / Description (Required *)
- Validation បង្ហាញសារក្រហមច្បាស់ៗពេលខ្វះទិន្នន័យ
- ជ្រើសរើស **Shipping Method**:
  - Free Shipping ($0 · 7-20 Days)
  - Express Shipping ($9 · 1-3 Days)
- បង្ហាញ Order Summary និងគណនា Grand Total ភ្លាមៗ (Realtime)
- ប៊ូតុង **Place Order**

### 3. Practical Exercise 3: Order Confirmation
បន្ទាប់ពីចុច **Place Order**:
- សារជោគជ័យ: **"Order Placed Successfully!"**
- **Order ID:** `ORD-0001` (ឬលំដាប់បន្ទាប់ `ORD-0002`...)
- **Customer Name:** ឈ្មោះអតិថិជន
- **Order Date:** កាលបរិច្ឆេទបញ្ជាទិញ
- **Ordered Products:** តារាងរាយឈ្មោះទំនិញ, តម្លៃឯកតា, ចំនួន, និងសរុប
- **Total Amount:** ចំនួនទឹកប្រាក់សរុប
- **Order Status:** `Pending`
- ប៊ូតុង **Print Receipt** (បោះពុម្ពវិក្កយបត្រ) និង **Continue Shopping**

### 4. Practical Exercise 4: Database Design (ERD)
បង្ហាញទំនាក់ទំនងរវាង Tables ទាំង ៥:
1. `Customers` (id, first_name, last_name, email, phone, address, city, state, zip_code, created_at)
2. `Categories` (id, name, slug, description, created_at)
3. `Products` (id, category_id, name, price, description, image_url, stock, created_at)
4. `Orders` (id, customer_id, order_number, order_date, shipping_method, shipping_fee, subtotal, discount, total_amount, status)
5. `Order_Items` (id, order_id, product_id, quantity, unit_price, total_price)

**ទំនាក់ទំនង Relational Logic:**
- `Categories (1)` ── `(N) Products` (FK: `products.category_id`)
- `Customers (1)` ── `(N) Orders` (FK: `orders.customer_id`)
- `Orders (1)` ── `(N) Order_Items` (FK: `order_items.order_id`)
- `Products (1)` ── `(N) Order_Items` (FK: `order_items.product_id`)
