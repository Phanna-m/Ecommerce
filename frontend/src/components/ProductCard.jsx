import React, { useState } from 'react';
import { ShoppingBag, Check, Plus, Minus, Star, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  const [qty, setQty] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const existingInCart = cart.find(item => item.id === product.id);

  const handleAdd = () => {
    addToCart(product, qty);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-white/90 backdrop-blur-md text-slate-800 rounded-full shadow-sm border border-slate-100">
            {product.category_name}
          </span>
        </div>
        {existingInCart && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded-full shadow-sm">
              In Cart: {existingInCart.quantity}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">{product.name}</h3>
            <span className="text-xl font-extrabold text-slate-900">${Number(product.price).toFixed(2)}</span>
          </div>

          <p className="text-xs text-indigo-600 font-medium mb-2">{product.specs}</p>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
              className="p-1.5 hover:bg-white rounded text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-800">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="p-1.5 hover:bg-white rounded text-slate-600 transition"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
