'use client';

import { motion } from 'framer-motion';
import { 
  FiActivity, FiCpu, FiLayers, FiPieChart, FiZap, FiShield 
} from 'react-icons/fi';
import { 
  SiChainlink, SiBinance, SiEthereum, SiPolygon 
} from 'react-icons/si';

// --- MOCKUP DASHBOARD COMPONENT ---
// This component simulates a screenshot of the application's interface.
const DashboardMockup = () => {
  return (
    <div className="w-full aspect-[16/9] bg-[#121214] rounded-xl overflow-hidden flex flex-col">
      {/* App Header */}
      <div className="h-12 bg-[#1E1E24] border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <FiZap className="text-[#8B5CF6]" />
          <span>AI Engine: Online</span>
        </div>
      </div>

      {/* App Body */}
      <div className="flex-1 flex relative">
        {/* Sidebar (Simplified) */}
        <div className="w-16 bg-[#1E1E24]/50 border-r border-white/5 py-4 flex flex-col items-center gap-6">
          {[FiLayers, FiPieChart, FiCpu, FiActivity].map((Icon, i) => (
            <div key={i} className={`p-2 rounded-lg ${i === 0 ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]' : 'text-white/30'}`}>
              <Icon size={18} />
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-[#121214] to-[#0A0A0B]">
          
          {/* Top Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Net Worth Card */}
            <div className="col-span-2 p-5 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
              <div className="absolute right-0 top-0 p-4 text-[#8B5CF6]/20"><FiActivity size={40} /></div>
              <div className="text-sm text-white/50 mb-1">Total Net Worth</div>
              <div className="text-3xl font-bold text-white">$124,500.85</div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <span>+$2,450.10 (24h)</span>
              </div>
              {/* Fake Chart Line */}
              <div className="mt-4 h-16 w-full opacity-30">
                <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                  <path d="M0,25 C10,20 20,28 30,15 C40,5 50,20 60,10 C70,0 80,12 90,5 L100,15" fill="none" stroke="#8B5CF6" strokeWidth="2" />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(139, 92, 246, 0.2)" />
                      <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                    </linearGradient>
                  </defs>
                  <path d="M0,25 C10,20 20,28 30,15 C40,5 50,20 60,10 C70,0 80,12 90,5 L100,15 L100,30 L0,30 Z" fill="url(#grad)" />
                </svg>
              </div>
            </div>
            {/* AI Insight Card */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#8B5CF6]/5 border border-[#8B5CF6]/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#8B5CF6]">
                  <FiCpu /> <span className="text-xs font-bold">AI Insight</span>
                </div>
                <div className="text-sm text-white/80 leading-relaxed">
                  Your portfolio's <strong className="text-white">risk level is low</strong>. Consider increasing exposure to <strong className="text-white">Layer 2</strong> protocols for potential upside.
                </div>
              </div>
              <div className="mt-2 flex gap-1">
                <div className="h-1.5 flex-1 bg-[#8B5CF6] rounded-full"></div>
                <div className="h-1.5 flex-1 bg-[#8B5CF6]/30 rounded-full"></div>
                <div className="h-1.5 flex-1 bg-[#8B5CF6]/30 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Asset List Mockup */}
          <div>
            <div className="text-sm font-bold text-white/70 mb-3">Top Holdings</div>
            <div className="space-y-2">
              {[
                { sym: 'ETH', name: 'Ethereum', price: '$3,450.20', change: '+2.5%', icon: SiEthereum, color: 'text-[#627EEA]' },
                { sym: 'BNB', name: 'Binance Coin', price: '$420.15', change: '+1.2%', icon: SiBinance, color: 'text-[#F3BA2F]' },
                { sym: 'MATIC', name: 'Polygon', price: '$0.95', change: '-0.5%', icon: SiPolygon, color: 'text-[#8247E5]' },
              ].map((asset, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white/5 ${asset.color}`}>
                      <asset.icon size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{asset.name}</div>
                      <div className="text-xs text-white/40">{asset.sym}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{asset.price}</div>
                    <div className={`text-xs ${asset.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{asset.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* AI Scanner Overlay Effect */}
        <motion.div 
          animate={{ top: ['-100%', '200%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[100%] bg-gradient-to-b from-transparent via-[#8B5CF6]/10 to-transparent pointer-events-none"
        />
      </div>
    </div>
  );
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-16 overflow-hidden bg-[#0A0A0B] text-white selection:bg-[#8B5CF6] selection:text-white">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] bg-[#7C3AED]/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 flex flex-col items-center text-center space-y-12">
        
        {/* 1. Heading & Text */}
        <div className="space-y-6 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none"
          >
            Your Crypto Universe, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6]">
              Reimagined.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            Stop guessing. Start knowing. Portly uses advanced AI to analyze, track, and optimize your entire crypto portfolio in real-time.
          </motion.p>
        </div>

        {/* 2. Dashboard Mockup Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-5xl rounded-3xl p-2 bg-gradient-to-b from-white/10 to-white/0 backdrop-blur-xl border border-white/10 shadow-2xl shadow-[#8B5CF6]/20"
        >
          <div className="rounded-2xl overflow-hidden ring-1 ring-white/5">
            <DashboardMockup />
          </div>
          
          {/* Glow Effect behind the mockup */}
          <div className="absolute -inset-4 bg-gradient-to-t from-[#8B5CF6]/20 to-transparent blur-3xl -z-10 rounded-[3rem] opacity-60"></div>
        </motion.div>

        {/* 3. Trusted By Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="pt-8 flex flex-col items-center space-y-6"
        >
          <p className="text-sm font-medium text-white/40 uppercase tracking-widest">
            Powered by Best-in-Class Data Infrastructure
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
            {/* Logos - Using Icons for now, replace with real SVGs */}
            <div className="flex items-center gap-2 text-2xl hover:text-white hover:opacity-100 transition-all cursor-default"><FiShield /> Moralis</div>
            <div className="flex items-center gap-2 text-2xl hover:text-white hover:opacity-100 transition-all cursor-default"><FiZap /> Alchemy</div>
            <div className="flex items-center gap-2 text-2xl hover:text-white hover:opacity-100 transition-all cursor-default"><SiChainlink /> Chainlink</div>
            <div className="flex items-center gap-2 text-xl font-bold hover:text-white hover:opacity-100 transition-all cursor-default">CoinGecko</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}