
import React from 'react';
import { DiamondPackage } from '../types';

interface ProductCardProps {
  pkg: DiamondPackage;
  onBuy: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ pkg, onBuy }) => {
  return (
    <div className={`relative bg-[#1e293b] rounded-2xl p-4 md:p-6 border transition-all duration-300 hover:-translate-y-1 group ${pkg.isPopular ? 'border-[#f59e0b]/50' : 'border-slate-700/50 hover:border-slate-600'}`}>
      {pkg.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
          Best Value
        </div>
      )}
      
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 ring-4 ring-slate-800 group-hover:ring-[#f59e0b]/20 transition-all">
          <svg className="w-10 h-10 text-[#f59e0b]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4.5 9.5L12 22L19.5 9.5L12 2Z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-1">{pkg.label}</h3>
        <p className="text-slate-400 text-xs">Direct Top-up</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-slate-400 text-sm">Price</span>
        <span className="text-lg font-bold text-white">৳ {pkg.price}</span>
      </div>

      <button 
        onClick={onBuy}
        className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg ${pkg.isPopular ? 'bg-[#f59e0b] text-slate-950 hover:bg-[#d97706] shadow-amber-500/20' : 'bg-slate-700 text-white hover:bg-slate-600 shadow-slate-950/40'}`}
      >
        Buy Now
      </button>
    </div>
  );
};
