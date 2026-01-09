
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
      <header className="bg-white py-3 sm:py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('shop')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ff7d00] rounded-xl flex items-center justify-center p-2.5 shadow-sm">
              <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2L4.5,9.5L12,22L19.5,9.5L12,2Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-[#ff7d00]">Sadik</span>
                <span className="text-xl sm:text-2xl font-black text-slate-800">Store</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider">
                TRUSTED ONLINE GAME SHOP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer group">
              <div className="p-2 rounded-full hover:bg-slate-50 transition-colors">
                <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute top-0 right-0 bg-slate-400 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">0</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar - Match Screenshot */}
      <nav className="bg-white border-y border-slate-100 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center h-12 gap-8 whitespace-nowrap overflow-x-auto no-scrollbar">
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
    className={`relative h-full px-1 text-[13px] font-bold tracking-tight transition-colors ${active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
  >
    {label}
    {active && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#ff7d00] rounded-t-full"></div>}
  </button>
);

export default Header;
