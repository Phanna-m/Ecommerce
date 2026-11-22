import React, { useState, useEffect } from 'react';
import { Database, Table, Key, ArrowRight, Code, Copy, Check, Eye, Layers } from 'lucide-react';
import { fetchSchemaMetadata } from '../api';

export default function ERDViewer() {
  const [activeTab, setActiveTab] = useState('diagram');
  const [copied, setCopied] = useState(false);
  const [selectedTable, setSelectedTable] = useState('orders');

  const tables = [
    {
      name: 'categories',
      title: 'Categories',
      color: 'border-blue-300 bg-blue-50/40 text-blue-900',
      badgeColor: 'bg-blue-100 text-blue-700',
      columns: [
        { name: 'id', type: 'INTEGER', isPk: true, desc: 'Primary Key' },
        { name: 'name', type: 'VARCHAR(100)', desc: 'Category Name' },
        { name: 'slug', type: 'VARCHAR(100)', desc: 'Slug URL' },
        { name: 'description', type: 'TEXT', desc: 'Description' },
        { name: 'created_at', type: 'TIMESTAMP', desc: 'Timestamp' }
      ]
    },
    {
      name: 'products',
      title: 'Products',
      color: 'border-indigo-300 bg-indigo-50/40 text-indigo-900',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      columns: [
        { name: 'id', type: 'INTEGER', isPk: true, desc: 'Primary Key' },
        { name: 'category_id', type: 'INTEGER', isFk: true, fkRef: 'categories.id', desc: 'FK -> categories(id)' },
        { name: 'name', type: 'VARCHAR(255)', desc: 'Product Name' },
        { name: 'price', type: 'DECIMAL(10,2)', desc: 'Unit Price' },
        { name: 'description', type: 'TEXT', desc: 'Specifications' },
        { name: 'image_url', type: 'VARCHAR(500)', desc: 'Photo URL' },
        { name: 'stock', type: 'INTEGER', desc: 'Inventory Qty' },
        { name: 'created_at', type: 'TIMESTAMP', desc: 'Timestamp' }
      ]
    },
    {
      name: 'customers',
      title: 'Customers',
      color: 'border-emerald-300 bg-emerald-50/40 text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      columns: [
        { name: 'id', type: 'INTEGER', isPk: true, desc: 'Primary Key' },
        { name: 'first_name', type: 'VARCHAR(100)', desc: 'First Name' },
        { name: 'last_name', type: 'VARCHAR(100)', desc: 'Last Name' },
        { name: 'email', type: 'VARCHAR(255)', desc: 'Unique Email' },
        { name: 'phone', type: 'VARCHAR(50)', desc: 'Contact Phone' },
        { name: 'address', type: 'TEXT', desc: 'Shipping Address' },
        { name: 'city', type: 'VARCHAR(100)', desc: 'City' },
        { name: 'state', type: 'VARCHAR(100)', desc: 'State' },
        { name: 'zip_code', type: 'VARCHAR(20)', desc: 'Zip Code' },
        { name: 'created_at', type: 'TIMESTAMP', desc: 'Timestamp' }
      ]
    },
    {
      name: 'orders',
      title: 'Orders',
      color: 'border-amber-300 bg-amber-50/40 text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-700',
      columns: [
        { name: 'id', type: 'INTEGER', isPk: true, desc: 'Primary Key' },
        { name: 'customer_id', type: 'INTEGER', isFk: true, fkRef: 'customers.id', desc: 'FK -> customers(id)' },
        { name: 'order_number', type: 'VARCHAR(50)', desc: 'e.g. ORD-0001' },
        { name: 'order_date', type: 'TIMESTAMP', desc: 'Order Date' },
        { name: 'shipping_method', type: 'VARCHAR(50)', desc: 'Delivery tier' },
        { name: 'shipping_fee', type: 'DECIMAL(10,2)', desc: 'Shipping Cost' },
        { name: 'subtotal', type: 'DECIMAL(10,2)', desc: 'Items Subtotal' },
        { name: 'discount', type: 'DECIMAL(10,2)', desc: 'Discount Promo' },
        { name: 'total_amount', type: 'DECIMAL(10,2)', desc: 'Grand Total' },
        { name: 'status', type: 'VARCHAR(50)', desc: 'Pending / Completed' }
      ]
    },
    {
      name: 'order_items',
      title: 'Order_Items',
      color: 'border-purple-300 bg-purple-50/40 text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-700',
      columns: [
        { name: 'id', type: 'INTEGER', isPk: true, desc: 'Primary Key' },
        { name: 'order_id', type: 'INTEGER', isFk: true, fkRef: 'orders.id', desc: 'FK -> orders(id)' },
        { name: 'product_id', type: 'INTEGER', isFk: true, fkRef: 'products.id', desc: 'FK -> products(id)' },
        { name: 'quantity', type: 'INTEGER', desc: 'Quantity Ordered' },
        { name: 'unit_price', type: 'DECIMAL(10,2)', desc: 'Price Snapshot' },
        { name: 'total_price', type: 'DECIMAL(10,2)', desc: 'Qty * Unit Price' }
      ]
    }
  ];

  const sqlSchema = `-- ====================================================================
-- E-Commerce Order Database Schema
-- Tables:
-- 1. Customers
-- 2. Categories
-- 3. Products
-- 4. Orders
-- 5. Order_Items
-- ====================================================================

-- 1. Categories Table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    stock INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 3. Customers Table
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipping_method VARCHAR(50) NOT NULL,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 5. Order_Items Table
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-400/30">
              Practical Exercise 4
            </span>
            <span className="text-slate-400 text-xs">Entity-Relationship Diagram</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Database Architecture & ERD</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Complete relational database schema connecting Customers, Categories, Products, Orders, and Order_Items.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'diagram' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Visual Diagram
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'schema' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            SQL DDL Schema
          </button>
        </div>
      </div>

      {/* Content Body */}
      {activeTab === 'diagram' && (
        <div className="p-6 sm:p-8">
          {/* Relationship Flow Banner */}
          <div className="mb-8 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-700">
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">Categories</span>
            <span className="text-indigo-600 font-bold">1 ── N</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">Products</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">Customers</span>
            <span className="text-indigo-600 font-bold">1 ── N</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">Orders</span>
            <span className="text-indigo-600 font-bold">1 ── N</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">Order_Items</span>
            <span className="text-indigo-600 font-bold">N ── 1</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">Products</span>
          </div>

          {/* Grid of Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map(table => (
              <div
                key={table.name}
                className={`rounded-2xl border-2 transition-all duration-200 bg-white overflow-hidden shadow-xs hover:shadow-md ${table.color}`}
              >
                {/* Table Header */}
                <div className="px-4 py-3 bg-white/90 border-b border-inherit flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-slate-700" />
                    <span className="font-bold text-sm text-slate-900">{table.title}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${table.badgeColor}`}>
                    {table.columns.length} Fields
                  </span>
                </div>

                {/* Table Columns List */}
                <div className="p-3 bg-white space-y-1.5">
                  {table.columns.map(col => (
                    <div
                      key={col.name}
                      className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        {col.isPk ? (
                          <span className="flex items-center gap-0.5 text-[10px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-300">
                            PK
                          </span>
                        ) : col.isFk ? (
                          <span className="flex items-center gap-0.5 text-[10px] font-black bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded border border-indigo-300">
                            FK
                          </span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                        )}
                        <span className={`font-mono font-medium ${col.isPk ? 'font-bold text-slate-900' : 'text-slate-800'}`}>
                          {col.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <span className="font-mono text-[11px] text-slate-400">{col.type}</span>
                        {col.fkRef && (
                          <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1 rounded font-mono">
                            → {col.fkRef}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Explanation Footer */}
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <h4 className="font-bold text-slate-800 text-sm mb-2">Relational Logic Explained:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Customers to Orders:</strong> One customer can make multiple orders (1:N relationship via <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">orders.customer_id</code>).</li>
              <li><strong>Categories to Products:</strong> One category groups multiple products (1:N relationship via <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">products.category_id</code>).</li>
              <li><strong>Orders to Order_Items:</strong> One order contains multiple line items (1:N relationship via <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">order_items.order_id</code>).</li>
              <li><strong>Products to Order_Items:</strong> Each order item links to the specific product catalog entry (1:N relationship via <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">order_items.product_id</code>).</li>
            </ul>
          </div>
        </div>
      )}

      {/* SQL DDL Schema View */}
      {activeTab === 'schema' && (
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-500">
              Standard ANSI SQL Schema (compatible with PostgreSQL, MySQL, and SQLite)
            </p>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
            </button>
          </div>
          <pre className="p-5 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            {sqlSchema}
          </pre>
        </div>
      )}
    </div>
  );
}
