
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

      const savedOrders = localStorage.getItem('sadik_orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      localStorage.setItem('sadik_orders', JSON.stringify([...orders, newOrder]));

      setSubmittedOrderId(orderId);
      
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
      case PaymentMethod.BKASH: return isActive ? 'bg-[#e2136e] text-white border-[#e2136e]' : 'bg-slate-50 border-slate-200 text-slate-500';
      case PaymentMethod.NAGAD: return isActive ? 'bg-[#f26322] text-white border-[#f26322]' : 'bg-slate-50 border-slate-200 text-slate-500';
      case PaymentMethod.ROCKET: return isActive ? 'bg-[#8c3494] text-white border-[#8c3494]' : 'bg-slate-50 border-slate-200 text-slate-500';
      case PaymentMethod.UPAY: return isActive ? 'bg-[#ffc20e] text-[#333] border-[#ffc20e]' : 'bg-slate-50 border-slate-200 text-slate-500';
      default: return 'bg-slate-50 border-slate-200 text-slate-500';
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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          {isSuccess ? (
            <div className="py-2 animate-in zoom-in-95 duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Order Received!</h2>
                <p className="text-slate-500 text-xs mt-1 font-medium">Your order is being processed by our team.</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Receipt Details</span>
                  <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider bg-green-100 px-3 py-1 rounded-full">PENDING</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-slate-400 font-medium">Order ID:</span>
                    <button onClick={handleCopyId} className="text-[#ff7d00] font-mono font-bold flex items-center gap-2 hover:opacity-80">
                      {submittedOrderId}
                      <svg className={`w-3.5 h-3.5 ${idCopied ? 'text-green-500' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-slate-400 font-medium">Item:</span>
                    <span className="text-slate-700 font-bold">{pkg.label}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-slate-400 font-medium">Total Paid:</span>
                    <span className="text-[#e67e22] font-bold">৳{totalPrice}</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Processing time: <span className="text-slate-800 font-bold">5-10 minutes</span>. Please keep your Order ID for reference.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => { onTrackOrder?.(); onClose(); }}
                  className="w-full bg-[#ff7d00] hover:bg-[#e67000] text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                >
                  Track My Order
                </button>
                <button onClick={onClose} className="w-full text-slate-400 hover:text-slate-600 font-bold py-3 transition-all text-[11px] uppercase tracking-wider">
                  Back to Shop
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Complete Purchase</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Secure Transaction</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-500 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-3 text-[12px] font-medium">
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p>{error.message}</p>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8 flex items-center gap-5">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-[#ff7d00] shadow-sm">
                   <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 9.5L12 22L19.5 9.5L12 2Z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Item Details</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-slate-700">{pkg.label} x{quantity}</p>
                    <p className="text-lg font-bold text-[#e67e22]">৳{totalPrice}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-3">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(PaymentMethod).map((m) => (
                      <button key={m} type="button" onClick={() => setFormData({...formData, paymentMethod: m})} className={`py-3.5 rounded-xl border font-bold text-[12px] transition-all ${getMethodStyle(m)}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 text-center">Payment Info (Personal)</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-lg font-bold text-slate-800 font-mono tracking-tight">{PAYMENT_NUMBER}</span>
                    <button type="button" onClick={handleCopyNumber} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'text-[#ff7d00] bg-white border-[#ff7d00]/30'}`}>
                      {copied ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Transaction ID / Proof</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Transaction ID or Sender Number" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#ff7d00] transition-all"
                    value={formData.trxId} 
                    onChange={(e) => setFormData({...formData, trxId: e.target.value})} 
                  />
                  <p className="text-[10px] text-slate-400 font-medium px-1">
                    Please pay ৳{totalPrice} to {PAYMENT_NUMBER} before confirming.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`w-full ${isSubmitting ? 'bg-slate-200' : 'bg-[#ff7d00] hover:bg-[#e67000]'} text-white font-bold py-4.5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg mt-4 h-14`}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-slate-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
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
