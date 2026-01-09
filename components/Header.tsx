
import React from 'react';
import { BUSINESS_NAME } from '../constants';

interface HeaderProps {
  currentView: string;
  setView: (view: 'shop' | 'admin' | 'tracker') => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, isAdmin, isLoggedIn, onLoginClick, onLogout }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Blue Announcement Bar */}
      <div className="bg-[#1a56db] text-white text-[11px] sm:text-[12px] py-2 px-4 text-center font-medium">
        সার্ভিস চালু: সকাল ৮ টা থেকে রাত ১১ টা পর্যন্ত।
      </div>
      
      {/* Main Header */}
      <header className="bg-white border-b border-slate-100 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView('shop')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-slate-100 rounded-lg p-1">
               <svg className="w-full h-full text-[#e67e22]" viewBox="0 0 24 24" fill="currentColor"><path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" /></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#e67e22] leading-none">
                Sadik <span className="text-[#333]">Store</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                TRUSTED ONLINE GAME SHOP
              </span>
            </div>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-[#f8f9fb] border border-slate-200 rounded px-5 py-2.5 text-sm focus:outline-none focus:border-[#e67e22] transition-colors"
            />
            <button className="absolute right-0 top-0 h-full px-5 bg-[#ff7d00] text-white rounded-r hover:bg-[#e67000] transition-colors flex items-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 text-slate-700">
               <div className="relative">
                 <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                 <span className="absolute -top-1.5 -right-1.5 bg-slate-400 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
               </div>
               <div className="hidden sm:flex flex-col text-[11px] leading-tight">
                 <span className="font-bold text-slate-800">0 Total</span>
                 <span className="text-slate-400 font-bold">৳ 0</span>
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar - Grey Style */}
      <nav className="bg-[#f9f9f9] border-b border-slate-200 overflow-x-auto no-scrollbar shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-12 gap-8 whitespace-nowrap">
          <NavItem label="HOME" active={currentView === 'shop'} onClick={() => setView('shop')} />
          <NavItem label="TOP UP" />
          <NavItem label="SHOP" />
          <NavItem label="GAME" />
          <NavItem label="CARD" />
          <NavItem label="ORDER TRACKER" active={currentView === 'tracker'} onClick={() => setView('tracker')} />
          <NavItem label="ACCOUNT" active={currentView === 'admin'} onClick={() => isAdmin ? setView('admin') : onLoginClick()} />
        </div>
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ label: string, active?: boolean, onClick?: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center text-[12px] font-bold transition-all py-3 px-1 border-b-2 tracking-wide ${active ? 'border-[#ff7d00] text-[#333]' : 'border-transparent text-slate-500 hover:text-[#333]'}`}
  >
    {label}
  </button>
);

export default Header;
