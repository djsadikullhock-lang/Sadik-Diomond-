
import React from 'react';
import { SUPPORT_WHATSAPP, BUSINESS_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-[#1e293b] border-t border-slate-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#f59e0b] rounded flex items-center justify-center font-black text-slate-900 text-sm italic">
              FF
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              {BUSINESS_NAME}
            </span>
          </div>
          
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
            The #1 trusted diamond top-up destination in Bangladesh. Instant delivery, secure payments, and dedicated gaming support.
          </p>
          
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="text-slate-500 hover:text-[#f59e0b] transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-[#f59e0b] transition-colors">Privacy Policy</a>
            <a href={SUPPORT_WHATSAPP} className="text-slate-500 hover:text-[#f59e0b] transition-colors">Support</a>
          </div>
          
          <div className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
            © 2024 {BUSINESS_NAME} • Developed for APK Performance
          </div>
        </div>
      </footer>

      {/* Sticky Support Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-40">
        <a 
          href={SUPPORT_WHATSAPP} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl shadow-green-500/50 hover:scale-110 active:scale-95 transition-all"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.656zm6.29-4.171c1.511.893 3.143 1.364 4.808 1.365 5.232 0 9.491-4.259 9.493-9.492.001-2.536-.987-4.92-2.783-6.717s-4.18-2.784-6.717-2.784c-5.233 0-9.491 4.259-9.493 9.492-.001 1.83.527 3.612 1.527 5.163l-.993 3.628 3.71-.973z"/>
          </svg>
        </a>
      </div>
    </>
  );
};

export default Footer;
