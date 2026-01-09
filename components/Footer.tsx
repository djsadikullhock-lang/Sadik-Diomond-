
import React from 'react';
import { SUPPORT_WHATSAPP, BUSINESS_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-white border-t border-slate-200 pt-16 pb-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {/* Column 1: Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold tracking-tight text-[#333] uppercase">
                {BUSINESS_NAME.toUpperCase()}.COM
              </h2>
              <p className="text-slate-500 text-[13px] leading-relaxed">
                Top-up your favorite game credits on {BUSINESS_NAME.split(' ')[0]} ({BUSINESS_NAME}), your trusted online digital games store. Buy online securely via bKash, Nagad, and Rocket. It's the most secure and reliable website in Bangladesh.
              </p>
            </div>
            
            {/* Column 2: Legal Pages */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#333] uppercase">Legal Pages</h3>
              <ul className="space-y-3">
                <FooterLink label="Contact Us" />
                <FooterLink label="Privacy Policy" />
                <FooterLink label="Terms and Conditions" />
                <FooterLink label="Refund and Returns Policy" />
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#333] uppercase">Quick Links</h3>
              <ul className="space-y-3">
                <FooterLink label="My Account" />
                <FooterLink label="Order Tracker" />
                <FooterLink label="Shop" />
                <FooterLink label="Support" href={SUPPORT_WHATSAPP} />
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] text-slate-400 font-medium">
            <p>© 2024 {BUSINESS_NAME} - Premium Gaming Store</p>
            <div className="flex gap-6 items-center">
              <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6 grayscale opacity-40 hover:opacity-100 transition-opacity" alt="Visa" />
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6 grayscale opacity-40 hover:opacity-100 transition-opacity" alt="Mastercard" />
              <img src="https://img.icons8.com/color/48/000000/google-pay.png" className="h-5 grayscale opacity-40 hover:opacity-100 transition-opacity" alt="Google Pay" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

const FooterLink: React.FC<{ label: string, href?: string }> = ({ label, href = "#" }) => (
  <li>
    <a href={href} className="text-slate-500 hover:text-[#ff7d00] transition-colors text-[13px] font-medium">{label}</a>
  </li>
);

export default Footer;
