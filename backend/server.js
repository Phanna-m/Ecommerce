import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Support larger payload for base64 bank slips
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Webyansh Clean E-Commerce API',
    bank: 'POOK PHANNA (Savings ••••5034)',
    timestamp: new Date().toISOString()
  });
});

// 1. Get Categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Get Products (Men & Fashion collection)
app.get('/api/products', (req, res) => {
  try {
    const products = db.getProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Get Single Product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Create Order (Checkout submission with KHQR Bank info)
app.post('/api/orders', (req, res) => {
  try {
    const {
      customer,
      items,
      shippingMethod,
      shippingFee,
      discount,
      notes,
      paymentMethod = 'KHQR (Bakong)',
      paymentStatus = 'Paid',
      bankReceiver = 'POOK PHANNA',
      bankAccount = '••••5034',
      paymentSlip = null
    } = req.body;

    // Field validation for required customer fields
    if (!customer) {
      return res.status(400).json({ success: false, message: 'Customer information is required' });
    }

    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'zip_code'];
    const missing = requiredFields.filter(field => !customer[field] || String(customer[field]).trim() === '');
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required customer fields: ${missing.join(', ')}`,
        missingFields: missing
      });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart cannot be empty' });
    }

    const newOrder = db.createOrder({
      customer,
      items,
      shippingMethod,
      shippingFee,
      discount,
      notes,
      paymentMethod,
      paymentStatus,
      bankReceiver,
      bankAccount,
      paymentSlip
    });

    res.status(201).json({
      success: true,
      message: 'Order Placed & Payment Recorded Successfully!',
      data: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// 5. Update Payment / Bank Slip for an Order
app.post('/api/orders/:identifier/payment', (req, res) => {
  try {
    const { paymentSlip, transactionRef } = req.body;
    const order = db.getOrderByIdOrNumber(req.params.identifier);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update order payment status
    const targetOrder = db.data.orders.find(o => o.id === order.id);
    if (targetOrder) {
      targetOrder.payment_status = 'Paid';
      targetOrder.status = 'Confirmed';
      targetOrder.bank_receiver = 'POOK PHANNA';
      targetOrder.bank_account = '••••5034';
      targetOrder.transaction_ref = transactionRef || `TXN-KHQR-${Date.now().toString().slice(-6)}`;
      targetOrder.paid_at = new Date().toISOString();
      if (paymentSlip) {
        targetOrder.payment_slip = paymentSlip;
      }
      db.saveData();
    }

    const updated = db.getOrderByIdOrNumber(req.params.identifier);
    res.json({ success: true, message: 'Payment confirmed in bank account', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Get All Orders
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.getAllOrders();
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. Get Order by ID or Order Number
app.get('/api/orders/:identifier', (req, res) => {
  try {
    const order = db.getOrderByIdOrNumber(req.params.identifier);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 8. Get Schema Metadata
app.get('/api/schema', (req, res) => {
  try {
    const schema = db.getSchemaMetadata();
    res.json({ success: true, data: schema });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Webyansh E-Commerce API Server Running!`);
  console.log(` Port: http://localhost:${PORT}`);
  console.log(` Bank Account: POOK PHANNA (Savings ••••5034)`);
  console.log(`===============================================`);
});
