
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f59e0b]/10 blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-indigo-500/10 blur-[80px] -z-10"></div>
      
      <div className="p-8 md:p-12 lg:flex items-center gap-8">
        <div className="lg:w-2/3">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700/50 text-[#f59e0b] text-sm font-medium mb-6 border border-slate-600">
            <span className="mr-2">⚡</span> Fast Delivery Guaranteed
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Top-up <span className="text-[#f59e0b]">Diamonds</span> <br />
            Instant & Secure
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-lg">
            Experience the fastest diamond top-up service for Free Fire. Secure payments via Bkash & Nagad with 24/7 support.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Anti-Ban Secure
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Direct ID Code
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block lg:w-1/3">
          <img 
            src="https://picsum.photos/seed/gaming/400/400" 
            alt="Gaming Hero" 
            className="rounded-2xl shadow-2xl shadow-slate-900 border border-slate-700"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
