
import React, { useState, useEffect } from 'react';
import { DiamondPackage, AccountType, PaymentMethod, OrderForm, Order, OrderStatus } from '../types';
import { PAYMENT_NUMBER, WHATSAPP_NUMBER } from '../constants';

interface OrderModalProps {
  pkg: DiamondPackage;
  quantity: number;
  playerId: string;
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ pkg, quantity, playerId, onClose }) => {
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
  const [fullOrderMessage, setFullOrderMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [msgCopied, setMsgCopied] = useState(false);
  const [redirectionFailed, setRedirectionFailed] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'validation' | 'general' } | null>(null);

  const totalPrice = pkg.price * quantity;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(PAYMENT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMessage = () => {
    const plainText = decodeURIComponent(fullOrderMessage.replace(/\+/g, ' ')).replace(/\*|%0A/g, (match) => match === '%0A' ? '\n' : '');
    navigator.clipboard.writeText(plainText);
    setMsgCopied(true);
    setTimeout(() => setMsgCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.playerId || formData.playerId.trim().length < 5) {
        throw { message: "Invalid Player ID. Please enter a valid UID (usually 8-12 digits).", type: 'validation' };
      }

      const trxIdClean = formData.trxId.trim();
      if (!trxIdClean || trxIdClean.length < 4) {
        throw { message: "Payment proof is too short. Enter the full TrxID or at least the last 4 digits of your number.", type: 'validation' };
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

      const messageContent = `*NEW TOP-UP ORDER*%0A%0A` +
        `🔖 *Order ID:* ${orderId}%0A` +
        `💎 *Item:* ${pkg.label}%0A` +
        `🔢 *Qty:* ${quantity}%0A` +
        `💰 *Total Amount:* ৳${totalPrice}%0A` +
        `🆔 *Player ID:* ${formData.playerId}%0A` +
        `👤 *Account:* ${formData.accountType}%0A` +
        `💳 *Method:* ${formData.paymentMethod}%0A` +
        `✅ *TrxID/Number:* ${formData.trxId}%0A%0A` +
        `Please process my order. Thank you!`;

      setFullOrderMessage(messageContent);
      setSubmittedOrderId(orderId);
      setIsSuccess(true);
      setIsSubmitting(false);

      // Attempt Redirection
      const whatsappDeepLink = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${messageContent}`;
      const whatsappWebLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${messageContent}`;

      setTimeout(() => {
        const start = Date.now();
        window.location.href = whatsappDeepLink;
        
        // Detection logic: If the app hasn't switched focus after 1.5 seconds, the protocol likely failed
        setTimeout(() => {
          if (Date.now() - start < 2000 && !document.hidden) {
            console.log("Deep link failed, trying web link...");
            window.location.href = whatsappWebLink;
            
            // Secondary check for web link/popup blocking
            setTimeout(() => {
              if (!document.hidden) {
                setRedirectionFailed(true);
              }
            }, 2500);
          }
        }, 1500);
      }, 800);

      // Auto-close modal after 15 seconds (increased to allow for manual fixes)
      setTimeout(() => {
        if (!document.hidden && !redirectionFailed) {
           onClose();
        }
      }, 15000);

    } catch (err: any) {
      setError(err.message ? err : { message: "Submission failed. Try again.", type: 'general' });
      setIsSubmitting(false);
    }
  };

  const renderAccountIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.FACEBOOK:
        return <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>;
      case AccountType.GMAIL:
        return <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.248 1.248-3.224 2.672-6.52 2.672-5.024 0-9.136-4.056-9.136-9.136s4.112-9.136 9.136-9.136c2.68 0 4.608 1.064 6.056 2.448l2.32-2.32c-2.104-2.024-4.904-3.528-8.376-3.528-6.84 0-12.48 5.64-12.48 12.48s5.64 12.48 12.48 12.48c3.704 0 6.52-1.216 8.776-3.568 2.264-2.264 2.984-5.416 2.984-8.032 0-.712-.064-1.384-.192-2.016h-11.52z"/></svg>;
      case AccountType.ID_CODE:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#1e293b] rounded-3xl shadow-2xl border border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-xl font-black text-white mb-1">Order Saved locally</h2>
              <p className="text-green-400 text-xs font-bold mb-6 italic">ID: {submittedOrderId}</p>
              
              {redirectionFailed && (
                <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-left">
                  <div className="flex items-center gap-2 mb-2 text-orange-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-xs font-black uppercase">Redirection Issue</p>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    It looks like we couldn't open WhatsApp automatically. You may not have the app installed or pop-ups are blocked. 
                    <br/><br/>
                    Please use the buttons below to contact us manually with your Order ID.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${fullOrderMessage}`}
                  className="block w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Try Opening WhatsApp
                </button>
                <button 
                  onClick={handleCopyMessage}
                  className={`block w-full ${msgCopied ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'} text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2`}
                >
                  {msgCopied ? 'COPIED!' : 'Copy Order Details'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                </button>
                <button onClick={onClose} className="w-full text-slate-500 hover:text-white font-medium py-2 transition-all text-xs">
                  Cancel & Close
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Checkout Summary</h2>
                <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl text-xs bg-red-500/10 border border-red-500/50 text-red-400 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    <p className="font-black uppercase">Validation Error</p>
                  </div>
                  <p className="font-medium">{error.message}</p>
                </div>
              )}

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-[#f59e0b]">
                   <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 9.5L12 22L19.5 9.5L12 2Z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Order Details</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-slate-200">{pkg.label} x {quantity}</p>
                    <p className="text-lg font-black text-[#f59e0b]">৳{totalPrice}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Account Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[AccountType.ID_CODE, AccountType.FACEBOOK, AccountType.GMAIL].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, accountType: type})}
                        className={`flex flex-col items-center gap-1.5 py-3 px-1 text-[10px] font-black rounded-xl border transition-all ${
                          formData.accountType === type 
                          ? 'bg-[#f59e0b]/10 border-[#f59e0b] text-[#f59e0b]' 
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}
                      >
                        {renderAccountIcon(type)}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Send Money to (Personal)</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white font-mono tracking-tighter">{PAYMENT_NUMBER}</span>
                    <button 
                      type="button" 
                      onClick={handleCopyNumber} 
                      className={`text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all ${copied ? 'bg-green-500 text-slate-950 border-green-500' : 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30'}`}
                    >
                      {copied ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[PaymentMethod.BKASH, PaymentMethod.NAGAD].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({...formData, paymentMethod: m})}
                      className={`py-3.5 rounded-xl border font-black text-xs transition-all ${
                        formData.paymentMethod === m 
                        ? (m === PaymentMethod.BKASH ? 'bg-[#e2136e]/10 border-[#e2136e] text-[#e2136e]' : 'bg-[#f26322]/10 border-[#f26322] text-[#f26322]') 
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                    Payment Proof (TrxID or Number)
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. 8L2K9J... or Last 4 Digits" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]/20 transition-all"
                    value={formData.trxId} 
                    onChange={(e) => setFormData({...formData, trxId: e.target.value})} 
                  />
                  <p className="text-[10px] text-slate-500 font-medium px-1">
                    Enter the Transaction ID from your payment SMS or the last 4 digits of the number you sent money from.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`w-full ${isSubmitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#128C7E] shadow-xl hover:shadow-[#25D366]/10'} text-white font-black py-4.5 rounded-2xl flex items-center justify-center gap-3 transition-all mt-4 active:scale-[0.98]`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      VERIFYING...
                    </>
                  ) : 'CONFIRM VIA WHATSAPP'}
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
