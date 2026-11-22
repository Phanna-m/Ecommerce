import React, { useState, useEffect } from 'react';
import { History, Eye, Package, Calendar, User, ArrowRight, ShoppingBag } from 'lucide-react';

export default function OrdersHistoryPage({ onSelectOrder, onNavigateToShop }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from backend or localStorage
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setOrders(json.data);
        } else {
          loadFromLocal();
        }
      })
      .catch(() => {
        loadFromLocal();
      })
      .finally(() => setLoading(false));

    function loadFromLocal() {
      const local = JSON.parse(localStorage.getItem('local_orders') || '[]');
      if (local.length > 0) {
        setOrders(local);
      } else {
        // Fallback default sample order ORD-0001
        setOrders([
          {
            id: 1,
            order_number: 'ORD-0001',
            order_date: '2026-11-22T08:30:00.000Z',
            customer: { first_name: 'Divyansh', last_name: 'Agarwal', email: 'divyansh@webyansh.com' },
            shipping_method: 'Standard Shipping',
            subtotal: 810.00,
            shipping_fee: 0.00,
            total_amount: 810.00,
            status: 'Pending',
            item_count: 4
          }
        ]);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            <span>Order History</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and view receipts for all completed e-commerce orders
          </p>
        </div>

        <button
          onClick={onNavigateToShop}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>New Order</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <p className="text-sm text-slate-500">No orders placed yet.</p>
          <button
            onClick={onNavigateToShop}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs divide-y divide-slate-100">
          {orders.map(order => {
            const customerName = order.customer
              ? `${order.customer.first_name} ${order.customer.last_name}`
              : 'Customer';

            const dateStr = order.order_date
              ? new Date(order.order_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Recent';

            return (
              <div
                key={order.order_number || order.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {order.order_number || `ORD-${order.id}`}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {order.status || 'Pending'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {customerName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {dateStr}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-slate-400" /> {order.item_count || order.items?.length || 1} items
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 block">
                      ${Number(order.total_amount).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400">Total Paid</span>
                  </div>

                  <button
                    onClick={() => onSelectOrder(order)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <span>View Receipt</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
