import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultInitialData = {
  categories: [
    {
      id: 1,
      name: 'Men',
      slug: 'men',
      description: 'Men puffed jackets, streetwear sets, and outerwear',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Women',
      slug: 'women',
      description: 'Women jackets, tailored coats, and blazers',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Kids',
      slug: 'kids',
      description: 'Junior streetwear and winter wear',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'New In',
      slug: 'new-in',
      description: 'Fresh arrivals and limited edition drops',
      created_at: new Date().toISOString()
    }
  ],
  products: [
    {
      id: 1,
      category_id: 1,
      name: 'Black Jacket Puffed',
      price: 499.00,
      description: 'Ultra-lightweight goose down insulation with water-repellent matte shell and storm collar.',
      image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      stock: 25,
      variant: 'Agora',
      specs: 'Size: XXL · Color: Black · Thermal Warmth',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      category_id: 2,
      name: 'Women White jacket',
      price: 1000.00,
      description: 'Exquisite double-breasted tailored coat crafted from premium Italian wool cashmere blend.',
      image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      stock: 15,
      variant: 'Allure',
      specs: 'Size: XL · Color: Smoke white · 100% Cashmere',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      category_id: 1,
      name: 'Orange Full wear',
      price: 1200.00,
      description: 'Signature statement two-piece streetwear suit featuring technical ripstop nylon and tailored seams.',
      image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      stock: 18,
      variant: 'Vibe',
      specs: 'Size: L · Color: Electric Orange · Unisex Cut',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      category_id: 1,
      name: 'Men Top Black Puffed Jacket',
      price: 999.00,
      description: 'Architectural high-density silhouette with heat-sealed baffled chambers and magnetic storm placket.',
      image_url: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80',
      stock: 30,
      variant: 'Men\'s Black',
      specs: 'Size: L · Color: Black · Water Resistant',
      created_at: new Date().toISOString()
    }
  ],
  customers: [
    {
      id: 1,
      first_name: 'Divyansh',
      last_name: 'Agarwal',
      email: 'divyansh@webyansh.com',
      phone: '+91 6377588843',
      address: 'Silicon Tech Park, Tower B, Suite 402',
      city: 'Bangalore',
      state: 'Karnataka',
      zip_code: '560021',
      created_at: new Date().toISOString()
    }
  ],
  orders: [
    {
      id: 1,
      customer_id: 1,
      order_number: 'ORD-0001',
      order_date: '2026-11-22T08:30:00.000Z',
      shipping_method: 'Free Shipping',
      shipping_fee: 0.00,
      subtotal: 2699.00,
      discount: 0.00,
      total_amount: 2699.00,
      amount_khr: 11065900,
      status: 'Confirmed',
      payment_method: 'KHQR (Bakong)',
      payment_status: 'Paid',
      bank_receiver: 'POOK PHANNA',
      bank_account: '••••5034',
      transaction_ref: 'TXN-KHQR-990812',
      notes: 'Deliver during business hours.'
    }
  ],
  order_items: [
    {
      id: 1,
      order_id: 1,
      product_id: 1,
      product_name: 'Black Jacket Puffed',
      quantity: 1,
      unit_price: 499.00,
      total_price: 499.00
    },
    {
      id: 2,
      order_id: 1,
      product_id: 2,
      product_name: 'Women White jacket',
      quantity: 1,
      unit_price: 1000.00,
      total_price: 1000.00
    },
    {
      id: 3,
      order_id: 1,
      product_id: 3,
      product_name: 'Orange Full wear',
      quantity: 1,
      unit_price: 1200.00,
      total_price: 1200.00
    }
  ],
  counters: {
    nextCustomerId: 2,
    nextOrderId: 2,
    nextOrderItemId: 4,
    orderCodeSeq: 2
  }
};

