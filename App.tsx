
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OrderModal from './components/OrderModal';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import OrderTracker from './components/OrderTracker';
import { ALL_PACKAGES as INITIAL_PACKAGES, ADMIN_EMAIL, SHOP_PRODUCTS, ShopProduct } from './constants';
import { DiamondPackage, Order } from './types';

type View = 'shop' | 'admin' | 'tracker';

const App: React.FC = () => {
  const [view, setView] = useState<View>('shop');
  const [packages, setPackages] = useState<DiamondPackage[]>(INITIAL_PACKAGES);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<DiamondPackage | null>(null); 
  const [playerId, setPlayerId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const savedPackages = localStorage.getItem('sadik_packages');
    if (savedPackages) {
      try {
        setPackages(JSON.parse(savedPackages));
      } catch (e) {
        console.error("Error parsing saved packages", e);
      }
    }

    const savedEmail = localStorage.getItem('sadik_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  // Persist packages whenever they change
  useEffect(() => {
    localStorage.setItem('sadik_packages', JSON.stringify(packages));
  }, [packages]);

  const isAdmin = userEmail === ADMIN_EMAIL;

  const handleAction = () => {
    if (!playerId.trim()) {
      alert("Please enter your Player ID/UID first!");
      return;
    }
    setIsModalOpen(true);
  };

  const handleLogin = (email: string) => {
    setUserEmail(email);
    localStorage.setItem('sadik_user_email', email);
    setIsLoginModalOpen(false);
    if (email === ADMIN_EMAIL) {
      setView('admin');
    }
  };

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem('sadik_user_email');
    setView('shop');
    setSelectedProduct(null);
  };

  const getFilteredPackages = (packageIds: string[]) => {
    if (!packageIds || packageIds.length === 0) return packages;
    return packages.filter(p => packageIds.includes(p.id));
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 pb-20">
      <Header 
        setView={(v) => { setView(v); setSelectedProduct(null); }} 
        currentView={view} 
        isAdmin={isAdmin} 
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        isLoggedIn={!!userEmail}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 sm:pt-48">
        {view === 'shop' && !selectedProduct && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <span className="text-xs font-bold text-slate-500">Showing all {SHOP_PRODUCTS.length} results</span>
              <select className="bg-slate-100 text-[11px] font-bold px-3 py-1.5 rounded border-none outline-none text-slate-700">
                <option>Sort by popularity</option>
                <option>Sort by latest</option>
                <option>Sort by price: low to high</option>
                <option>Sort by price: high to low</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {SHOP_PRODUCTS.map((product) => (
                <div key={product.id} className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 group">
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                     <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center p-1 shadow-sm">
                       <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor"><path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" /></svg>
                     </div>
                     <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-[12px] sm:text-[13px] font-bold text-slate-700 h-10 line-clamp-2 leading-tight mb-2">{product.title}</h3>
                    <div className="flex justify-center mb-2">
                       {[1, 2, 3, 4, 5].map(s => (
                         <svg key={s} className={`w-2.5 h-2.5 ${s <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                       ))}
                    </div>
                    <p className="text-[#ff7d00] font-black text-xs sm:text-sm mb-4">{product.priceRange}</p>
                    <button onClick={() => { setSelectedProduct(product); const filtered = getFilteredPackages(product.packageIds); setSelectedPackage(filtered[0] || null); }} className="w-full py-1.5 px-3 border border-slate-300 rounded text-[10px] font-bold text-slate-600 hover:bg-[#ff7d00] hover:text-white hover:border-[#ff7d00] transition-all">Select options</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'shop' && selectedProduct && (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-4 sm:p-8 bg-slate-50 flex items-center justify-center border-r border-slate-100">
                <div className="relative w-full max-w-md">
                   <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full aspect-square object-cover rounded shadow-lg border border-white" />
                  <button onClick={() => setSelectedProduct(null)} className="absolute top-4 left-4 bg-white/80 backdrop-blur rounded-full p-2 shadow-md hover:bg-white transition-colors">
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  </button>
                </div>
              </div>
              <div className="lg:w-1/2 p-6 sm:p-10">
                <nav className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex gap-2">
                  <span>Home</span> / <span>Shop</span> / <span className="text-[#ff7d00]">{selectedProduct.title}</span>
                </nav>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 leading-tight">{selectedProduct.title}</h1>
                <div className="text-xl font-black text-[#ff7d00] mb-8">
                  {selectedPackage ? `৳ ${selectedPackage.price}` : selectedProduct.priceRange}
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Choice Option</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {getFilteredPackages(selectedProduct.packageIds).map((pkg) => (
                        <button key={pkg.id} onClick={() => setSelectedPackage(pkg)} className={`flex flex-col items-center justify-center p-2 rounded border transition-all ${selectedPackage?.id === pkg.id ? 'bg-[#ff7d00]/5 border-[#ff7d00] text-[#ff7d00] shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}>
                          <span className="text-[10px] font-bold text-center leading-tight">{pkg.label}</span>
                          <span className="text-[11px] font-black mt-1">৳ {pkg.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Player ID/UID <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="এখানে প্লেয়ার আইডি লিখুন" value={playerId} onChange={(e) => setPlayerId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff7d00] transition-all" />
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center bg-white border border-slate-200 rounded h-12">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 text-slate-400 hover:text-slate-800 font-bold">-</button>
                      <input type="number" readOnly value={quantity} className="w-8 text-center bg-transparent text-sm font-bold border-x border-slate-100 h-full focus:outline-none" />
                      <button onClick={() => setQuantity(quantity + 1)} className="w-10 text-slate-400 hover:text-slate-800 font-bold">+</button>
                    </div>
                    <button onClick={handleAction} className="flex-1 bg-[#ff7d00] hover:bg-[#e67000] text-white font-bold h-12 rounded shadow-lg shadow-orange-500/10 transition-all active:scale-[0.98] uppercase text-xs tracking-wider">Buy Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'admin' && isAdmin && (
          <AdminPanel packages={packages} updatePrice={(id, p) => setPackages(prev => prev.map(pkg => pkg.id === id ? {...pkg, price: p} : pkg))} deletePackage={(id) => setPackages(prev => prev.filter(p => p.id !== id))} addPackage={(pkg) => setPackages(prev => [...prev, pkg])} bannerImage="" updateBanner={() => {}} />
        )}

        {view === 'tracker' && <OrderTracker />}
      </main>

      {isModalOpen && selectedPackage && (
        <OrderModal pkg={selectedPackage} quantity={quantity} playerId={playerId} onClose={() => setIsModalOpen(false)} onTrackOrder={() => setView('tracker')} />
      )}

      {isLoginModalOpen && <LoginModal onLogin={handleLogin} onClose={() => setIsLoginModalOpen(false)} />}
      <Footer />
    </div>
  );
};

export default App;
