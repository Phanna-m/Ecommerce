import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import OrdersHistoryPage from './pages/OrdersHistoryPage';
import DatabaseERDPage from './pages/DatabaseERDPage';

function AppContent() {
  const [activePage, setActivePage] = useState('products');
  const [selectedCategory, setSelectedCategory] = useState('Men');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOrderSuccess = (order) => {
    setSelectedOrder(order);
    setActivePage('confirmation');
  };

  const handleSelectPastOrder = (order) => {
    setSelectedOrder(order);
    setActivePage('confirmation');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activePage === 'products' && (
          <ProductsPage
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onNavigateToCart={() => setActivePage('cart')}
          />
        )}

        {activePage === 'cart' && (
          <CartPage
            onProceedToCheckout={() => setActivePage('checkout')}
            onContinueShopping={() => setActivePage('products')}
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={handleOrderSuccess}
            onBackToCart={() => setActivePage('cart')}
          />
        )}

        {activePage === 'confirmation' && (
          <ConfirmationPage
            order={selectedOrder}
            onContinueShopping={() => setActivePage('products')}
          />
        )}

        {activePage === 'orders' && (
          <OrdersHistoryPage
            onSelectOrder={handleSelectPastOrder}
            onNavigateToShop={() => setActivePage('products')}
          />
        )}

        {activePage === 'erd' && (
          <DatabaseERDPage />
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Webyansh</span>
            <span>•</span>
            <span>Bank KHQR: POOK PHANNA (••••5034)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button onClick={() => setActivePage('products')} className="hover:text-slate-800 transition">Shop</button>
            <button onClick={() => setActivePage('cart')} className="hover:text-slate-800 transition">Cart</button>
            <button onClick={() => setActivePage('orders')} className="hover:text-slate-800 transition">Orders</button>
            <button onClick={() => setActivePage('erd')} className="hover:text-slate-800 transition">ERD</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
