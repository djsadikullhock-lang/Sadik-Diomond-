
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
        <svg key={s} className={`w-3 h-3 ${s <= Math.floor(rating) ? 'text-yellow-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-[#333] pb-20">
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
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6 px-1">
              <span className="text-[12px] font-medium text-slate-500">Showing all {SHOP_PRODUCTS.length} results</span>
              <select className="bg-white border border-slate-200 text-[11px] font-medium px-4 py-2 rounded shadow-sm outline-none text-slate-700">
                <option>Sort by popularity</option>
                <option>Sort by latest</option>
                <option>Sort by price: low to high</option>
                <option>Sort by price: high to low</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {SHOP_PRODUCTS.map((product) => (
                <div key={product.id} className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-white p-1">
                     <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center p-1.5 shadow-sm">
                        <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" />
                        </svg>
                     </div>
                     <img src={product.image} alt={product.title} className="w-full h-full object-cover rounded" />
                  </div>
                  <div className="p-3 sm:p-4 text-center flex-1 flex flex-col items-center">
                    <h3 className="text-[12px] sm:text-[13px] font-medium text-slate-700 mb-1 leading-tight h-10 overflow-hidden line-clamp-2">{product.title}</h3>
                    <div className="mb-2">
                       {renderStars(product.rating)}
                    </div>
                    <p className="text-[#e67e22] font-bold text-[13px] sm:text-sm mb-4">{product.priceRange}</p>
                    <button 
                      onClick={() => { setSelectedProduct(product); setSelectedPackage(null); setQuantity(1); }} 
                      className="mt-auto w-full py-2 px-3 border border-slate-200 rounded text-[11px] font-bold text-slate-500 hover:bg-[#ff7d00] hover:text-white hover:border-[#ff7d00] transition-all"
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
          <div className="bg-white rounded p-4 sm:p-8 md:p-12 shadow-sm border border-slate-200 animate-in fade-in duration-300">
            <div className="flex flex-col lg:flex-row gap-8 sm:gap-16">
              {/* Product Gallery */}
              <div className="lg:w-[45%]">
                <div className="relative border border-slate-100 rounded p-1">
                  <div className="absolute top-4 left-4 z-10 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center p-2 shadow-sm">
                    <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor"><path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" /></svg>
                  </div>
                  <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-auto object-cover rounded" />
                </div>
              </div>

              {/* Product Details */}
              <div className="lg:w-[55%]">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#333] mb-2">{selectedProduct.title}</h1>
                <div className="flex items-center gap-2 mb-6">
                  {renderStars(selectedProduct.rating)}
                  <span className="text-[11px] text-slate-400 font-medium">({selectedProduct.reviews} customer reviews)</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#e67e22] mb-6">
                  {selectedPackage ? `৳ ${selectedPackage.price}` : selectedProduct.priceRange}
                </div>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {getFilteredPackages(selectedProduct.packageIds).map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`flex items-center justify-between px-4 py-4 rounded border text-[11px] font-semibold transition-all ${
                          selectedPackage?.id === pkg.id 
                          ? 'bg-white border-[#f8b482] text-[#333] ring-1 ring-[#f8b482]' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <span>{pkg.label}</span>
                        <span className="text-[10px] text-slate-400 font-medium">৳ {pkg.price}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[13px] font-bold text-slate-700">
                      Player ID/UID <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="এখানে প্লেয়ার আইডি লিখুন"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-4 py-4 text-sm focus:outline-none focus:border-[#f8b482] focus:ring-1 focus:ring-[#f8b482] transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center bg-white border border-slate-200 rounded h-14 w-full sm:w-auto overflow-hidden">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full text-slate-400 hover:text-slate-800 hover:bg-slate-50 font-bold transition-colors">-</button>
                      <input type="number" readOnly value={quantity} className="w-10 text-center bg-transparent text-[14px] font-bold h-full focus:outline-none" />
                      <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full text-slate-400 hover:text-slate-800 hover:bg-slate-50 font-bold transition-colors">+</button>
                    </div>
                    <button className="w-full sm:w-auto px-10 h-14 bg-[#f8b482]/20 border border-[#f8b482] text-[#e67e22] font-bold rounded text-[13px] hover:bg-[#f8b482]/30 transition-all uppercase tracking-wide">Add to basket</button>
                    <button 
                      onClick={handleAction} 
                      className="w-full sm:flex-1 h-14 bg-[#f8b482] hover:bg-[#e67e22] text-white font-bold rounded transition-all active:scale-[0.98] text-[13px] uppercase tracking-wide shadow-sm"
                    >
                      Buy now
                    </button>
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex flex-col gap-2 text-[11px] text-slate-400 font-medium">
                    <p><span className="font-bold text-slate-500">SKU:</span> {selectedProduct.id.toUpperCase()}</p>
                    <p><span className="font-bold text-slate-500">Categories:</span> FF Discount, Free Fire BD, Free Fire, Top Up, Game Shop</p>
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
