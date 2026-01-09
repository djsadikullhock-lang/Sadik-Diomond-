
import React from 'react';
import { SUPPORT_WHATSAPP, BUSINESS_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {/* Column 1: Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase">
                {BUSINESS_NAME.toUpperCase()}.COM
              </h2>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                Top-up your favorite game credits on Game Kinley (গেমকিনলে), your trusted online digital games store. Buy online securely via bKash, Nagad, and Rocket. It's the most secure and reliable website in Bangladesh.
              </p>
            </div>
            
            {/* Column 2: Legal Pages */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-800 uppercase">Legal Pages</h3>
              <ul className="space-y-3">
                <FooterLink label="Contact Us" />
                <FooterLink label="Privacy Policy" />
                <FooterLink label="Terms and Conditions" />
                <FooterLink label="Refund and Returns Policy" />
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-800 uppercase">Quick Links</h3>
              <ul className="space-y-3">
                <FooterLink label="My Account" />
                <FooterLink label="Order Tracker" />
                <FooterLink label="Shop" />
                <FooterLink label="Support" href={SUPPORT_WHATSAPP} />
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-bold">
            <p>© 2024 {BUSINESS_NAME} - Premium Gaming Store</p>
            <div className="flex gap-4">
              <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6 grayscale opacity-50" alt="Visa" />
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6 grayscale opacity-50" alt="Mastercard" />
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <a 
          href={SUPPORT_WHATSAPP} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.656zm6.29-4.171c1.511.893 3.143 1.364 4.808 1.365 5.232 0 9.491-4.259 9.493-9.492.001-2.536-.987-4.92-2.783-6.717s-4.18-2.784-6.717-2.784c-5.233 0-9.491 4.259-9.493 9.492-.001 1.83.527 3.612 1.527 5.163l-.993 3.628 3.71-.973z"/>
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block transition-all">Support</span>
        </a>
      </div>
    </>
  );
};

const FooterLink: React.FC<{ label: string, href?: string }> = ({ label, href = "#" }) => (
  <li>
    <a href={href} className="text-slate-500 hover:text-[#ff7d00] transition-colors text-[13px] font-medium">{label}</a>
  </li>
);

export default Footer;
