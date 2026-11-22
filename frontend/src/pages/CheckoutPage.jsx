import React, { useState } from 'react';
import { Truck, ArrowLeft, AlertCircle, ShieldCheck, Check, Tag, QrCode } from 'lucide-react';
import { useCart, SHIPPING_OPTIONS } from '../context/CartContext';
import StepProgress from '../components/StepProgress';
import KHQRPaymentModal from '../components/KHQRPaymentModal';
import { createOrder } from '../api';

export default function CheckoutPage({ onOrderSuccess, onBackToCart }) {
  const {
    cart,
    shippingKey,
    setShippingKey,
    shippingFee,
    subtotal,
    discountAmount,
    grandTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    promoError,
    clearCart,
    setLastPlacedOrder
  } = useCart();

  const [formData, setFormData] = useState({
    first_name: 'Divyansh',
    last_name: 'Agarwal',
    email: 'divyansh@webyansh.com',
    phone: '+91 6377588843',
    city: 'Bangalore',
    state: 'Karnataka',
    zip_code: '560021',
    address: 'Silicon Tech Park, Tower B, Suite 402'
  });

  const [paymentMethod, setPaymentMethod] = useState('khqr');
  const [showQRModal, setShowQRModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [couponInput, setCouponInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip_code.trim()) newErrors.zip_code = 'Zip Code is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartCheckout = (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    if (paymentMethod === 'khqr') {
      setShowQRModal(true);
    } else {
      submitOrder({
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        bankReceiver: 'POOK PHANNA',
        bankAccount: '••••5034',
        paymentSlip: null
      });
    }
  };

  const submitOrder = async (paymentDetails = {}) => {
    setSubmitting(true);
    setApiError('');

    try {
      const payload = {
        customer: formData,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          image_url: item.image_url,
          price: item.price,
          quantity: item.quantity
        })),
        shippingMethod: SHIPPING_OPTIONS[shippingKey]?.name || 'Standard Shipping',
        shippingFee,
        discount: discountAmount,
        notes: `Delivery to ${formData.city}, ${formData.state}`,
        paymentMethod: paymentDetails.paymentMethod || 'KHQR (Bakong)',
        paymentStatus: paymentDetails.paymentStatus || 'Paid',
        bankReceiver: paymentDetails.bankReceiver || 'POOK PHANNA',
        bankAccount: paymentDetails.bankAccount || '••••5034',
        paymentSlip: paymentDetails.paymentSlip || null
      };

      const result = await createOrder(payload);
      setLastPlacedOrder(result);
      clearCart();
      setShowQRModal(false);
      onOrderSuccess(result);
    } catch (err) {
      console.error(err);
      setApiError(err.message || 'Error creating order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (applyPromoCode(couponInput)) {
      setCouponInput('');
    }
  };

  return (
    <div className="space-y-6">
      <StepProgress currentStep="checkout" onStepClick={(step) => step === 'cart' && onBackToCart()} />

      {apiError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping Address & Payment */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="text-xs text-slate-400 font-mono mb-1">Cart &gt; Shipping &gt; Payment</div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shipping Address</h1>
            <p className="text-xs text-slate-500 mt-1">Please enter your delivery destination and contact details</p>
          </div>

          <form onSubmit={handleStartCheckout} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Divyansh"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition ${
                    errors.first_name ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.first_name && <p className="text-[11px] text-rose-500 mt-1">{errors.first_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Agarwal"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition ${
                    errors.last_name ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.last_name && <p className="text-[11px] text-rose-500 mt-1">{errors.last_name}</p>}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="divyansh@webyansh.com"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition ${
                    errors.email ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 6377588843"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition ${
                    errors.phone ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* City, State, Zip Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bangalore"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition ${
                    errors.city ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition ${
                    errors.state ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.state && <p className="text-[11px] text-rose-500 mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Zip Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  placeholder="560021"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition ${
                    errors.zip_code ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                  }`}
                />
                {errors.zip_code && <p className="text-[11px] text-rose-500 mt-1">{errors.zip_code}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Address / Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter street name, house number, or building description..."
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none transition ${
                  errors.address ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200 focus:border-slate-800'
                }`}
              />
              {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
            </div>

            {/* Shipping Method */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Shipping Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(SHIPPING_OPTIONS).slice(0, 2).map((opt) => {
                  const isSelected = shippingKey === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => setShippingKey(opt.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                        isSelected ? 'border-slate-900 bg-slate-50/60' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-slate-900 bg-slate-900' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900">{opt.name}</p>
                          <p className="text-[11px] text-slate-500">{opt.eta}</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-slate-900">
                        {opt.price === 0 ? '$0' : `$${opt.price}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Section (KHQR Bank Transfer) */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Payment Method</h3>
              <div className="space-y-3">
                {/* KHQR Bank Option */}
                <label
                  onClick={() => setPaymentMethod('khqr')}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === 'khqr' ? 'border-red-600 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'khqr' ? 'border-red-600 bg-red-600' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'khqr' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] tracking-wider">KHQR</span>
                        <p className="font-bold text-xs text-slate-900">Bakong Bank Transfer</p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Scan to pay · Receiver: <strong>POOK PHANNA (••••5034)</strong>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">Instant Bank</span>
                </label>

                {/* COD Option */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === 'cod' ? 'border-slate-900 bg-slate-50/60' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-slate-900 bg-slate-900' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-slate-500">Pay cash upon delivery</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">Cash</span>
                </label>
              </div>
            </div>

            {/* Back link */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onBackToCart}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Cart</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Your Cart Summary */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Cart</h2>
            <span className="text-xs font-medium text-slate-400">{cart.length} items</span>
          </div>

          {/* Cart Mini List with Thumbnails */}
          <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.variant || 'Standard'}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 text-xs">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="pt-4 border-t border-slate-100">
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Promo <strong>{appliedPromo.code}</strong> Applied</span>
                </span>
                <button onClick={removePromoCode} className="text-emerald-700 hover:text-emerald-900 font-bold">✕</button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Discount code"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-800 transition"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-rose-500">{promoError}</p>}
              </form>
            )}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-2.5 text-xs pb-4 border-b border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Estimated taxes</span>
              <span className="font-mono text-slate-400">$0.00</span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-base font-bold text-slate-900">Total</span>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ${grandTotal.toFixed(2)}
              </span>
              <p className="text-xs text-red-600 font-bold font-mono">
                ≈ {Math.round(grandTotal * 4100).toLocaleString()} KHR (៛)
              </p>
            </div>
          </div>

          {/* Place Order / Scan Button */}
          <button
            onClick={handleStartCheckout}
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group active:scale-[0.99]"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Order...</span>
              </div>
            ) : paymentMethod === 'khqr' ? (
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-red-400" />
                <span>Scan KHQR to Pay (${grandTotal.toFixed(2)})</span>
              </div>
            ) : (
              <span>Place Order (Cash on Delivery)</span>
            )}
          </button>
        </div>
      </div>

      {/* KHQR Modal */}
      <KHQRPaymentModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        totalAmountUSD={grandTotal}
        customerInfo={formData}
        onPaymentSuccess={submitOrder}
      />
    </div>
  );
}
