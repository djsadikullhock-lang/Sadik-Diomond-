
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

  useEffect(() => {
    const savedPackages = localStorage.getItem('sadik_packages');
    if (savedPackages) {
      try {
        const parsed = JSON.parse(savedPackages);
        if (parsed.length > 0) {
          setPackages(parsed);
        } else {
          setPackages(INITIAL_PACKAGES);
        }
      } catch (e) {
        setPackages(INITIAL_PACKAGES);
      }
    }
    const savedEmail = localStorage.getItem('sadik_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sadik_packages', JSON.stringify(packages));
  }, [packages]);

  const isAdmin = userEmail === ADMIN_EMAIL;

  const handleAction = () => {
    if (!playerId.trim()) {
      alert("Please enter your Player ID/UID first!");
      return;
    }
    if (!selectedPackage) {
      alert("Please select a package first!");
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
    <div className="min-h-screen bg-[#f7f9fc] text-[#333] pb-20">
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
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {SHOP_PRODUCTS.map((product) => (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col cursor-pointer" onClick={() => { setSelectedProduct(product); setSelectedPackage(null); setQuantity(1); window.scrollTo(0,0); }}>
                  <div className="relative aspect-square overflow-hidden">
                     <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-[13px] font-bold text-slate-700 h-10 overflow-hidden line-clamp-2">{product.title}</h3>
                    <p className="text-[#e67e22] font-black text-sm mt-2">{product.priceRange}</p>
                    <button className="mt-4 w-full py-2 bg-[#ff7d00] text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">Select options</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'shop' && selectedProduct && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 animate-in fade-in duration-300">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Product Gallery */}
              <div className="lg:w-[45%]">
                <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-auto object-cover rounded-xl border border-slate-50 shadow-sm" />
              </div>

              {/* Product Details - Exactly matching screenshot */}
              <div className="lg:w-[55%] space-y-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">{selectedProduct.title}</h1>
                  
                  {/* Price Pill Styled Container */}
                  <div className="inline-block bg-[#f0f7ff] rounded-2xl px-6 py-2 mb-6">
                    <span className="text-2xl font-black text-[#e67e22]">
                      {selectedPackage ? `৳ ${selectedPackage.price}` : selectedProduct.priceRange}
                    </span>
                  </div>

                  {/* Description with Vertical Accent */}
                  <div className="border-l-4 border-slate-100 pl-6 mb-10">
                    <p className="text-[14px] text-slate-500 leading-relaxed italic whitespace-pre-line">
                      {selectedProduct.description}
                    </p>
                  </div>
                </div>

                {/* Package Options Grid - Fixed Visibility */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Choose Your Package</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {getFilteredPackages(selectedProduct.packageIds).map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${
                          selectedPackage?.id === pkg.id 
                          ? 'bg-white border-[#ff7d00] text-slate-900 ring-4 ring-orange-500/5' 
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-[12px] font-bold">{pkg.label}</span>
                        <span className={`text-[11px] font-bold ${selectedPackage?.id === pkg.id ? 'text-[#ff7d00]' : 'text-slate-400'}`}>৳ {pkg.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* User Input Fields - Match Screenshot */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[12px] font-black text-slate-500 uppercase tracking-widest mb-3">
                      PLAYER ID/UID <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="এখানে প্লেয়ার আইডি লিখুন"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value)}
                      className="w-full bg-[#f4f7fa] border border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#ff7d00] transition-all"
                    />
                  </div>

                  {/* Quantity and Actions */}
                  <div className="space-y-4">
                    <div className="flex items-center bg-[#f4f7fa] border border-slate-200 rounded-2xl h-16 w-full px-6">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-400 hover:text-slate-800 font-black text-xl">-</button>
                      <input type="number" readOnly value={quantity} className="flex-1 text-center bg-transparent text-lg font-black text-slate-800 focus:outline-none" />
                      <button onClick={() => setQuantity(quantity + 1)} className="text-slate-400 hover:text-slate-800 font-black text-xl">+</button>
                    </div>

                    <button className="w-full h-16 bg-[#fff7f0] border-2 border-[#ff7d00] text-[#ff7d00] font-black rounded-2xl text-[14px] uppercase tracking-widest hover:bg-[#fff0e6] transition-all">
                      ADD TO BASKET
                    </button>
                    
                    <button 
                      onClick={handleAction} 
                      className="w-full h-16 bg-[#ff7d00] text-white font-black rounded-2xl text-[14px] uppercase tracking-widest shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
                    >
                      BUY NOW
                    </button>
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
