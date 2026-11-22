import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const SHIPPING_OPTIONS = {
  free: {
    id: 'free',
    name: 'Free Shipping',
    price: 0,
    eta: '7-20 Days',
    description: 'Standard carrier delivery with tracking'
  },
  express: {
    id: 'express',
    name: 'Express Shipping',
    price: 9,
    eta: '1-3 Days',
    description: 'Fast priority air dispatch'
  },
  priority: {
    id: 'priority',
    name: 'Next-Day Air',
    price: 19,
    eta: '24 Hours',
    description: 'Direct priority courier delivery'
  }
};

const PROMO_CODES = {
  'DISCOUNT10': { type: 'percent', value: 10, label: '10% Off' },
  'SAVE20': { type: 'fixed', value: 20, label: '$20 Off' },
  'WELCOME': { type: 'fixed', value: 50, label: '$50 Welcome Gift' }
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart_items_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default initial cart matching PDF Screenshot Page 2 ($2699 total)
    return [
      {
        id: 1,
        name: 'Black Jacket Puffed',
        price: 499.00,
        quantity: 1,
        image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
        specs: 'Size: XXL · Color: Black · Thermal Warmth',
        variant: 'Agora'
      },
      {
        id: 2,
        name: 'Women White jacket',
        price: 1000.00,
        quantity: 2,
        image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
        specs: 'Size: XL · Color: Smoke white · 100% Cashmere',
        variant: 'Allure'
      },
      {
        id: 3,
        name: 'Orange Full wear',
        price: 1200.00,
        quantity: 1,
        image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        specs: 'Size: L · Color: Electric Orange · Unisex Cut',
        variant: 'Vibe'
      }
    ];
  });

  const [shippingKey, setShippingKey] = useState('free');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('cart_items_v2', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image_url: product.image_url,
          specs: product.specs || 'Standard Spec',
          variant: product.variant || 'Standard',
          quantity: qty
        }
      ];
    });
  };

  const updateQuantity = (productId, newQty) => {
    const qty = Math.max(1, parseInt(newQty, 10));
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (!trimmed) {
      setPromoError('Please enter a coupon code.');
      return false;
    }
    const match = PROMO_CODES[trimmed];
    if (match) {
      setAppliedPromo({ code: trimmed, ...match });
      setPromoError('');
      return true;
    } else {
      setPromoError('Invalid coupon code. Try DISCOUNT10 or SAVE20');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = SHIPPING_OPTIONS[shippingKey] ? SHIPPING_OPTIONS[shippingKey].price : 0;

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = (subtotal * appliedPromo.value) / 100;
    } else if (appliedPromo.type === 'fixed') {
      discountAmount = appliedPromo.value;
    }
  }
  discountAmount = Math.min(subtotal, Math.max(0, discountAmount));

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        shippingKey,
        setShippingKey,
        shippingFee,
        shippingOption: SHIPPING_OPTIONS[shippingKey] || SHIPPING_OPTIONS.free,
        appliedPromo,
        promoError,
        applyPromoCode,
        removePromoCode,
        subtotal,
        discountAmount,
        grandTotal,
        totalItemCount,
        lastPlacedOrder,
        setLastPlacedOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
