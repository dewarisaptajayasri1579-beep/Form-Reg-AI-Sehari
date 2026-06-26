import React from 'react';
import { Check, User, CreditCard, Gift } from 'lucide-react';
import { CheckoutStage } from '../types';

interface StepHeaderProps {
  currentStage: CheckoutStage;
}

export default function StepHeader({ currentStage }: StepHeaderProps) {
  // Define steps
  const steps = [
    {
      id: 'DATA_DIRI',
      label: 'Data Diri',
      icon: User,
      status: 'completed', // completed already in this payment page
    },
    {
      id: 'PEMBAYARAN',
      label: 'Pembayaran',
      icon: CreditCard,
      status: currentStage === 'COMPLETED' ? 'completed' : 'active',
    },
    {
      id: 'SELESAI',
      label: 'Selesai',
      icon: Gift,
      status: currentStage === 'COMPLETED' ? 'active' : 'upcoming',
    },
  ];

  return (
    <div className="w-full" id="checkout-steps">
      <div className="flex items-center justify-between max-w-xl mx-auto px-1">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step bubble and label */}
              <div className="flex flex-col items-center relative z-10">
                {/* Bubble Container */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 text-[11px] font-bold ${
                    step.status === 'completed'
                      ? 'bg-[#34D399] text-white'
                      : step.status === 'active'
                      ? 'ai-gradient-bg text-white'
                      : 'border border-white/40 text-[#707888]'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`mt-2 text-xs font-semibold tracking-wide transition-colors duration-300 ${
                    step.status === 'active'
                      ? 'text-white'
                      : 'text-[#A0A7B4]'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line between steps */}
              {!isLast && (
                <div className="flex-1 h-[1px] mx-4 -mt-5 relative bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-0 transition-all duration-500 rounded-full ${
                      step.status === 'completed'
                        ? 'bg-[#34D399] w-full'
                        : 'bg-white/10 w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
