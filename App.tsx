
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

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.floor(rating) ? 'text-yellow-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#333] pb-20 selection:bg-[#ff7d00] selection:text-white">
      <Header 
        setView={(v) => { setView(v); setSelectedProduct(null); }} 
        currentView={view} 
        isAdmin={isAdmin} 
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        isLoggedIn={!!userEmail}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 sm:pt-52">
        {view === 'shop' && !selectedProduct && (
          <div className="animate-in fade-in duration-700">
            <div className="flex justify-between items-center mb-8 px-1">
              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Showing all {SHOP_PRODUCTS.length} results</span>
              <select className="bg-white border border-slate-200 text-[12px] font-bold px-4 py-2.5 rounded-lg shadow-sm outline-none text-slate-700 focus:border-[#ff7d00]">
                <option>Sort by popularity</option>
                <option>Sort by latest</option>
                <option>Sort by price: low to high</option>
                <option>Sort by price: high to low</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {SHOP_PRODUCTS.map((product) => (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 flex flex-col group">
                  <div className="relative aspect-square overflow-hidden bg-white">
                     <div className="absolute top-3 left-3 z-10 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center p-2 shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" />
                        </svg>
                     </div>
                     <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-4 sm:p-5 text-center flex-1 flex flex-col items-center">
                    <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-700 mb-1.5 leading-tight h-10 overflow-hidden line-clamp-2 group-hover:text-[#ff7d00] transition-colors">{product.title}</h3>
                    <div className="mb-2.5">
                       {renderStars(product.rating)}
                    </div>
                    <p className="text-[#e67e22] font-black text-sm sm:text-base mb-5">{product.priceRange}</p>
                    <button 
                      onClick={() => { setSelectedProduct(product); setSelectedPackage(null); setQuantity(1); window.scrollTo(0,0); }} 
                      className="mt-auto w-full py-2.5 px-4 border border-slate-200 rounded-lg text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-[#ff7d00] hover:text-white hover:border-[#ff7d00] hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                    >
                      Select options
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'shop' && selectedProduct && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 md:p-14 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row gap-10 sm:gap-20">
              {/* Product Gallery */}
              <div className="lg:w-[45%]">
                <div className="relative border-4 border-slate-50 rounded-2xl overflow-hidden group shadow-2xl">
                  <div className="absolute top-6 left-6 z-10 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center p-2.5 shadow-lg group-hover:rotate-12 transition-transform">
                    <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor"><path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" /></svg>
                  </div>
                  <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
              </div>

              {/* Product Details */}
              <div className="lg:w-[55%]">
                <nav className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="cursor-pointer hover:text-[#ff7d00]" onClick={() => setSelectedProduct(null)}>Home</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[#ff7d00]">{selectedProduct.title}</span>
                </nav>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 leading-tight tracking-tight">{selectedProduct.title}</h1>
                <div className="flex items-center gap-3 mb-6">
                  {renderStars(selectedProduct.rating)}
                  <span className="text-[12px] text-slate-400 font-bold uppercase tracking-widest">({selectedProduct.reviews} customer reviews)</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#e67e22] mb-8 bg-slate-50 inline-block px-4 py-1 rounded-xl">
                  {selectedPackage ? `৳ ${selectedPackage.price}` : selectedProduct.priceRange}
                </div>
                
                <p className="text-[14px] text-slate-500 leading-relaxed mb-10 whitespace-pre-line border-l-4 border-slate-100 pl-4 italic">
                  {selectedProduct.description}
                </p>

                <div className="space-y-10">
                  {/* Option Buttons Grid - 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    {getFilteredPackages(selectedProduct.packageIds).map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`flex items-center justify-between px-5 py-5 rounded-xl border-2 transition-all duration-200 group relative ${
                          selectedPackage?.id === pkg.id 
                          ? 'bg-white border-[#ff7d00] text-[#333] shadow-lg shadow-orange-500/10 -translate-y-0.5' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-[12px] font-black tracking-tight group-hover:text-slate-900">{pkg.label}</span>
                        <span className={`text-[11px] font-black ${selectedPackage?.id === pkg.id ? 'text-[#ff7d00]' : 'text-slate-400'}`}>৳ {pkg.price}</span>
                        {selectedPackage?.id === pkg.id && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#ff7d00] rounded-full flex items-center justify-center text-white shadow-sm">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[12px] font-black text-slate-500 uppercase tracking-widest">
                      Player ID/UID <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="এখানে প্লেয়ার আইডি লিখুন"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#ff7d00] focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="flex items-center bg-slate-50 border-2 border-slate-100 rounded-2xl h-16 w-full sm:w-auto overflow-hidden">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-14 h-full text-slate-400 hover:text-[#ff7d00] hover:bg-white font-black transition-all">-</button>
                      <input type="number" readOnly value={quantity} className="w-12 text-center bg-transparent text-[16px] font-black text-slate-800 h-full focus:outline-none" />
                      <button onClick={() => setQuantity(quantity + 1)} className="w-14 h-full text-slate-400 hover:text-[#ff7d00] hover:bg-white font-black transition-all">+</button>
                    </div>
                    <button className="w-full sm:w-auto px-10 h-16 bg-[#ff7d00]/10 border-2 border-[#ff7d00] text-[#ff7d00] font-black rounded-2xl text-[13px] hover:bg-[#ff7d00] hover:text-white transition-all uppercase tracking-widest active:scale-95">Add to basket</button>
                    <button 
                      onClick={handleAction} 
                      className="w-full sm:flex-1 h-16 bg-[#ff7d00] hover:bg-[#e67000] text-white font-black rounded-2xl transition-all active:scale-[0.98] text-[14px] uppercase tracking-widest shadow-xl shadow-orange-500/20"
                    >
                      Buy now
                    </button>
                  </div>

                  <div className="pt-10 border-t border-slate-100 flex flex-col gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                    <p><span className="text-slate-300">SKU:</span> {selectedProduct.id.toUpperCase()}</p>
                    <p><span className="text-slate-300">Categories:</span> FF Discount, Free Fire BD, Free Fire, Top Up, Game Shop</p>
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
