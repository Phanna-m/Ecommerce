import React from 'react';
import { Check, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';

export default function StepProgress({ currentStep, onStepClick }) {
  const steps = [
    { key: 'cart', label: 'Shopping Cart', icon: ShoppingBag, num: 1 },
    { key: 'checkout', label: 'Shipping & Payment', icon: Truck, num: 2 },
    { key: 'confirmation', label: 'Confirmation', icon: CheckCircle2, num: 3 },
  ];

  return (
    <div className="w-full py-4 mb-6">
      <div className="flex items-center justify-center max-w-2xl mx-auto">
        {steps.map((step, idx) => {
          const isDone = (currentStep === 'checkout' && step.key === 'cart') ||
                         (currentStep === 'confirmation' && (step.key === 'cart' || step.key === 'checkout'));
          const isActive = currentStep === step.key;
          const isClickable = isDone && onStepClick;

          const Icon = step.icon;

          return (
            <React.Fragment key={step.key}>
              {/* Step item */}
              <div
                onClick={() => isClickable && onStepClick(step.key)}
                className={`flex items-center gap-2 select-none ${
                  isClickable ? 'cursor-pointer group' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isActive
                      ? 'bg-slate-900 text-white ring-4 ring-slate-100'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? 'text-slate-900 font-semibold'
                      : isDone
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${
                    isDone ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
