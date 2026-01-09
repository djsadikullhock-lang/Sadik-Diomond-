
import React, { useState, useEffect } from 'react';
import { DiamondPackage, Order, OrderStatus } from '../types';

interface AdminPanelProps {
  packages: DiamondPackage[];
  updatePrice: (id: string, price: number) => void;
  deletePackage: (id: string) => void;
  addPackage: (pkg: DiamondPackage) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ packages, updatePrice, deletePackage, addPackage }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [newPkg, setNewPkg] = useState({ label: '', price: 0 });

  useEffect(() => {
    const savedOrders = localStorage.getItem('sadik_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('sadik_orders', JSON.stringify(updated));
  };

  const clearOrders = () => {
    if (window.confirm("Are you sure you want to clear all order history? This action cannot be undone.")) {
      setOrders([]);
      localStorage.removeItem('sadik_orders');
    }
  };

  const handleAddPackage = () => {
    if (!newPkg.label || newPkg.price <= 0) return;
    addPackage({
      id: Math.random().toString(36).substr(2, 9),
      label: newPkg.label,
      price: newPkg.price
    });
    setNewPkg({ label: '', price: 0 });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-800/50 p-6 rounded-3xl border border-slate-700 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Admin Dashboard</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Management Console</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-700">
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'orders' ? 'bg-[#f59e0b] text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Orders ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('inventory')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'inventory' ? 'bg-[#f59e0b] text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Inventory
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
             <h3 className="text-lg font-black text-slate-200">Recent Transactions</h3>
             <button onClick={clearOrders} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">Clear All History</button>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-24 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-500 font-bold">No orders found in database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...orders].reverse().map((order) => (
                <div key={order.id} className="bg-[#1e293b] border border-slate-700 p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:border-slate-600 transition-all group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        order.status === OrderStatus.COMPLETED ? 'bg-green-500/20 text-green-400' : 
                        order.status === OrderStatus.CANCELLED ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-black text-xl text-white group-hover:text-[#f59e0b] transition-colors">{order.package.label}</h4>
                      <p className="text-slate-400 text-xs font-bold">Qty: {order.quantity}</p>
                    </div>

                    <div className="bg-slate-900/50 rounded-2xl p-4 space-y-2 border border-slate-800">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-bold uppercase tracking-widest">Player ID</span>
                        <span className="text-slate-200 font-mono font-bold">{order.playerId}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-bold uppercase tracking-widest">Account</span>
                        <span className="text-slate-200 font-bold">{order.accountType}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-bold uppercase tracking-widest">Method</span>
                        <span className="text-slate-200 font-bold">{order.paymentMethod}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-slate-500 font-black text-[10px] uppercase">Amount</span>
                        <span className="text-orange-400 font-black text-lg">৳{order.totalPrice}</span>
                      </div>
                    </div>

                    <div className="mt-4 px-1">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Transaction Proof</p>
                      <p className="text-xs text-slate-300 bg-slate-800/50 px-3 py-2 rounded-xl font-mono break-all border border-slate-700/50">{order.trxId}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button 
                        disabled={order.status === OrderStatus.COMPLETED}
                        onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)}
                        className={`flex-1 text-[11px] font-black uppercase py-3 rounded-xl transition-all ${
                          order.status === OrderStatus.COMPLETED 
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/10'
                        }`}
                      >
                        Complete
                      </button>
                      <button 
                        disabled={order.status === OrderStatus.CANCELLED}
                        onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                        className={`flex-1 text-[11px] font-black uppercase py-3 rounded-xl transition-all ${
                          order.status === OrderStatus.CANCELLED 
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/10'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                    <button 
                      disabled={order.status === OrderStatus.PENDING}
                      onClick={() => updateOrderStatus(order.id, OrderStatus.PENDING)}
                      className={`w-full text-[11px] font-black uppercase py-3 rounded-xl transition-all ${
                        order.status === OrderStatus.PENDING 
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                        : 'bg-amber-500/10 hover:bg-amber-500/20 text-[#f59e0b] border border-[#f59e0b]/30'
                      }`}
                    >
                      {order.status === OrderStatus.PENDING ? 'Currently Pending' : 'Reset to Pending'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 shadow-xl">
            <h3 className="text-xl font-black text-white mb-6">Create New Diamond Package</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Package Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. 100 Diamonds + Bonus" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-all"
                  value={newPkg.label}
                  onChange={(e) => setNewPkg({...newPkg, label: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Price (৳)</label>
                <input 
                  type="number" 
                  placeholder="Price" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-all"
                  value={newPkg.price || ''}
                  onChange={(e) => setNewPkg({...newPkg, price: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={handleAddPackage}
                  className="w-full bg-[#f59e0b] hover:bg-orange-500 text-slate-950 font-black h-[54px] rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Package
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-[#1e293b] border border-slate-700 p-5 rounded-3xl hover:border-[#f59e0b]/30 transition-all shadow-lg group">
                <p className="text-[10px] font-black text-slate-500 mb-3 uppercase tracking-tighter">{pkg.label}</p>
                <div className="flex items-center gap-2 mb-5">
                  <div className="bg-slate-900 rounded-xl px-4 py-2 flex items-center gap-3 border border-slate-800 w-full group-hover:border-slate-700 transition-all">
                    <span className="text-[#f59e0b] font-black">৳</span>
                    <input 
                      type="number" 
                      value={pkg.price}
                      onChange={(e) => updatePrice(pkg.id, parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent font-black text-white text-lg focus:outline-none"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if(window.confirm(`Delete ${pkg.label}?`)) deletePackage(pkg.id);
                  }}
                  className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black py-2.5 rounded-xl transition-all border border-red-500/20 uppercase tracking-widest"
                >
                  Delete Item
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
