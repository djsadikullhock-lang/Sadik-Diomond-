
import React, { useState, useEffect } from 'react';
import { DiamondPackage, Order, OrderStatus } from '../types';

interface AdminPanelProps {
  packages: DiamondPackage[];
  updatePrice: (id: string, price: number) => void;
  deletePackage: (id: string) => void;
  addPackage: (pkg: DiamondPackage) => void;
  bannerImage: string;
  updateBanner: (url: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ packages, updatePrice, deletePackage, addPackage, bannerImage, updateBanner }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'settings'>('orders');
  const [newPkg, setNewPkg] = useState({ label: '', price: 0, image: '' });
  const [bannerPreview, setBannerPreview] = useState(bannerImage);

  useEffect(() => {
    const savedOrders = localStorage.getItem('sadik_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isBanner: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isBanner) {
        setBannerPreview(base64String);
        updateBanner(base64String);
      } else {
        setNewPkg({ ...newPkg, image: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setNewPkg({ ...newPkg, image: '' });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('sadik_orders', JSON.stringify(updated));
  };

  const clearOrders = () => {
    if (window.confirm("Are you sure you want to clear all order history?")) {
      setOrders([]);
      localStorage.removeItem('sadik_orders');
    }
  };

  const handleAddPackage = () => {
    if (!newPkg.label || newPkg.price <= 0) {
      alert("Please enter a valid label and price.");
      return;
    }
    addPackage({
      id: Math.random().toString(36).substr(2, 9),
      label: newPkg.label,
      price: newPkg.price,
      image: newPkg.image
    });
    setNewPkg({ label: '', price: 0, image: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800/50 p-6 rounded-3xl border border-slate-700 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Admin Dashboard</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Management Console</p>
        </div>
        <div className="flex flex-wrap bg-slate-900 p-1 rounded-2xl border border-slate-700">
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'orders' ? 'bg-[#ff7d00] text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Orders ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('inventory')} 
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'inventory' ? 'bg-[#ff7d00] text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'settings' ? 'bg-[#ff7d00] text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
             <h3 className="text-lg font-black text-slate-200">Recent Transactions</h3>
             <button onClick={clearOrders} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400">Clear All</button>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No orders to display.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...orders].reverse().map((order) => (
                <div key={order.id} className="bg-[#1e293b] border border-slate-700 p-6 rounded-3xl shadow-xl hover:border-slate-600 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      order.status === OrderStatus.COMPLETED ? 'bg-green-500/20 text-green-400' : 
                      order.status === OrderStatus.CANCELLED ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold">{new Date(order.timestamp).toLocaleString()}</span>
                  </div>
                  <h4 className="font-black text-lg text-white mb-4">{order.package.label}</h4>
                  <div className="bg-slate-900/50 rounded-2xl p-4 space-y-2 border border-slate-800 text-[11px] mb-6">
                    <div className="flex justify-between"><span className="text-slate-500 font-bold uppercase">Player ID</span><span className="text-slate-200 font-mono">{order.playerId}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold uppercase">Account</span><span className="text-slate-200">{order.accountType}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold uppercase">Payment</span><span className="text-slate-200">{order.paymentMethod}</span></div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between"><span className="text-slate-500 font-black">TOTAL</span><span className="text-orange-400 font-black">৳{order.totalPrice}</span></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateOrderStatus(order.id, OrderStatus.COMPLETED)} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black uppercase py-2.5 rounded-xl transition-colors">Complete</button>
                    <button onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase py-2.5 rounded-xl transition-colors">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'inventory' ? (
        <div className="space-y-6">
          <div className="bg-[#1e293b] p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl">
            <h3 className="text-xl font-black text-white mb-6">Add New Package</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Package Name</label>
                <input type="text" placeholder="e.g. 100 Diamonds" className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-[#ff7d00] transition-colors" value={newPkg.label} onChange={(e) => setNewPkg({...newPkg, label: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Price (৳)</label>
                <input type="number" placeholder="0" className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-[#ff7d00] transition-colors" value={newPkg.price || ''} onChange={(e) => setNewPkg({...newPkg, price: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Package Icon</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 cursor-pointer hover:border-[#ff7d00]/50 transition-all overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-500 flex items-center gap-2">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" />
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {newPkg.image ? 'Image Selected' : 'Upload Icon'}
                  </label>
                  {newPkg.image && (
                    <div className="relative group">
                      <img src={newPkg.image} className="w-11 h-11 object-cover rounded-xl border border-slate-700" alt="Preview" />
                      <button onClick={removeSelectedImage} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] hover:bg-red-400 transition-colors">×</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-1">
                <button onClick={handleAddPackage} className="w-full bg-[#ff7d00] hover:bg-orange-500 text-slate-950 font-black h-11 rounded-2xl shadow-xl shadow-orange-500/10 transition-all uppercase tracking-widest text-[10px]">Add Package</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-[#1e293b] border border-slate-700 p-5 rounded-3xl hover:border-[#ff7d00]/30 transition-all shadow-lg group">
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-800 bg-slate-900 group-hover:border-[#ff7d00]/20 transition-colors">
                    {pkg.image ? (
                      <img src={pkg.image} className="w-full h-full object-cover" alt={pkg.label} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#ff7d00]">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 9.5L12 22L19.5 9.5L12 2Z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-black text-white uppercase leading-tight truncate">{pkg.label}</p>
                    <p className="text-[9px] text-slate-500 font-bold mt-1">ID: {pkg.id}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-2xl px-4 py-2.5 border border-slate-800 flex items-center gap-3 w-full group-hover:border-slate-700 transition-colors">
                    <span className="text-[#ff7d00] font-black text-xs">৳</span>
                    <input 
                      type="number" 
                      value={pkg.price} 
                      onChange={(e) => updatePrice(pkg.id, parseInt(e.target.value) || 0)} 
                      className="w-full bg-transparent font-black text-white text-sm focus:outline-none" 
                    />
                  </div>
                  <button onClick={() => window.confirm(`Delete ${pkg.label}?`) && deletePackage(pkg.id)} className="w-full bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white text-[9px] font-black py-2.5 rounded-xl transition-all uppercase tracking-widest border border-red-500/20">Delete Package</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 shadow-xl max-w-2xl">
          <h3 className="text-xl font-black text-white mb-6">Store Settings</h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Main Banner Image</label>
              <div className="relative group rounded-3xl overflow-hidden border border-slate-700 aspect-video mb-4 bg-slate-900 flex items-center justify-center">
                {bannerPreview ? (
                  <img src={bannerPreview} className="w-full h-full object-cover" alt="Banner Preview" />
                ) : (
                  <span className="text-slate-600 text-xs font-bold uppercase">No Banner Set</span>
                )}
                <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                  <span className="text-white font-black uppercase text-xs">Change Banner</span>
                </label>
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed px-1">
                Recommendation: Use a wide landscape image (16:9 ratio). This image will appear at the top of the store page.
              </p>
            </div>
            
            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-[11px] text-amber-200/80 font-medium">Changes to store settings are saved automatically to your browser's local storage.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
