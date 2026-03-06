'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// DSA: HashMap for O(1) category lookup
const TOOLS = {
  point_table: {
    id: 'point_table',
    title: 'POINT TABLE',
    subtitle: 'Auto-calculate tournament standings',
    icon: '📊',
    color: 'from-red-600 to-red-800',
    glow: 'rgba(239,68,68,0.4)',
    border: 'rgba(239,68,68,0.3)',
    href: '/tournaments/create',
    tag: 'FREE',
    tagColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    features: ['40+ formats', 'Auto calculate', 'Export PNG'],
    stats: '2.4K uses'
  },
  certificate: {
    id: 'certificate',
    title: 'CERTIFICATE',
    subtitle: 'Professional winner certificates',
    icon: '🏆',
    color: 'from-yellow-600 to-orange-700',
    glow: 'rgba(234,179,8,0.4)',
    border: 'rgba(234,179,8,0.3)',
    href: '/studio/certificate',
    tag: 'FREE',
    tagColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    features: ['Custom templates', 'Player name auto-fill', 'Download HD'],
    stats: '1.1K uses'
  },
  banner: {
    id: 'banner',
    title: 'TOURNAMENT BANNER',
    subtitle: 'Eye-catching event banners',
    icon: '🎨',
    color: 'from-purple-600 to-indigo-700',
    glow: 'rgba(139,92,246,0.4)',
    border: 'rgba(139,92,246,0.3)',
    href: '/studio/banner',
    tag: 'FREE',
    tagColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    features: ['Gaming themes', 'Custom text', 'Social media sizes'],
    stats: '890 uses'
  },
  mvp_banner: {
    id: 'mvp_banner',
    title: 'MVP BANNER',
    subtitle: 'Highlight your best player',
    icon: '⚡',
    color: 'from-cyan-600 to-blue-700',
    glow: 'rgba(6,182,212,0.4)',
    border: 'rgba(6,182,212,0.3)',
    href: '/studio/mvp-banner',
    tag: 'FREE',
    tagColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    features: ['Auto stats fill', 'Pro design', 'Share ready'],
    stats: '670 uses'
  }
};

// DSA: Priority Queue simulation for top designers
const TOP_DESIGNERS = [
  { name: 'XENON', rating: 4.9, sales: 234, avatar: 'X', color: 'from-red-600 to-purple-600', specialty: 'Banners' },
  { name: 'NOVA', rating: 4.8, sales: 189, avatar: 'N', color: 'from-blue-600 to-cyan-600', specialty: 'Certificates' },
  { name: 'BLADE', rating: 4.7, sales: 156, avatar: 'B', color: 'from-green-600 to-emerald-600', specialty: 'MVP Cards' },
];

const FEATURED_TEMPLATES = [
  { title: 'FIRE TOURNAMENT', category: 'Banner', price: 49, designer: 'XENON', preview: '🔥', downloads: 89 },
  { title: 'CHAMPION CERT', category: 'Certificate', price: 29, designer: 'NOVA', preview: '🏆', downloads: 134 },
  { title: 'CLUTCH MVP', category: 'MVP Banner', price: 39, designer: 'BLADE', preview: '⚡', downloads: 67 },
  { title: 'DARK ARENA', category: 'Banner', price: 0, designer: 'XENON', preview: '🎮', downloads: 445 },
];

