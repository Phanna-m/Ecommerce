import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Heart, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import OrderSummary from '../components/OrderSummary';
import StepProgress from '../components/StepProgress';

export default function CartPage({ onProceedToCheckout, onContinueShopping }) {
  const { cart, updateQuantity, removeFromCart, totalItemCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 mt-2">
            Explore our catalog and add the 4 required hardware products.
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Products</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Step Header */}
      <StepProgress currentStep="cart" />

      {/* Main 2-Column Layout matching reference screenshot Page 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cart</h1>
              <p className="text-xs text-slate-500">Review your selected items and quantities</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Items List */}
          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Item Thumbnail & Details */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                    <p className="text-xs text-slate-500">
                      Variant: <span className="font-medium text-slate-700">{item.variant || 'Standard'}</span>
                    </p>
                    <p className="text-xs text-slate-400 font-mono">{item.specs}</p>

                    {/* Action icons like screenshot */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1 rounded hover:bg-rose-50"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price & Quantity Controls */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                  <span className="text-lg font-bold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Quantity modifier [-] QTY [+] */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5 shadow-2xs">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.id, item.quantity - 1);
                        } else {
                          removeFromCart(item.id);
                        }
                      }}
                      className="p-1 hover:bg-white rounded text-slate-600 transition"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded text-slate-600 transition"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping Link */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onContinueShopping}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 sticky top-24">
          <OrderSummary
            btnText="Checkout"
            onAction={onProceedToCheckout}
          />
        </div>
      </div>
    </div>
  );
}
