import React, { useState } from 'react';
import { Tag, ArrowRight, Check, X, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function OrderSummary({
  btnText = 'Checkout',
  onAction,
  isLoading = false,
  showPromo = true,
  showShippingSelector = false
}) {
  const {
    subtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    appliedPromo,
    promoError,
    applyPromoCode,
    removePromoCode,
    shippingKey,
    setShippingKey,
    totalItemCount
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyPromoCode(couponInput)) {
      setCouponInput('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-5">Order Summary</h2>

      {/* Breakdown */}
      <div className="space-y-3.5 text-sm pb-5 border-b border-slate-100">
        <div className="flex justify-between items-center text-slate-600">
          <span>Subtotal ({totalItemCount} items)</span>
          <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-slate-600">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-slate-400" />
            <span>Delivery</span>
          </span>
          <span className="font-semibold text-slate-900">
            {shippingFee === 0 ? (
              <span className="text-emerald-600 font-bold">FREE</span>
            ) : (
              `$${shippingFee.toFixed(2)}`
            )}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-600 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Discount ({appliedPromo?.label || 'Applied'})</span>
            </span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-slate-600">
          <span>Estimated Taxes</span>
          <span className="text-slate-400 text-xs font-mono">$0.00</span>
        </div>
      </div>

      {/* Promo Code Box */}
      {showPromo && (
        <div className="py-4 border-b border-slate-100">
          {appliedPromo ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Coupon <strong>{appliedPromo.code}</strong> applied!</span>
              </div>
              <button
                onClick={removePromoCode}
                className="text-emerald-700 hover:text-emerald-900 p-0.5 rounded"
                title="Remove coupon"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="User a promo code (e.g. DISCOUNT10)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-[11px] text-rose-500 font-medium px-1">{promoError}</p>
              )}
            </form>
          )}
        </div>
      )}

      {/* Grand Total */}
      <div className="pt-4 pb-6">
        <div className="flex justify-between items-baseline">
          <span className="text-base font-bold text-slate-900">Total</span>
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ${grandTotal.toFixed(2)}
            </span>
            <p className="text-[11px] text-slate-400">USD, taxes calculated at payment</p>
          </div>
        </div>
      </div>

      {/* Main Action Button */}
      <button
        onClick={onAction}
        disabled={isLoading || totalItemCount === 0}
        className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group active:scale-[0.99]"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing Order...</span>
          </div>
        ) : (
          <>
            <span>{btnText}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      {/* Trust Badges */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-3 text-slate-400 text-xs">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure Checkout
        </span>
        <span>•</span>
        <span>Instant Order Confirmation</span>
      </div>
    </div>
  );
}
