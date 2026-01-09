
import React, { useState } from 'react';
import { DiamondPackage, AccountType, PaymentMethod, OrderForm, Order, OrderStatus } from '../types';
import { PAYMENT_NUMBER, WHATSAPP_NUMBER } from '../constants';

interface OrderModalProps {
  pkg: DiamondPackage;
  quantity: number;
  playerId: string;
  onClose: () => void;
  onTrackOrder?: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ pkg, quantity, playerId, onClose, onTrackOrder }) => {
  const [formData, setFormData] = useState<OrderForm>({
    playerId: playerId,
    accountType: AccountType.ID_CODE,
    paymentMethod: PaymentMethod.BKASH,
    trxId: '',
    quantity: quantity
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState('');
  const [idCopied, setIdCopied] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'validation' | 'general' } | null>(null);

  const totalPrice = pkg.price * quantity;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(PAYMENT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(submittedOrderId);
    setIdCopied(true);
    setTimeout(() => setIdCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.playerId || formData.playerId.trim().length < 5) {
        throw { message: "Invalid Player ID. Please enter a valid Game UID.", type: 'validation' };
      }

      const trxIdClean = formData.trxId.trim();
      if (!trxIdClean || trxIdClean.length < 4) {
        throw { message: "Verification Required: Enter TrxID or Sender Number.", type: 'validation' };
      }

      const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const newOrder: Order = {
        id: orderId,
        timestamp: Date.now(),
        package: pkg,
        quantity: quantity,
        playerId: formData.playerId.trim(),
        accountType: formData.accountType,
        paymentMethod: formData.paymentMethod,
        trxId: trxIdClean,
        totalPrice: totalPrice,
        status: OrderStatus.PENDING
      };

      // Save to local storage (simulated database)
      const savedOrders = localStorage.getItem('sadik_orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      localStorage.setItem('sadik_orders', JSON.stringify([...orders, newOrder]));

      setSubmittedOrderId(orderId);
      
      // Artificial delay for professional feel
      setTimeout(() => {
        setIsSuccess(true);
        setIsSubmitting(false);
      }, 1500);

    } catch (err: any) {
      setError(err.message ? err : { message: "Submission failed.", type: 'general' });
      setIsSubmitting(false);
    }
  };

  const getMethodStyle = (method: PaymentMethod) => {
    const isActive = formData.paymentMethod === method;
    switch (method) {
      case PaymentMethod.BKASH: return isActive ? 'bg-[#e2136e] text-white border-[#e2136e]' : 'bg-slate-900 border-slate-700 text-slate-500';
      case PaymentMethod.NAGAD: return isActive ? 'bg-[#f26322] text-white border-[#f26322]' : 'bg-slate-900 border-slate-700 text-slate-500';
      case PaymentMethod.ROCKET: return isActive ? 'bg-[#8c3494] text-white border-[#8c3494]' : 'bg-slate-900 border-slate-700 text-slate-500';
      case PaymentMethod.UPAY: return isActive ? 'bg-[#ffc20e] text-slate-900 border-[#ffc20e]' : 'bg-slate-900 border-slate-700 text-slate-500';
      default: return 'bg-slate-900 border-slate-700 text-slate-500';
    }
  };

  const renderAccountIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.FACEBOOK: return <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>;
      case AccountType.GMAIL: return <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.248 1.248-3.224 2.672-6.52 2.672-5.024 0-9.136-4.056-9.136-9.136s4.112-9.136 9.136-9.136c2.68 0 4.608 1.064 6.056 2.448l2.32-2.32c-2.104-2.024-4.904-3.528-8.376-3.528-6.84 0-12.48 5.64-12.48 12.48s5.64 12.48 12.48 12.48c3.704 0 6.52-1.216 8.776-3.568 2.264-2.264 2.984-5.416 2.984-8.032 0-.712-.064-1.384-.192-2.016h-11.52z"/></svg>;
      case AccountType.ID_CODE: return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#1e293b] rounded-3xl shadow-2xl border border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          {isSuccess ? (
            <div className="py-2 animate-in zoom-in-95 duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-black text-white">Order Received!</h2>
                <p className="text-slate-400 text-xs mt-1">Your order is being processed by our team.</p>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 mb-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Order Receipt</span>
                  <span className="text-[10px] text-green-400 font-black uppercase tracking-widest bg-green-400/10 px-2 py-0.5 rounded">PENDING</span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-bold">Order ID:</span>
                    <button onClick={handleCopyId} className="text-[#ff7d00] font-mono font-bold flex items-center gap-1.5 hover:opacity-80">
                      {submittedOrderId}
                      <svg className={`w-3 h-3 ${idCopied ? 'text-green-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-bold">Item:</span>
                    <span className="text-slate-200 font-bold">{pkg.label} x{quantity}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-bold">Player ID:</span>
                    <span className="text-slate-200 font-bold">{formData.playerId}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-bold">Total Paid:</span>
                    <span className="text-slate-200 font-bold">৳{totalPrice}</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Diamonds will be added to your account within <span className="text-white font-bold">5-30 minutes</span>. If you face any issues, contact support with your Order ID.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => { onTrackOrder?.(); onClose(); }}
                  className="w-full bg-[#ff7d00] hover:bg-[#e67000] text-slate-950 font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  Track My Order
                </button>
                <button onClick={onClose} className="w-full text-slate-500 hover:text-white font-black py-3 transition-all text-[10px] uppercase tracking-widest">
                  Back to Shop
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Complete Order</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Local Direct Processing</p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-3 text-xs font-medium">
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p>{error.message}</p>
                  </div>
                </div>
              )}

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-[#ff7d00]">
                   <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 9.5L12 22L19.5 9.5L12 2Z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Package Details</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-slate-200">{pkg.label}</p>
                    <p className="text-lg font-black text-[#ff7d00]">৳{totalPrice}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Account Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(AccountType).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, accountType: type})}
                        className={`flex flex-col items-center gap-1.5 py-3 px-1 text-[10px] font-black rounded-xl border transition-all ${
                          formData.accountType === type ? 'bg-[#ff7d00]/10 border-[#ff7d00] text-[#ff7d00]' : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}
                      >
                        {renderAccountIcon(type)}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 text-center">Payment Info (Personal)</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-lg font-black text-white font-mono">{PAYMENT_NUMBER}</span>
                    <button type="button" onClick={handleCopyNumber} className={`text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all ${copied ? 'bg-green-500 text-slate-950 border-green-500' : 'text-[#ff7d00] bg-[#ff7d00]/10 border-[#ff7d00]/30'}`}>
                      {copied ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(PaymentMethod).map((m) => (
                      <button key={m} type="button" onClick={() => setFormData({...formData, paymentMethod: m})} className={`py-3 rounded-xl border font-black text-xs transition-all ${getMethodStyle(m)}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">TrxID / Number Proof</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Transaction ID or Sender Number" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#ff7d00] transition-all"
                    value={formData.trxId} 
                    onChange={(e) => setFormData({...formData, trxId: e.target.value})} 
                  />
                  <p className="text-[9px] text-slate-500 italic px-1">
                    Send ৳{totalPrice} to {PAYMENT_NUMBER} before clicking confirm.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`w-full ${isSubmitting ? 'bg-slate-700' : 'bg-[#ff7d00] hover:bg-[#e67000]'} text-slate-950 font-black py-4.5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/10 mt-2`}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-slate-950" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  ) : 'Confirm Direct Order'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
