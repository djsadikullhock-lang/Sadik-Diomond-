
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
      {/* Top Announcement Bar */}
      <div className="bg-[#1a56db] text-white text-[10px] sm:text-xs py-1.5 px-4 text-center font-medium">
        সার্ভিস চালু: সকাল ৮ টা থেকে রাত ১১ টা পর্যন্ত।
      </div>
      
      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setView('shop')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center p-2">
               <img src="https://media.discordapp.net/attachments/1090184495543263302/1344605963570253864/Screenshot_20250228-111001_1.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#ff7d00] leading-none">
                {BUSINESS_NAME}
              </span>
              <span className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                TRUSTED ONLINE GAME SHOP
              </span>
            </div>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#ff7d00] transition-colors"
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-[#ff7d00] text-white rounded-r hover:bg-[#e67000] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 text-slate-700">
               <div className="relative">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                 <span className="absolute -top-1 -right-1 bg-slate-400 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">0</span>
               </div>
               <div className="flex flex-col text-[10px] leading-none">
                 <span className="font-bold">Total</span>
                 <span className="text-[#ff7d00] font-black">৳ 0</span>
               </div>
             </div>
             
             {isLoggedIn ? (
               <button onClick={onLogout} className="text-xs font-bold text-slate-600 hover:text-[#ff7d00] uppercase tracking-wider">Logout</button>
             ) : (
               <button onClick={onLoginClick} className="text-xs font-bold text-slate-600 hover:text-[#ff7d00] uppercase tracking-wider">Login</button>
             )}
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#f8fafc] border-b border-slate-200 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-12 gap-6 whitespace-nowrap">
          <NavItem icon="🏠" label="HOME" active={currentView === 'shop'} onClick={() => setView('shop')} />
          <NavItem icon="➕" label="TOP UP" />
          <NavItem icon="🛒" label="SHOP" />
          <NavItem icon="🎮" label="GAME" />
          <NavItem icon="🎴" label="CARD" />
          <NavItem icon="📋" label="ORDER TRACKER" active={currentView === 'tracker'} onClick={() => setView('tracker')} />
          <NavItem icon="👤" label="ACCOUNT" active={currentView === 'admin'} onClick={() => isAdmin ? setView('admin') : onLoginClick()} />
        </div>
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: string, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors py-3 border-b-2 ${active ? 'border-[#ff7d00] text-slate-900' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
  >
    <span className="text-sm">{icon}</span>
    {label}
  </button>
);

export default Header;