class Database {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      } catch (err) {
        console.error('Error reading database file, using defaults:', err.message);
      }
    }
    this.saveData(defaultInitialData);
    return JSON.parse(JSON.stringify(defaultInitialData));
  }

  saveData(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err.message);
    }
  }

  getCategories() {
    return this.data.categories;
  }

  getProducts() {
    return this.data.products.map(p => {
      const category = this.data.categories.find(c => c.id === p.category_id);
      return {
        ...p,
        category_name: category ? category.name : 'General'
      };
    });
  }

  getProductById(id) {
    const product = this.data.products.find(p => p.id === Number(id));
    if (!product) return null;
    const category = this.data.categories.find(c => c.id === product.category_id);
    return {
      ...product,
      category_name: category ? category.name : 'General'
    };
  }

  getCustomerByEmail(email) {
    if (!email) return null;
    return this.data.customers.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
  }

  createOrUpdateCustomer(customerData) {
    let customer = this.getCustomerByEmail(customerData.email);
    if (customer) {
      customer.first_name = customerData.first_name || customer.first_name;
      customer.last_name = customerData.last_name || customer.last_name;
      customer.phone = customerData.phone || customer.phone;
      customer.address = customerData.address || customer.address;
      customer.city = customerData.city || customer.city;
      customer.state = customerData.state || customer.state;
      customer.zip_code = customerData.zip_code || customer.zip_code;
    } else {
      customer = {
        id: this.data.counters.nextCustomerId++,
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        zip_code: customerData.zip_code,
        created_at: new Date().toISOString()
      };
      this.data.customers.push(customer);
    }
    this.saveData();
    return customer;
  }

  createOrder({
    customer,
    items,
    shippingMethod,
    shippingFee = 0,
    discount = 0,
    notes = '',
    paymentMethod = 'KHQR (Bakong)',
    paymentStatus = 'Paid',
    bankReceiver = 'POOK PHANNA',
    bankAccount = '••••5034',
    paymentSlip = null
  }) {
    if (!items || !items.length) {
      throw new Error('Order items cannot be empty');
    }

    const savedCustomer = this.createOrUpdateCustomer(customer);

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = this.getProductById(item.productId || item.id);
      if (!product) {
        throw new Error(`Product with ID ${item.productId || item.id} not found`);
      }
      const qty = Math.max(1, parseInt(item.quantity || item.qty || 1, 10));
      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        quantity: qty,
        unit_price: unitPrice,
        total_price: lineTotal
      });
    }

    const calculatedShipping = Number(shippingFee) || 0;
    const calculatedDiscount = Math.min(subtotal, Math.max(0, Number(discount) || 0));
    const grandTotal = Math.max(0, subtotal - calculatedDiscount + calculatedShipping);
    const amountKhr = Math.round(grandTotal * 4100);

    const seq = this.data.counters.orderCodeSeq++;
    const orderNumber = `ORD-${String(seq).padStart(4, '0')}`;
    const transactionRef = `TXN-KHQR-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderId = this.data.counters.nextOrderId++;
    const newOrder = {
      id: orderId,
      customer_id: savedCustomer.id,
      order_number: orderNumber,
      order_date: new Date().toISOString(),
      shipping_method: shippingMethod || 'Standard Shipping',
      shipping_fee: calculatedShipping,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(calculatedDiscount.toFixed(2)),
      total_amount: parseFloat(grandTotal.toFixed(2)),
      amount_khr: amountKhr,
      status: paymentStatus === 'Paid' ? 'Confirmed' : 'Pending',
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      bank_receiver: bankReceiver,
      bank_account: bankAccount,
      transaction_ref: transactionRef,
      payment_slip: paymentSlip,
      notes: notes || ''
    };

    this.data.orders.push(newOrder);

    const createdItems = [];
    for (const vItem of validatedItems) {
      const orderItemId = this.data.counters.nextOrderItemId++;
      const itemRecord = {
        id: orderItemId,
        order_id: orderId,
        product_id: vItem.product_id,
        product_name: vItem.product_name,
        product_image: vItem.product_image,
        quantity: vItem.quantity,
        unit_price: vItem.unit_price,
        total_price: vItem.total_price
      };
      this.data.order_items.push(itemRecord);
      createdItems.push(itemRecord);
    }

    this.saveData();

    return {
      ...newOrder,
      customer: savedCustomer,
      items: createdItems
    };
  }

  getOrderByIdOrNumber(identifier) {
    let order = null;
    if (typeof identifier === 'string' && identifier.startsWith('ORD-')) {
      order = this.data.orders.find(o => o.order_number.toUpperCase() === identifier.toUpperCase());
    } else {
      order = this.data.orders.find(o => o.id === Number(identifier));
    }

    if (!order) return null;

    const customer = this.data.customers.find(c => c.id === order.customer_id);
    const items = this.data.order_items
      .filter(i => i.order_id === order.id)
      .map(item => {
        const prod = this.getProductById(item.product_id);
        return {
          ...item,
          product_image: prod ? prod.image_url : null
        };
      });

    return {
      ...order,
      customer,
      items
    };
  }

  getAllOrders() {
    return this.data.orders.map(order => {
      const customer = this.data.customers.find(c => c.id === order.customer_id);
      const items = this.data.order_items.filter(i => i.order_id === order.id);
      return {
        ...order,
        customer,
        item_count: items.reduce((sum, item) => sum + item.quantity, 0)
      };
    }).sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
  }

  getSchemaMetadata() {
    return {
      database_name: "ecommerce_db",
      tables: [
        {
          name: "categories",
          description: "Categories (Men, Women, Kids, New In)",
          columns: [
            { name: "id", type: "INTEGER", pk: true, nullable: false, desc: "Primary key identifier" },
            { name: "name", type: "VARCHAR(100)", pk: false, nullable: false, desc: "Category display name" },
            { name: "slug", type: "VARCHAR(100)", pk: false, nullable: false, desc: "URL-friendly slug" },
            { name: "description", type: "TEXT", pk: false, nullable: true, desc: "Category description" },
            { name: "created_at", type: "TIMESTAMP", pk: false, nullable: false, desc: "Record timestamp" }
          ],
          count: this.data.categories.length
        },
        {
          name: "products",
          description: "Products (Black Jacket Puffed, Women White jacket, Orange Full wear, Men Top Black Puffed Jacket)",
          columns: [
            { name: "id", type: "INTEGER", pk: true, nullable: false, desc: "Primary key identifier" },
            { name: "category_id", type: "INTEGER", pk: false, fk: { table: "categories", column: "id" }, nullable: false, desc: "Foreign key to categories" },
            { name: "name", type: "VARCHAR(255)", pk: false, nullable: false, desc: "Product name" },
            { name: "price", type: "DECIMAL(10,2)", pk: false, nullable: false, desc: "Unit price" },
            { name: "description", type: "TEXT", pk: false, nullable: true, desc: "Detailed specs" },
            { name: "image_url", type: "VARCHAR(500)", pk: false, nullable: true, desc: "Product photo URL" },
            { name: "stock", type: "INTEGER", pk: false, nullable: false, desc: "Inventory quantity" },
            { name: "created_at", type: "TIMESTAMP", pk: false, nullable: false, desc: "Record timestamp" }
          ],
          count: this.data.products.length
        },
        {
          name: "customers",
          description: "Customers table",
          columns: [
            { name: "id", type: "INTEGER", pk: true, nullable: false, desc: "Primary key identifier" },
            { name: "first_name", type: "VARCHAR(100)", pk: false, nullable: false, desc: "Customer given name" },
            { name: "last_name", type: "VARCHAR(100)", pk: false, nullable: false, desc: "Customer surname" },
            { name: "email", type: "VARCHAR(255)", pk: false, nullable: false, desc: "Unique email address" },
            { name: "phone", type: "VARCHAR(50)", pk: false, nullable: false, desc: "Contact phone number" },
            { name: "address", type: "TEXT", pk: false, nullable: false, desc: "Street address" },
            { name: "city", type: "VARCHAR(100)", pk: false, nullable: false, desc: "City name" },
            { name: "state", type: "VARCHAR(100)", pk: false, nullable: false, desc: "State or province" },
            { name: "zip_code", type: "VARCHAR(20)", pk: false, nullable: false, desc: "Postal / ZIP code" },
            { name: "created_at", type: "TIMESTAMP", pk: false, nullable: false, desc: "Record timestamp" }
          ],
          count: this.data.customers.length
        },
        {
          name: "orders",
          description: "Orders table with KHQR Bank transfer integration",
          columns: [
            { name: "id", type: "INTEGER", pk: true, nullable: false, desc: "Primary key identifier" },
            { name: "customer_id", type: "INTEGER", pk: false, fk: { table: "customers", column: "id" }, nullable: false, desc: "Foreign key to customers" },
            { name: "order_number", type: "VARCHAR(50)", pk: false, nullable: false, desc: "e.g. ORD-0001" },
            { name: "order_date", type: "TIMESTAMP", pk: false, nullable: false, desc: "Date placed" },
            { name: "shipping_method", type: "VARCHAR(50)", pk: false, nullable: false, desc: "Shipping speed" },
            { name: "shipping_fee", type: "DECIMAL(10,2)", pk: false, nullable: false, desc: "Shipping cost" },
            { name: "subtotal", type: "DECIMAL(10,2)", pk: false, nullable: false, desc: "Items Subtotal" },
            { name: "discount", type: "DECIMAL(10,2)", pk: false, nullable: false, desc: "Discount" },
            { name: "total_amount", type: "DECIMAL(10,2)", pk: false, nullable: false, desc: "Total USD" },
            { name: "amount_khr", type: "BIGINT", pk: false, nullable: false, desc: "Total KHR (៛)" },
            { name: "status", type: "VARCHAR(50)", pk: false, nullable: false, desc: "Pending / Confirmed" },
            { name: "payment_method", type: "VARCHAR(50)", pk: false, nullable: false, desc: "KHQR (Bakong)" },
            { name: "payment_status", type: "VARCHAR(50)", pk: false, nullable: false, desc: "Paid" },
            { name: "bank_receiver", type: "VARCHAR(100)", pk: false, nullable: false, desc: "POOK PHANNA" },
            { name: "bank_account", type: "VARCHAR(50)", pk: false, nullable: false, desc: "••••5034" },
            { name: "transaction_ref", type: "VARCHAR(100)", pk: false, nullable: true, desc: "TXN ref" }
          ],
          count: this.data.orders.length
        },
        {
          name: "order_items",
          description: "Order Items table",
          columns: [
            { name: "id", type: "INTEGER", pk: true, nullable: false, desc: "Primary key identifier" },
            { name: "order_id", type: "INTEGER", pk: false, fk: { table: "orders", column: "id" }, nullable: false, desc: "Foreign key to orders" },
            { name: "product_id", type: "INTEGER", pk: false, fk: { table: "products", column: "id" }, nullable: false, desc: "Foreign key to products" },
            { name: "quantity", type: "INTEGER", pk: false, nullable: false, desc: "Quantity" },
            { name: "unit_price", type: "DECIMAL(10,2)", pk: false, nullable: false, desc: "Price" },
            { name: "total_price", type: "DECIMAL(10,2)", pk: false, nullable: false, desc: "Total" }
          ],
          count: this.data.order_items.length
        }
      ],
      relationships: [
        { from: "products", to: "categories", type: "N:1", label: "categorized under", foreign_key: "category_id -> categories.id" },
        { from: "orders", to: "customers", type: "N:1", label: "placed by", foreign_key: "customer_id -> customers.id" },
        { from: "order_items", to: "orders", type: "N:1", label: "belongs to", foreign_key: "order_id -> orders.id" },
        { from: "order_items", to: "products", type: "N:1", label: "references", foreign_key: "product_id -> products.id" }
      ]
    };
  }
}

export const db = new Database();
