import React from 'react';
import { ShoppingBag, Search, Heart, User, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ activePage, setActivePage, selectedCategory, setSelectedCategory }) {
  const { totalItemCount } = useCart();

  const navCategories = ['Men', 'Women', 'Kids', 'New In'];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo matching screenshot */}
          <div className="flex items-center gap-8">
            <div 
              onClick={() => {
                setActivePage('products');
                setSelectedCategory('All');
              }}
              className="cursor-pointer flex items-center gap-1 group"
            >
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                Webyansh
              </span>
            </div>

            {/* Center Navigation: Men, Women, Kids, New In */}
            <nav className="hidden md:flex items-center gap-1">
              {navCategories.map(cat => {
                const isActive = activePage === 'products' && selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActivePage('products');
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}

              <div className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer">
                <span>Company</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </nav>
          </div>

          {/* Right Controls: Search, Bag, Heart, User, Orders */}
          <div className="flex items-center gap-3">
            {/* Search Input bar */}
            <div className="relative hidden sm:block w-48 lg:w-60">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-3.5 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:border-slate-800 transition"
              />
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Wishlist Icon */}
            <button
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setActivePage('cart')}
              className={`p-2 rounded-full relative transition ${
                activePage === 'cart'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-slate-900 rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* User / Orders Menu */}
            <button
              onClick={() => setActivePage('orders')}
              className={`p-2 rounded-full transition ${
                activePage === 'orders'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title="Account & Orders"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center gap-1 py-2 overflow-x-auto border-t border-slate-100 scrollbar-none">
          {navCategories.map(cat => {
            const isActive = activePage === 'products' && selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActivePage('products');
                }}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
