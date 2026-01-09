
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';

const OrderTracker: React.FC = () => {
  const [playerId, setPlayerId] = useState('');
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!playerId.trim()) return;
    const savedOrders = localStorage.getItem('sadik_orders');
    if (savedOrders) {
      const allOrders: Order[] = JSON.parse(savedOrders);
      const filtered = allOrders.filter(o => o.playerId === playerId.trim());
      setMyOrders(filtered);
    }
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-black mb-2">Track Your Order</h2>
        <p className="text-slate-400">Enter your Player ID to see your order history and current status.</p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Enter Player ID/UID"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
          />
          <button 
            onClick={handleSearch}
            className="bg-[#f59e0b] hover:bg-orange-500 text-slate-950 font-black px-8 py-4 rounded-2xl transition-all active:scale-95"
          >
            Track Now
          </button>
        </div>
      </div>

      {searched && (
        <div className="space-y-4">
          {myOrders.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700">
              <p className="text-slate-400">No orders found for this ID.</p>
            </div>
          ) : (
            [...myOrders].reverse().map((order) => (
              <div key={order.id} className="bg-[#1e293b] border border-slate-700 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-2xl flex items-center justify-center text-[#f59e0b]">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L4.5 9.5L12 22L19.5 9.5L12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{order.package.label}</h4>
                    <p className="text-xs text-slate-500">{new Date(order.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-xl font-black text-white mb-1">৳{order.totalPrice}</p>
                  <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    order.status === OrderStatus.COMPLETED ? 'bg-green-500/20 text-green-400' : 
                    order.status === OrderStatus.CANCELLED ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
