
import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import OrderModal from './components/OrderModal';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import OrderTracker from './components/OrderTracker';
import { ALL_PACKAGES as INITIAL_PACKAGES, ADMIN_EMAIL } from './constants';
import { DiamondPackage, Order } from './types';

type View = 'shop' | 'admin' | 'tracker';

const App: React.FC = () => {
  const [view, setView] = useState<View>('shop');
  const [packages, setPackages] = useState<DiamondPackage[]>(INITIAL_PACKAGES);
  const [selectedPackage, setSelectedPackage] = useState<DiamondPackage | null>(INITIAL_PACKAGES[3] || INITIAL_PACKAGES[0] || null); 
  const [playerId, setPlayerId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const isAdmin = userEmail === ADMIN_EMAIL;

  // Load packages and auth session
  useEffect(() => {
    const savedPackages = localStorage.getItem('sadik_packages');
    if (savedPackages) {
      try {
        const parsed = JSON.parse(savedPackages);
        setPackages(parsed);
        // Sync selected package if the one from INITIAL_PACKAGES isn't the same as in storage
        if (parsed.length > 0) {
          setSelectedPackage(parsed[3] || parsed[0]);
        }
      } catch (e) {
        console.error("Failed to parse saved packages", e);
      }
    }

    const savedEmail = localStorage.getItem('sadik_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

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
  };

  const updatePackagePrice = (id: string, newPrice: number) => {
    const updated = packages.map(p => p.id === id ? { ...p, price: newPrice } : p);
    setPackages(updated);
    localStorage.setItem('sadik_packages', JSON.stringify(updated));
  };

  const deletePackage = (id: string) => {
    const updated = packages.filter(p => p.id !== id);
    setPackages(updated);
    localStorage.setItem('sadik_packages', JSON.stringify(updated));
    // Reset selected package if deleted
    if (selectedPackage?.id === id) {
      setSelectedPackage(updated[0] || null);
    }
  };

  const addPackage = (pkg: DiamondPackage) => {
    const updated = [...packages, pkg];
    setPackages(updated);
    localStorage.setItem('sadik_packages', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pb-20">
      <Header 
        setView={setView} 
        currentView={view} 
        isAdmin={isAdmin} 
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        isLoggedIn={!!userEmail}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {view === 'shop' && (
          <div className="bg-[#1e293b] rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row">
              {/* Left Column: Product Image */}
              <div className="lg:w-1/3 p-6 md:p-8 border-r border-slate-700/50 flex flex-col items-center">
                <div className="sticky top-24 w-full">
                  <div className="relative group mb-6">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#f59e0b] to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    <img 
                      src="https://media.discordapp.net/attachments/1090184495543263302/1154746487448272936/Free-Fire-Banner.jpg" 
                      alt="Free Fire Diamond Top Up" 
                      className="relative rounded-2xl w-full object-cover shadow-lg"
                    />
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Details</h3>
                    <div className="space-y-1 text-[11px] text-slate-400">
                      <p>SKU: FFDIAMONDBD</p>
                      <p>Categories: FF Discount, Free Fire BD, Top Up, Game</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Selection Grid & Inputs */}
              <div className="lg:w-2/3 p-6 md:p-10 bg-slate-100/5">
                <h1 className="text-2xl font-bold mb-2 text-white">Free Fire Diamond Top Up BD</h1>
                
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-3.5 h-3.5 ${star <= 4 ? 'text-yellow-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-[11px] text-slate-500 ml-2">(2101 customer reviews)</span>
                </div>

                <div className="text-xl font-bold text-orange-400 mb-6">
                  ৳ {packages.length > 0 ? packages[0].price : 0} – ৳ {packages.length > 0 ? packages[packages.length - 1].price : 0}
                </div>

                {/* Grid System for Package Selection */}
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded border text-left transition-all ${
                        selectedPackage?.id === pkg.id 
                        ? 'bg-slate-800 border-[#f59e0b] text-white' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-[12px] font-medium">{pkg.label}</span>
                      <span className="text-[11px] font-bold text-orange-500">৳ {pkg.price}</span>
                    </button>
                  ))}
                </div>

                {/* Player ID Section */}
                <div className="mb-8">
                  <label className="block text-xs font-bold text-slate-400 mb-2">
                    Player ID/UID<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="এখানে প্লেয়ার আইডি লিখুন"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#f59e0b] transition-all"
                  />
                </div>

                {/* Quantity and Buttons */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center text-xs text-slate-400 mr-2">Quantity:</div>
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded h-10">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 hover:bg-slate-800 text-slate-500 text-lg">-</button>
                      <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="bg-transparent w-10 text-center focus:outline-none text-sm font-bold border-x border-slate-700 h-full" />
                      <button onClick={() => setQuantity(quantity + 1)} className="px-3 hover:bg-slate-800 text-slate-500 text-lg">+</button>
                    </div>
                    <button onClick={handleAction} className="flex-1 bg-orange-400/80 hover:bg-orange-400 text-slate-900 font-bold px-6 h-10 rounded text-xs transition-colors">Add to basket</button>
                  </div>
                  <button onClick={handleAction} className="w-full bg-orange-400/80 hover:bg-orange-400 text-slate-900 font-bold h-10 rounded text-xs transition-colors">Buy now</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'admin' && isAdmin && (
          <AdminPanel 
            packages={packages} 
            updatePrice={updatePackagePrice} 
            deletePackage={deletePackage}
            addPackage={addPackage}
          />
        )}

        {view === 'tracker' && (
          <OrderTracker />
        )}
      </main>

      {isModalOpen && selectedPackage && (
        <OrderModal 
          pkg={selectedPackage} 
          quantity={quantity}
          playerId={playerId}
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {isLoginModalOpen && (
        <LoginModal 
          onLogin={handleLogin}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}

      <Footer />
      <Analytics />
    </div>
  );
};

export default App;
