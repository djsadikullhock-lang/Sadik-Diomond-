
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
    <nav className="fixed top-0 left-0 w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('shop')}>
          <div className="w-10 h-10 bg-[#f59e0b] rounded-lg flex items-center justify-center font-black text-slate-900 text-xl italic shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            FF
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block">
            {BUSINESS_NAME}
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setView('shop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentView === 'shop' ? 'bg-[#f59e0b] text-slate-900' : 'text-slate-400 hover:text-white'}`}
          >
            Shop
          </button>
          <button 
            onClick={() => setView('tracker')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentView === 'tracker' ? 'bg-[#f59e0b] text-slate-900' : 'text-slate-400 hover:text-white'}`}
          >
            Track
          </button>

          {isAdmin && (
            <button 
              onClick={() => setView('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentView === 'admin' ? 'bg-red-500 text-white' : 'text-slate-500 hover:text-red-400'}`}
            >
              Admin
            </button>
          )}
          
          {isLoggedIn ? (
            <button 
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-white transition-all border border-slate-800 hover:border-slate-700"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#f59e0b] hover:text-white transition-all border border-[#f59e0b]/20 hover:border-[#f59e0b]/50"
            >
              Login
            </button>
          )}
          
          <div className="hidden lg:flex bg-slate-800/50 px-3 py-1 rounded-full text-[10px] text-slate-300 border border-slate-700 ml-2">
            <span className="flex w-1.5 h-1.5 bg-green-500 rounded-full mt-1 mr-2 animate-pulse"></span>
            Online
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