export default function StudioHub() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const categories = ['ALL', 'BANNER', 'CERTIFICATE', 'MVP BANNER', 'THEME'];

  // DSA: HashMap filter O(1)
  const filteredTemplates = activeCategory === 'ALL'
    ? FEATURED_TEMPLATES
    : FEATURED_TEMPLATES.filter(t => t.category.toUpperCase() === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .scan-line { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.01) 2px, rgba(239,68,68,0.01) 4px); }
        .tool-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
        .tool-card:hover { transform: translateY(-6px); }
        .template-card { transition: all 0.2s ease; }
        .template-card:hover { transform: translateY(-3px); }
        .designer-card { transition: all 0.2s ease; }
        .designer-card:hover { transform: translateY(-2px); }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes glow-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .float { animation: float 4s ease-in-out infinite; }
        .glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
        .shimmer-text { background: linear-gradient(90deg, #ef4444, #f97316, #ef4444); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 2px; }
      `}</style>

      {/* HERO SECTION */}
      <div className="relative overflow-hidden scan-line" style={{background: 'linear-gradient(135deg, #0a0000 0%, #000 50%, #00000a 100%)', minHeight: '380px'}}>
        <div className="grid-bg absolute inset-0 opacity-40" />

        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-5 glow-pulse" style={{background: 'radial-gradient(circle, #ef4444, transparent)', filter: 'blur(60px)'}} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-5 glow-pulse" style={{background: 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(60px)', animationDelay: '1s'}} />

        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-black tracking-widest">CREATIVE SUITE FOR ESPORTS</span>
          </div>

          {/* Title */}
          <h1 className="font-black mb-4 leading-none" style={{fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(40px, 8vw, 80px)'}}>
            <span className="shimmer-text">VINCI</span>
            <span className="text-white"> STUDIO</span>
          </h1>
          <p className="text-gray-400 text-lg font-bold max-w-2xl mx-auto mb-8">
            Create professional esports graphics in seconds. Point tables, certificates, banners & more.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/tournaments/create">
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-black text-sm tracking-widest transition"
                style={{boxShadow: '0 0 30px rgba(239,68,68,0.5)'}}>
                ⚡ START CREATING
              </button>
            </Link>
            <button onClick={() => document.getElementById('designer-store').scrollIntoView({behavior: 'smooth'})}
              className="flex items-center gap-2 bg-transparent border border-gray-700 hover:border-red-500/50 text-gray-300 hover:text-white px-8 py-3 rounded-xl font-black text-sm tracking-widest transition">
              🎨 BROWSE TEMPLATES
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
            {[['5K+', 'CREATIONS'], ['200+', 'TEMPLATES'], ['50+', 'DESIGNERS'], ['FREE', 'TO START']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-black text-xl text-red-400" style={{fontFamily: "'Orbitron', sans-serif"}}>{val}</div>
                <div className="text-xs text-gray-600 font-black tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* TOOLS SECTION */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-black tracking-widest text-red-500/70 mb-1" style={{fontFamily: "'Orbitron', sans-serif"}}>// FREE TOOLS</p>
              <h2 className="font-black text-2xl text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>CREATE FOR FREE</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(TOOLS).map((tool) => (
              <Link href={tool.href} key={tool.id}>
                <div className="tool-card rounded-2xl p-5 border relative overflow-hidden"
                  style={{background: '#050505', borderColor: tool.border, boxShadow: `0 0 20px ${tool.glow}20`}}>

                  {/* Glow bg */}
                  <div className="absolute inset-0 opacity-5 rounded-2xl" style={{background: `linear-gradient(135deg, ${tool.glow}, transparent)`}} />

                  {/* Tag */}
                  <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded border font-black tracking-wider ${tool.tagColor}`}>
                    {tool.tag}
                  </span>

                  {/* Icon */}
                  <div className="text-4xl mb-3 float" style={{animationDelay: `${Math.random()}s`}}>{tool.icon}</div>

                  {/* Title */}
                  <h3 className="font-black text-sm tracking-wider mb-1 text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>{tool.title}</h3>
                  <p className="text-gray-500 text-xs font-bold mb-3">{tool.subtitle}</p>

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {tool.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-red-500 text-xs">▸</span>
                        <span className="text-gray-400 text-xs font-bold">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 font-bold">{tool.stats}</span>
                    <span className="text-xs font-black tracking-wider" style={{color: tool.glow.replace('rgba(', 'rgb(').replace(', 0.4)', ')')}}>USE →</span>
                  </div>

                  {/* Bottom gradient line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl" style={{background: `linear-gradient(90deg, transparent, ${tool.glow}, transparent)`}} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* DESIGNER STORE */}
        <div id="designer-store" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-black tracking-widest text-red-500/70 mb-1" style={{fontFamily: "'Orbitron', sans-serif"}}>// DESIGNER STORE</p>
              <h2 className="font-black text-2xl text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>PREMIUM TEMPLATES</h2>
            </div>
            <Link href="/studio/upload">
              <button className="flex items-center gap-2 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg font-black text-xs tracking-widest transition">
                + SELL YOUR DESIGN
              </button>
            </Link>
          </div>

          {/* Category Filter — DSA: HashMap O(1) */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg font-black text-xs tracking-widest transition border ${activeCategory === cat ? 'bg-red-600 border-red-500 text-white' : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-red-500/40 hover:text-gray-300'}`}
                style={activeCategory === cat ? {boxShadow: '0 0 10px rgba(239,68,68,0.4)'} : {}}>
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {filteredTemplates.map((template, i) => (
              <div key={i} className="template-card bg-gray-950 border border-gray-800 hover:border-red-500/40 rounded-xl overflow-hidden cursor-pointer">
                {/* Preview */}
                <div className="h-32 flex items-center justify-center text-5xl relative overflow-hidden"
                  style={{background: 'linear-gradient(135deg, #0a0a0a, #111)'}}>
                  {template.preview}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/60 flex items-center justify-center transition">
                    <span className="font-black text-xs tracking-widest text-white">PREVIEW</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-black text-xs text-white tracking-wide">{template.title}</p>
                    <span className={`font-black text-xs ${template.price === 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {template.price === 0 ? 'FREE' : `₹${template.price}`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-bold mb-2">by {template.designer} · {template.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 font-bold">⬇️ {template.downloads}</span>
                    <button className={`text-xs px-2 py-1 rounded font-black tracking-wider transition ${template.price === 0 ? 'bg-green-600/20 text-green-400 hover:bg-green-600/40' : 'bg-red-600/20 text-red-400 hover:bg-red-600/40'}`}>
                      {template.price === 0 ? 'USE FREE' : 'BUY'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP DESIGNERS — DSA: Priority Queue (sorted by rating) */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-black tracking-widest text-red-500/70 mb-1" style={{fontFamily: "'Orbitron', sans-serif"}}>// LEADERBOARD</p>
              <h2 className="font-black text-2xl text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>TOP DESIGNERS</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TOP_DESIGNERS.map((designer, i) => (
              <div key={i} className="designer-card bg-gray-950 border border-gray-800 hover:border-red-500/30 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-3 right-3 font-black text-2xl text-gray-800">#{i + 1}</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${designer.color} flex items-center justify-center font-black text-xl`}
                    style={{boxShadow: '0 0 15px rgba(239,68,68,0.3)'}}>
                    {designer.avatar}
                  </div>
                  <div>
                    <p className="font-black text-sm text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>{designer.name}</p>
                    <p className="text-xs text-gray-500 font-bold">{designer.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="font-black text-yellow-400">⭐ {designer.rating}</div>
                    <div className="text-xs text-gray-600 font-bold">RATING</div>
                  </div>
                  <div className="text-center">
                    <div className="font-black text-red-400">{designer.sales}</div>
                    <div className="text-xs text-gray-600 font-bold">SALES</div>
                  </div>
                  <button className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1.5 rounded-lg font-black text-xs tracking-widest transition">
                    VIEW →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BECOME A DESIGNER CTA */}
        <div className="rounded-2xl p-8 text-center relative overflow-hidden mb-8"
          style={{background: 'linear-gradient(135deg, #1a0000, #0a0010)', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 40px rgba(239,68,68,0.1)'}}>
          <div className="grid-bg absolute inset-0 opacity-30" />
          <div className="relative">
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="font-black text-2xl mb-2 text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>ARE YOU A DESIGNER?</h2>
            <p className="text-gray-400 font-bold mb-6 max-w-lg mx-auto">Upload your esports templates and earn money. Keep 80% of every sale. Join 50+ designers already earning on VINCI STUDIO.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/studio/upload">
                <button className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-black text-sm tracking-widest transition"
                  style={{boxShadow: '0 0 20px rgba(239,68,68,0.5)'}}>
                  🚀 START SELLING
                </button>
              </Link>
              <div className="flex items-center gap-6">
                {[['80%', 'YOU KEEP'], ['₹0', 'TO JOIN'], ['24H', 'APPROVAL']].map(([val, label]) => (
                  <div key={label} className="text-center">
                    <div className="font-black text-red-400" style={{fontFamily: "'Orbitron', sans-serif"}}>{val}</div>
                    <div className="text-xs text-gray-600 font-black tracking-wider">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}