import React, { useEffect } from 'react';
import { CheckCircle2, Package, Calendar, User, ArrowRight, Printer, MapPin, Phone, Mail, Building2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import StepProgress from '../components/StepProgress';

export default function ConfirmationPage({ order, onContinueShopping }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No active order details found.</h2>
        <button
          onClick={onContinueShopping}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const customerName = order.customer
    ? `${order.customer.first_name} ${order.customer.last_name}`.trim()
    : 'Valued Customer';

  const formattedDate = order.order_date
    ? new Date(order.order_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString();

  const totalUSD = Number(order.total_amount) || 0;
  const totalKHR = order.amount_khr || Math.round(totalUSD * 4100);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <StepProgress currentStep="confirmation" />

      {/* Success Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Thank you for your purchase. Your payment has been received and verified.
        </p>

        {/* Bank Confirmation Highlight Box */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-emerald-50 border border-red-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-xs">
              KHQR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Payment Transferred to Bank</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <Check className="w-3 h-3" /> PAID
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Receiver: <strong className="text-slate-900">POOK PHANNA</strong> · Savings <span className="font-mono font-semibold">••••5034</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500 font-mono">Ref: {order.transaction_ref || 'TXN-KHQR-5034'}</p>
            <p className="text-xs font-bold text-red-600 font-mono">
              {totalKHR.toLocaleString()} KHR
            </p>
          </div>
        </div>

        {/* Order Meta Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-left">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Order ID</span>
            <span className="font-mono font-bold text-sm text-slate-900 block">{order.order_number || `ORD-${order.id}`}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Customer</span>
            <span className="font-bold text-sm text-slate-900 truncate block">{customerName}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Order Date</span>
            <span className="font-medium text-xs text-slate-800 block">{formattedDate}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Status</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {order.status || 'Confirmed'}
            </span>
          </div>
        </div>
      </div>

      {/* Ordered Products Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <span>Ordered Products</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {order.items?.length || 0} items
          </span>
        </div>

        {/* Product Items Table/List */}
        <div className="divide-y divide-slate-100">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {item.product_image && (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.product_name}</h4>
                  <p className="text-xs text-slate-400">
                    Unit Price: ${Number(item.unit_price).toFixed(2)} × {item.quantity} QTY
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">
                  ${Number(item.total_price || item.unit_price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">${Number(order.subtotal || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-semibold text-slate-900">
              {Number(order.shipping_fee) === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${Number(order.shipping_fee).toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-base">
            <span className="font-bold text-slate-900">Total Paid</span>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ${totalUSD.toFixed(2)}
              </span>
              <p className="text-xs text-red-600 font-bold font-mono">
                {totalKHR.toLocaleString()} KHR (៛)
              </p>
            </div>
          </div>
        </div>

        {/* Customer Shipping & Bank Slip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {order.customer && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-600" /> Delivery Address:
              </h4>
              <p className="text-slate-600">
                {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zip_code}
              </p>
              <div className="text-slate-500">
                <p>Phone: {order.customer.phone}</p>
                <p>Email: {order.customer.email}</p>
              </div>
            </div>
          )}

          {order.payment_slip ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2">
              <h4 className="font-bold text-slate-800 text-xs">Bank Transfer Slip (Attached):</h4>
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                <img src={order.payment_slip} alt="Payment Slip" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1 flex flex-col justify-center">
              <h4 className="font-bold text-slate-800 text-xs">Payment Verification:</h4>
              <p className="text-emerald-700 font-semibold">Direct Bakong KHQR Settlement</p>
              <p className="text-slate-500">Account: POOK PHANNA (••••5034)</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Print Receipt</span>
        </button>

        <button
          onClick={onContinueShopping}
          className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
