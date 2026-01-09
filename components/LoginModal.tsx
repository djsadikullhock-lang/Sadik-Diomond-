
import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (email: string) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      onLogin(email.trim());
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-[#1e293b] rounded-3xl shadow-2xl border border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white">Login Access</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Enter your email to access your account features. Admin access is restricted to authorized emails.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email"
                required
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#f59e0b] focus:ring-4 focus:ring-[#f59e0b]/10 transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#f59e0b] hover:bg-orange-500 text-slate-950 font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 mt-4"
            >
              Continue
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Secure Access Provider</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
