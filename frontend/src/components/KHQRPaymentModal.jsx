import React, { useState } from 'react';
import { X, Check, Upload, QrCode, ShieldCheck, ArrowRight, Smartphone, Building2 } from 'lucide-react';

export default function KHQRPaymentModal({
  isOpen,
  onClose,
  totalAmountUSD,
  onPaymentSuccess,
  customerInfo
}) {
  if (!isOpen) return null;

  const [uploadedSlip, setUploadedSlip] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [successState, setSuccessState] = useState(false);

  const amountUSD = Number(totalAmountUSD) || 0;
  const amountKHR = Math.round(amountUSD * 4100);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedSlip(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmTransfer = () => {
    setIsVerifying(true);
    // Simulate real-time bank settlement / webhook confirmation
    setTimeout(() => {
      setIsVerifying(false);
      setSuccessState(true);
      setTimeout(() => {
        onPaymentSuccess({
          paymentMethod: 'KHQR (Bakong)',
          paymentStatus: 'Paid',
          bankReceiver: 'POOK PHANNA',
          bankAccount: '••••5034',
          amountKHR,
          paymentSlip: uploadedSlip
        });
      }, 900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs tracking-wider">
              KHQR
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Bakong KHQR Payment</h3>
              <p className="text-xs text-rose-100">Scan to pay with any banking app</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Bank Account Info Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Receiver Account
              </span>
              <p className="font-bold text-slate-900 text-sm">POOK PHANNA</p>
              <p className="text-xs text-slate-500 font-mono">Savings ••••5034</p>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Amount to Pay
              </span>
              <p className="font-extrabold text-slate-900 text-lg">${amountUSD.toFixed(2)}</p>
              <p className="text-xs font-bold text-red-600 font-mono">
                {amountKHR.toLocaleString()} KHR (៛)
              </p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-56 h-72 rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200 p-1 flex items-center justify-center">
              <img
                src="/khqr.jpg"
                alt="Bakong KHQR - POOK PHANNA"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Scan with <strong>ABA, Canadia, ACLEDA, Wing, Bakong</strong> or any banking app
            </p>
          </div>

          {/* Bank Slip Upload Option */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Upload Bank Transfer Slip (វិក្កយបត្របាញ់លុយ) <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-2.5 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  {uploadedSlip ? 'Slip Attached (Change)' : 'Choose Slip Screenshot'}
                </span>
              </label>

              {uploadedSlip && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                  <img src={uploadedSlip} alt="Bank Slip" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Confirm Transfer Button */}
          <button
            onClick={handleConfirmTransfer}
            disabled={isVerifying || successState}
            className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
              successState
                ? 'bg-emerald-600'
                : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.99]'
            }`}
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Bank Transfer...</span>
              </div>
            ) : successState ? (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Payment Received in Bank (••••5034)!</span>
              </div>
            ) : (
              <>
                <span>I Have Completed Transfer / ខ្ញុំបានបាញ់លុយរួច</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Security notice */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>National Bank of Cambodia KHQR Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
