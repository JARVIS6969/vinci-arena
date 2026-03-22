'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [time, setTime] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (!token) { router.push('/login'); return; }
    setUserName(name);
    fetchTournaments();
    setTime(new Date());
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, [router]);

  // Particle neural network background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

    const nodes = Array.from({length: 40}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      r: Math.random() * 1.5 + .5,
      c: ['#ff4444','#a78bfa','#22d3ee','#fbbf24'][Math.floor(Math.random() * 4)],
    }));

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.c + '55'; ctx.fill();
      });
      nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,68,68,${.04 * (1 - d / 120)})`; ctx.lineWidth = .5; ctx.stroke();
        }
      }));
      animRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/tournaments', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setTournaments(await res.json());
    } catch(e) {}
  };

  // Radar stats
  const stats = [
    {label:'GRAPHICS', val:.75, color:'#ff4444'},
    {label:'NETWORK',  val:.5,  color:'#a78bfa'},
    {label:'SQUADS',   val:.35, color:'#22d3ee'},
    {label:'PROFILE',  val:.6,  color:'#34d399'},
    {label:'MARKET',   val:.5,  color:'#fb923c'},
    {label:'TOURN.',   val:Math.min(Math.max(tournaments.length/10,.1),1), color:'#fbbf24'},
  ];
  const radar = (i, v, cx=90, cy=90, r=72) => {
    const a = (i / stats.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * r * v, y: cy + Math.sin(a) * r * v };
  };
  const radarPath = stats.map((s,i) => { const p = radar(i,s.val); return `${i===0?'M':'L'}${p.x},${p.y}`; }).join(' ') + 'Z';

  return (
    <div style={{fontFamily:"'Rajdhani',sans-serif",paddingTop:'104px',background:'#07070f',minHeight:'100vh',color:'#fff'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:linear-gradient(#ff4444,#a78bfa)}

        @keyframes scanMove{0%,100%{top:-2px;opacity:0}5%{opacity:.07}95%{opacity:.04}99%{top:100%}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes glitch{0%,88%,100%{clip-path:none;transform:none}89%{clip-path:polygon(0 10%,100% 10%,100% 30%,0 30%);transform:translateX(-3px)}91%{clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%);transform:translateX(3px)}93%{clip-path:none}}
        @keyframes holo{0%,100%{opacity:.9;transform:skewX(0)}35%{opacity:.65;transform:skewX(.7deg)}70%{opacity:.85;transform:skewX(-.4deg)}}
        @keyframes rgb{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(255,68,68,.3),inset 0 0 20px rgba(255,68,68,.05)}50%{box-shadow:0 0 40px rgba(255,68,68,.5),inset 0 0 30px rgba(255,68,68,.08)}}
        @keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes barIn{from{width:0}to{width:var(--w)}}
        @keyframes borderFlow{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes gridP{0%,100%{opacity:.05}50%{opacity:.09}}
        @keyframes countIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
        @keyframes neonTrace{0%{stroke-dashoffset:1000}100%{stroke-dashoffset:0}}

        .bg-g{background-image:linear-gradient(rgba(255,68,68,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,68,68,.055) 1px,transparent 1px);background-size:44px 44px;animation:gridP 5s ease infinite}
        .scan{position:absolute;left:0;right:0;height:1px;pointer-events:none;z-index:9;background:linear-gradient(90deg,transparent,rgba(255,68,68,.7),rgba(0,255,255,.5),transparent);animation:scanMove 8s linear infinite}
        .holo{animation:holo 5s ease-in-out infinite}
        .glitch{animation:glitch 8s infinite 2s}
        .rgb{animation:rgb 10s linear infinite}
        .float{animation:float 3.5s ease-in-out infinite}
        .fu{animation:fu .6s ease both}
        .blink{animation:blink 2s infinite}
        .ci{animation:countIn .4s ease both}
        .bar{animation:barIn 1.5s cubic-bezier(.16,1,.3,1) both}
        .neon-trace{stroke-dasharray:1000;animation:neonTrace 2s ease both}

        .c{position:absolute;width:14px;height:14px;border-style:solid;pointer-events:none;transition:all .3s}
        .tl{top:8px;left:8px;border-width:2px 0 0 2px}
        .tr{top:8px;right:8px;border-width:2px 2px 0 0}
        .bl{bottom:8px;left:8px;border-width:0 0 2px 2px}
        .br{bottom:8px;right:8px;border-width:0 2px 2px 0}

        /* MAIN CARDS */
        .mcard{
          position:relative;overflow:hidden;border-radius:20px;
          transition:all .4s cubic-bezier(.16,1,.3,1);
          transform-style:preserve-3d;
        }
        .mcard:hover{transform:translateY(-8px) scale(1.01)}
        .mcard::before{
          content:'';position:absolute;top:0;left:0;right:0;height:2px;
          background:linear-gradient(90deg,transparent,var(--ac),rgba(0,255,255,.6),transparent);
          background-size:200%;opacity:0;transition:opacity .3s;
          animation:borderFlow 3s linear infinite;
        }
        .mcard:hover::before{opacity:1}

        /* TAB BUTTONS */
        .tab-btn{
          font-family:'Orbitron',monospace;font-size:10px;font-weight:700;
          letter-spacing:2px;padding:8px 20px;border-radius:4px;cursor:pointer;
          transition:all .3s;border:1px solid transparent;
        }
        .tab-btn.active-studio{
          background:linear-gradient(135deg,rgba(255,68,68,.2),rgba(255,68,68,.1));
          border-color:rgba(255,68,68,.5);color:#ff4444;
          box-shadow:0 0 20px rgba(255,68,68,.3);
        }
        .tab-btn.active-esports{
          background:linear-gradient(135deg,rgba(167,139,250,.2),rgba(167,139,250,.1));
          border-color:rgba(167,139,250,.5);color:#a78bfa;
          box-shadow:0 0 20px rgba(167,139,250,.3);
        }
        .tab-btn:not(.active-studio):not(.active-esports){
          color:#4b5563;border-color:rgba(255,255,255,.08);background:rgba(255,255,255,.03);
        }
        .tab-btn:not(.active-studio):not(.active-esports):hover{color:#9ca3af;border-color:rgba(255,255,255,.15)}

        /* TOOL CARDS */
        .tool{
          border-radius:14px;padding:16px;cursor:pointer;
          transition:all .3s cubic-bezier(.16,1,.3,1);
          border:1px solid var(--tc);
          background:rgba(0,0,0,.4);
          position:relative;overflow:hidden;
        }
        .tool::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,var(--tg),transparent 70%);opacity:0;transition:opacity .3s}
        .tool:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 0 30px var(--tg)}
        .tool:hover::before{opacity:1}

        /* HUB ROWS */
        .hub-row{
          padding:14px 16px;border-radius:12px;cursor:pointer;
          transition:all .25s;border:1px solid rgba(255,255,255,.06);
          background:rgba(255,255,255,.03);display:flex;align-items:center;gap:14px;
        }
        .hub-row:hover{transform:translateX(6px);border-color:var(--hc);background:rgba(255,255,255,.05)}
        .hub-row:hover .hub-arrow{opacity:1;transform:translateX(4px)}
        .hub-arrow{opacity:0;transform:translateX(0);transition:all .2s}

        /* STAT NUMBERS */
        .stat-num{
          font-family:'Orbitron',monospace;font-weight:900;
          text-shadow:0 0 20px var(--sc);
        }

        /* SEARCH */
        .si input{
          background:rgba(255,255,255,.06);border:1px solid rgba(255,68,68,.2);
          border-radius:6px;color:#fff;font-family:'Rajdhani';font-weight:600;
          font-size:13px;padding:9px 16px 9px 38px;outline:none;transition:all .25s;width:360px;
        }
        .si input:focus{border-color:rgba(255,68,68,.6);box-shadow:0 0 25px rgba(255,68,68,.15);background:rgba(255,255,255,.08)}
        .si input::placeholder{color:#374151}

        /* TOURNAMENT ROWS */
        .trow{transition:all .2s;cursor:pointer;border-radius:10px}
        .trow:hover{transform:translateX(4px);background:rgba(251,191,36,.08)!important;border-color:rgba(251,191,36,.3)!important}
      `}</style>

      {/* CANVAS BG */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{zIndex:0,top:0,left:0,width:'100%',height:'100%'}}/>
      <div className="fixed inset-0 pointer-events-none bg-g" style={{zIndex:1}}/>
      <div className="fixed inset-0 pointer-events-none" style={{zIndex:2,background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px)'}}/>

      {/* TOPBAR */}
      <div className="sticky z-40 px-8 py-3 flex items-center justify-between"
        style={{top:'104px',background:'rgba(7,7,15,.97)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(255,68,68,.1)'}}>
        <div className="si relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">🔍</span>
          <input placeholder="Search tournaments, players, jobs..."
            onKeyDown={e=>{if(e.key==='Enter'&&e.target.value.trim()){
              const q=e.target.value.toLowerCase();
              if(q.includes('job')||q.includes('market'))router.push('/marketplace');
              else if(q.includes('squad'))router.push('/squads');
              else if(q.includes('chat'))router.push('/chat');
              else if(q.includes('studio'))router.push('/studio');
              else if(q.includes('profile'))router.push('/profile');
              else router.push('/tournaments/create');
            }}}/>
        </div>
        <div className="flex items-center gap-3">
          <div style={{background:'rgba(0,255,255,.07)',border:'1px solid rgba(0,255,255,.18)',borderRadius:'6px',padding:'6px 14px'}}>
            <span style={{fontFamily:"'Share Tech Mono',monospace",color:'#00ffff',fontSize:'13px',fontWeight:700}}>
              {time ? time.toLocaleTimeString('en-IN',{hour12:false}) : '--:--:--'}
            </span>
          </div>
          <div className="flex items-center gap-2" style={{background:'rgba(52,211,153,.07)',border:'1px solid rgba(52,211,153,.2)',borderRadius:'6px',padding:'6px 12px'}}>
            <span className="blink" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#34d399',boxShadow:'0 0 10px #34d399',display:'inline-block'}}/>
            <span style={{fontFamily:"'Orbitron',monospace",fontSize:'10px',color:'#34d399',fontWeight:700,letterSpacing:'2px'}}>ONLINE</span>
          </div>
        </div>
      </div>

      <div className="flex relative" style={{zIndex:3}}>

        {/* ── SIDEBAR ── */}
        <aside style={{width:'240px',flexShrink:0,position:'sticky',top:'152px',height:'calc(100vh - 152px)',overflowY:'auto',background:'rgba(7,7,15,.92)',backdropFilter:'blur(20px)',borderRight:'1px solid rgba(255,68,68,.1)',display:'flex',flexDirection:'column'}}>

          {/* Player hologram */}
          <div className="holo" style={{margin:'16px 12px',padding:'16px',borderRadius:'16px',position:'relative',overflow:'hidden',background:'linear-gradient(135deg,#1a0808,#0d0018,#081018)',border:'1px solid rgba(255,68,68,.4)'}}>
            <div className="scan"/>
            <div className="c tl" style={{borderColor:'#ff4444'}}/><div className="c tr" style={{borderColor:'#22d3ee'}}/>
            <div className="c bl" style={{borderColor:'#a78bfa'}}/><div className="c br" style={{borderColor:'#34d399'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,transparent 25%,rgba(255,255,255,.04) 50%,transparent 75%)',borderRadius:'16px',pointerEvents:'none'}}/>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'14px'}}>
              <div className="rgb" style={{width:'48px',height:'48px',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'20px',flexShrink:0,background:'linear-gradient(135deg,#ff4444,#a78bfa)',boxShadow:'0 0 25px rgba(255,68,68,.6)'}}>
                {userName?.[0]?.toUpperCase()||'P'}
              </div>
              <div>
                <p className="glitch" style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'12px',color:'#fff',letterSpacing:'1px'}}>
                  {userName?.toUpperCase()||'PLAYER'}
                </p>
                <p style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',color:'#ff4444',marginTop:'2px'}}>▲ ROOKIE · LVL 01</p>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
              <span style={{fontSize:'8px',fontFamily:"'Orbitron',monospace",color:'#4b5563',fontWeight:900}}>POWER LEVEL</span>
              <span style={{fontSize:'9px',fontFamily:"'Share Tech Mono',monospace",color:'#ff4444'}}>24%</span>
            </div>
            <div style={{height:'6px',borderRadius:'99px',overflow:'hidden',background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,68,68,.15)'}}>
              <div className="bar" style={{'--w':'24%',width:'24%',height:'100%',borderRadius:'99px',background:'linear-gradient(90deg,#ff4444,#f97316,#fbbf24)',boxShadow:'0 0 12px rgba(255,68,68,.8)'}}/>
            </div>
          </div>

          {/* Radar chart */}
          <div style={{margin:'0 12px 12px',padding:'12px',borderRadius:'14px',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
            <p style={{fontSize:'8px',fontFamily:"'Orbitron',monospace",color:'#374151',fontWeight:900,letterSpacing:'3px',marginBottom:'8px',textAlign:'center'}}>//  PLAYER RADAR</p>
            <svg width="180" height="180" viewBox="0 0 180 180" style={{display:'block',margin:'0 auto'}}>
              {[.25,.5,.75,1].map((r,i)=>(
                <polygon key={i} points={stats.map((_,j)=>{const p=radar(j,r,90,90,72);return `${p.x},${p.y}`;}).join(' ')} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth=".6"/>
              ))}
              {stats.map((_,i)=>{const p=radar(i,1,90,90,72);return <line key={i} x1="90" y1="90" x2={p.x} y2={p.y} stroke="rgba(255,255,255,.06)" strokeWidth=".6"/>;
              })}
              <path d={radarPath} fill="rgba(255,68,68,.18)" stroke="#ff4444" strokeWidth="1.5" className="neon-trace" style={{filter:'drop-shadow(0 0 8px rgba(255,68,68,.6))'}}/>
              {stats.map((s,i)=>{const p=radar(i,s.val,90,90,72);return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={s.color} style={{filter:`drop-shadow(0 0 5px ${s.color})`}}/>;
              })}
              {stats.map((s,i)=>{const p=radar(i,1.22,90,90,72);return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill={s.color} fontSize="7" fontFamily="Orbitron,monospace" fontWeight="700">{s.label}</text>;
              })}
            </svg>
          </div>

          {/* Quick stats */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',margin:'0 12px 12px'}}>
            {[{v:tournaments.length,l:'TOURNAMENTS',c:'#fbbf24'},{v:'40',l:'TEMPLATES',c:'#ff4444'},{v:'3',l:'GAMES',c:'#22d3ee'},{v:'IND',l:'REGION',c:'#34d399'}].map((s,i)=>(
              <div key={i} className="ci" style={{animationDelay:`${i*80}ms`,padding:'10px',borderRadius:'10px',textAlign:'center',background:'rgba(255,255,255,.04)',border:`1px solid ${s.c}20`}}>
                <div className="stat-num" style={{'--sc':s.c,color:s.c,fontSize:'20px'}}>{s.v}</div>
                <div style={{fontSize:'7px',fontFamily:"'Orbitron',monospace",color:'#374151',fontWeight:900,letterSpacing:'.5px',marginTop:'2px'}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Activity bars */}
          <div style={{margin:'0 12px',padding:'12px',borderRadius:'12px',background:'rgba(255,255,255,.02)',border:'1px solid rgba(255,255,255,.05)',flex:1}}>
            <p style={{fontSize:'8px',fontFamily:"'Orbitron',monospace",color:'#374151',fontWeight:900,letterSpacing:'3px',marginBottom:'10px'}}>//  ACTIVITY</p>
            {[{l:'GRAPHICS',v:70,c:'#ff4444'},{l:'PROFILE',v:60,c:'#34d399'},{l:'MARKET',v:50,c:'#a78bfa'},{l:'CHAT',v:40,c:'#fb923c'},{l:'SQUADS',v:30,c:'#22d3ee'}].map((b,i)=>(
              <div key={i} style={{marginBottom:'10px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                  <span style={{fontSize:'9px',fontFamily:"'Share Tech Mono',monospace",color:b.c,fontWeight:700}}>{b.l}</span>
                  <span style={{fontSize:'9px',fontFamily:"'Share Tech Mono',monospace",color:'#374151'}}>{b.v}%</span>
                </div>
                <div style={{height:'3px',borderRadius:'99px',overflow:'hidden',background:'rgba(255,255,255,.06)'}}>
                  <div className="bar" style={{animationDelay:`${i*120}ms`,'--w':`${b.v}%`,width:`${b.v}%`,height:'100%',borderRadius:'99px',background:b.c,boxShadow:`0 0 8px ${b.c}`}}/>
                </div>
              </div>
            ))}
          </div>

          <div style={{height:'16px'}}/>
        </aside>

        {/* ── MAIN ── */}
        <main style={{flex:1,padding:'20px',display:'flex',flexDirection:'column',gap:'16px',minWidth:0}}>

          {/* HERO GREETING */}
          <div className="mcard fu" style={{'--ac':'#ff4444',background:'linear-gradient(135deg,#180808,#0c0018,#001018)',border:'1px solid rgba(255,68,68,.35)',boxShadow:'0 0 60px rgba(255,68,68,.12)'}}>
            <div className="scan"/>
            <div className="c tl" style={{borderColor:'#ff4444'}}/><div className="c tr" style={{borderColor:'#22d3ee'}}/>
            <div className="c bl" style={{borderColor:'#a78bfa'}}/><div className="c br" style={{borderColor:'#34d399'}}/>
            <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(ellipse 55% 70% at 80% 50%,rgba(255,68,68,.1),transparent),radial-gradient(ellipse 35% 60% at 20% 50%,rgba(0,255,255,.06),transparent)',pointerEvents:'none'}}/>
            <div style={{position:'relative',padding:'24px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'20px'}}>
              <div>
                <p style={{fontSize:'9px',fontFamily:"'Orbitron',monospace",color:'#374151',fontWeight:900,letterSpacing:'3px',marginBottom:'6px'}}>// COMMAND CENTER ACTIVE</p>
                <h1 className="glitch" style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'32px',lineHeight:1,marginBottom:'8px'}}>
                  <span style={{background:'linear-gradient(90deg,#ff4444,#f97316,#fbbf24,#ffffff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',filter:'drop-shadow(0 0 30px rgba(255,68,68,.6))'}}>
                    {userName?.toUpperCase()||'PLAYER'}
                  </span>
                </h1>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  {[{v:tournaments.length,l:'TOURNAMENTS',c:'#fbbf24'},{v:'40',l:'TEMPLATES',c:'#ff4444'},{v:'3',l:'GAMES',c:'#22d3ee'}].map((s,i)=>(
                    <div key={i} className="ci" style={{animationDelay:`${i*80}ms`,padding:'6px 14px',borderRadius:'8px',background:'rgba(255,255,255,.05)',border:`1px solid ${s.c}25`}}>
                      <span className="stat-num" style={{'--sc':s.c,color:s.c,fontSize:'22px',marginRight:'6px'}}>{s.v}</span>
                      <span style={{fontSize:'9px',fontFamily:"'Orbitron',monospace",color:'#4b5563',fontWeight:900}}>{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                {['🔥','⚡','🎯'].map((e,i)=>(
                  <div key={i} className="float" style={{animationDelay:`${i*.5}s`,width:'48px',height:'48px',borderRadius:'14px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)'}}>
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TAB SWITCHER */}
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            
            <button className={`tab-btn ${activeTab==='studio'?'active-studio':''}`} onClick={()=>setActiveTab('studio')}>
              🎨 VINCI STUDIO FOR  DESIGN. EXPORT. MANAGEMENT
            </button>
            <button className={`tab-btn ${activeTab==='esports'?'active-esports':''}`} onClick={()=>setActiveTab('esports')}>
              🌐 ESPORTS HUB FOR  MARKETPLACE.COMMUNITIES .PROFILE
            </button>
            
          </div>

          {/* VINCI STUDIO TAB */}
          {activeTab === 'studio' && (
            <div className="mcard fu" style={{'--ac':'#ff4444',background:'linear-gradient(135deg,#1c0505,#100015,#001015)',border:'1px solid rgba(255,68,68,.4)',boxShadow:'0 0 70px rgba(255,68,68,.18)'}}>
              <div className="scan"/>
              <div className="c tl" style={{borderColor:'#ff4444'}}/><div className="c tr" style={{borderColor:'#ff4444'}}/>
              <div className="c bl" style={{borderColor:'rgba(255,68,68,.4)'}}/><div className="c br" style={{borderColor:'rgba(255,68,68,.4)'}}/>
              <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(ellipse 50% 80% at 90% 40%,rgba(255,68,68,.12),transparent),radial-gradient(ellipse 30% 50% at 10% 60%,rgba(139,92,246,.07),transparent)',pointerEvents:'none'}}/>
              <div style={{position:'relative',padding:'28px'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'32px'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
                      <span className="blink" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#ff4444',boxShadow:'0 0 10px #ff4444',flexShrink:0}}/>
                      <span style={{fontSize:'10px',fontFamily:"'Orbitron',monospace",color:'#ff4444',fontWeight:900,letterSpacing:'3px'}}>CREATIVE SUITE</span>
                      <span style={{fontSize:'8px',fontFamily:"'Orbitron',monospace",background:'rgba(52,211,153,.12)',color:'#34d399',border:'1px solid rgba(52,211,153,.25)',padding:'3px 10px',borderRadius:'4px',marginLeft:'auto'}}>● LIVE</span>
                    </div>
                    <h2 style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'36px',marginBottom:'12px',background:'linear-gradient(90deg,#ff4444,#f97316,#fbbf24)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',filter:'drop-shadow(0 0 30px rgba(255,68,68,.6))'}}>
                      VINCI STUDIO
                    </h2>
                    <p style={{color:'rgba(255,255,255,.6)',fontSize:'14px',fontWeight:600,marginBottom:'20px',lineHeight:'1.7',maxWidth:'480px'}}>
                      All-in-one esports graphic creation suite. Build point tables, certificates, banners and MVP cards with 40 professional templates.
                    </p>
                    {/* Feature tags */}
                    <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'24px'}}>
                      {['📊 Point Tables','🏆 Certificates','🎨 Banners','⚡ MVP Cards','40 Templates','PNG Export'].map(t=>(
                        <span key={t} style={{fontSize:'11px',fontWeight:700,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.7)',padding:'4px 12px',borderRadius:'4px'}}>{t}</span>
                      ))}
                    </div>
                    <button onClick={()=>router.push('/studio')} style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#ff4444,#dc2626)',color:'#fff',fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'11px',letterSpacing:'2px',padding:'12px 28px',borderRadius:'10px',border:'none',cursor:'pointer',boxShadow:'0 0 35px rgba(255,68,68,.7)'}}>
                      🎨 OPEN VINCI STUDIO →
                    </button>
                  </div>

                  {/* Tool cards */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',flexShrink:0}}>
                    {[
                      {icon:'📊',label:'POINT TABLE',sub:'40 templates',color:'#ff4444',href:'/tournaments/create'},
                      {icon:'🏆',label:'CERTIFICATE',sub:'6 styles',color:'#fbbf24',href:'/studio/certificate'},
                      {icon:'🎨',label:'BANNER',sub:'Coming soon',color:'#a78bfa',href:'/studio'},
                      {icon:'⚡',label:'MVP CARD',sub:'Coming soon',color:'#22d3ee',href:'/studio'},
                    ].map(t=>(
                      <div key={t.label} className="tool" style={{'--tc':`${t.color}30`,'--tg':`${t.color}20`,width:'140px'}} onClick={()=>router.push(t.href)}>
                        <div style={{fontSize:'28px',marginBottom:'8px'}}>{t.icon}</div>
                        <div style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'9px',color:t.color,letterSpacing:'1px',marginBottom:'4px'}}>{t.label}</div>
                        <div style={{fontSize:'10px',color:'#4b5563',fontWeight:700}}>{t.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ESPORTS HUB TAB */}
          {(activeTab === 'esports' || activeTab === null) && (
            <div className="mcard fu" style={{'--ac':'#a78bfa',background:'linear-gradient(135deg,#0c0820,#070015,#050818)',border:'1px solid rgba(167,139,250,.4)',boxShadow:'0 0 70px rgba(167,139,250,.18)'}}>
              <div className="scan"/>
              <div className="c tl" style={{borderColor:'#a78bfa'}}/><div className="c tr" style={{borderColor:'#22d3ee'}}/>
              <div className="c bl" style={{borderColor:'rgba(167,139,250,.4)'}}/><div className="c br" style={{borderColor:'rgba(167,139,250,.4)'}}/>
              <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(ellipse 60% 70% at 90% 30%,rgba(167,139,250,.12),transparent)',pointerEvents:'none'}}/>
              <div style={{position:'relative',padding:'28px'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'32px'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
                      <span className="blink" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#a78bfa',boxShadow:'0 0 10px #a78bfa',flexShrink:0}}/>
                      <span style={{fontSize:'10px',fontFamily:"'Orbitron',monospace",color:'#a78bfa',fontWeight:900,letterSpacing:'3px'}}>ESPORTS ECOSYSTEM</span>
                    </div>
                    <h2 style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'36px',marginBottom:'12px',color:'#fff',textShadow:'0 0 30px rgba(167,139,250,.5)'}}>
                      ESPORTS HUB
                    </h2>
                    <p style={{color:'rgba(255,255,255,.6)',fontSize:'14px',fontWeight:600,marginBottom:'24px',lineHeight:'1.7',maxWidth:'480px'}}>
                      India's first grassroots esports platform. Find teams, hire coaches, build your career and connect with the community.
                    </p>
                    <button onClick={()=>router.push('/esports')} style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#7c3aed,#6d28d9)',color:'#fff',fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'11px',letterSpacing:'2px',padding:'12px 28px',borderRadius:'10px',border:'none',cursor:'pointer',boxShadow:'0 0 35px rgba(167,139,250,.6)'}}>
                      🚀 EXPLORE ESPORTS HUB →
                    </button>
                  </div>

                  {/* Hub feature rows */}
                  <div style={{display:'flex',flexDirection:'column',gap:'10px',minWidth:'280px'}}>
                    {[
                      {icon:'💼',label:'MARKETPLACE',sub:'Find jobs & hire talent',color:'#a78bfa',href:'/marketplace',live:true},
                      {icon:'👥',label:'SQUADS',sub:'Create & manage teams',color:'#22d3ee',href:'/squads',live:true},
                      {icon:'👤',label:'PROFILES',sub:'Build your portfolio',color:'#34d399',href:'/profile',live:true},
                      {icon:'🏆',label:'RANKINGS',sub:'Global leaderboards',color:'#818cf8',href:'#',live:false},
                    ].map(h=>(
                      <div key={h.label} className="hub-row" style={{'--hc':h.color}} onClick={()=>router.push(h.href)}>
                        <div style={{width:'40px',height:'40px',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0,background:h.color+'18',border:`1px solid ${h.color}30`}}>
                          {h.icon}
                        </div>
                        <div style={{flex:1}}>
                          <p style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'10px',color:h.color,marginBottom:'2px'}}>{h.label}</p>
                          <p style={{fontSize:'11px',color:'#4b5563',fontWeight:700}}>{h.sub}</p>
                        </div>
                        <span style={{fontSize:'9px',fontFamily:"'Orbitron',monospace",fontWeight:900,padding:'3px 8px',borderRadius:'4px',background:h.live?'rgba(52,211,153,.12)':'rgba(251,191,36,.1)',color:h.live?'#34d399':'#fbbf24',border:`1px solid ${h.live?'rgba(52,211,153,.25)':'rgba(251,191,36,.2)'}`}}>
                          {h.live?'LIVE':'SOON'}
                        </span>
                        <span className="hub-arrow" style={{color:'#4b5563',fontSize:'16px'}}>›</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOURNAMENTS TAB */}
          {activeTab === 'tournaments' && (
            <div className="mcard fu" style={{'--ac':'#fbbf24',background:'linear-gradient(135deg,#151000,#080010,#001510)',border:'1px solid rgba(251,191,36,.35)',boxShadow:'0 0 60px rgba(251,191,36,.12)'}}>
              <div className="scan"/>
              <div className="c tl" style={{borderColor:'#fbbf24'}}/><div className="c tr" style={{borderColor:'#fbbf24'}}/>
              <div style={{position:'relative',padding:'28px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <span className="blink" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#fbbf24',boxShadow:'0 0 10px #fbbf24',flexShrink:0}}/>
                    <div>
                      <p style={{fontSize:'9px',fontFamily:"'Orbitron',monospace",color:'#fbbf24',fontWeight:900,letterSpacing:'3px'}}>POINT TABLES</p>
                      <h2 style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'28px',color:'#fff',textShadow:'0 0 20px rgba(251,191,36,.5)'}}>TOURNAMENTS</h2>
                    </div>
                  </div>
                  <Link href="/tournaments/create">
                    <button style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'10px',letterSpacing:'2px',padding:'10px 20px',borderRadius:'8px',background:'linear-gradient(135deg,#fbbf24,#f59e0b)',color:'#000',border:'none',cursor:'pointer',boxShadow:'0 0 20px rgba(251,191,36,.5)'}}>
                      + NEW TOURNAMENT
                    </button>
                  </Link>
                </div>
                {/* Stats row */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'20px'}}>
                  {[{v:tournaments.length,l:'TOTAL',c:'#fbbf24'},{v:'40',l:'TEMPLATES',c:'#ff4444'},{v:'3',l:'GAMES',c:'#22d3ee'}].map((s,i)=>(
                    <div key={i} style={{textAlign:'center',padding:'16px',borderRadius:'12px',background:'rgba(255,255,255,.05)',border:`1px solid ${s.c}20`}}>
                      <div className="stat-num" style={{'--sc':s.c,color:s.c,fontSize:'28px'}}>{s.v}</div>
                      <div style={{fontSize:'8px',fontFamily:"'Orbitron',monospace",color:'#374151',fontWeight:900,marginTop:'4px'}}>{s.l}</div>
                    </div>
                  ))}
                </div>
                {/* Tournament list */}
                <div style={{display:'flex',flexDirection:'column',gap:'6px',maxHeight:'280px',overflowY:'auto'}}>
                  {tournaments.length === 0 ? (
                    <div style={{textAlign:'center',padding:'40px',border:'1px dashed rgba(251,191,36,.15)',borderRadius:'12px'}}>
                      <p style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'11px',color:'#374151',letterSpacing:'2px'}}>NO TOURNAMENTS YET</p>
                      <p style={{fontSize:'12px',color:'#1f2937',marginTop:'6px',fontWeight:700}}>Create your first one above ↑</p>
                    </div>
                  ) : tournaments.map((t,i)=>(
                    <Link href={`/tournaments/${t.id}`} key={t.id}>
                      <div className="trow" style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(251,191,36,.12)'}}>
                        <div style={{width:'28px',height:'28px',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'11px',flexShrink:0,background:'rgba(251,191,36,.15)',color:'#fbbf24'}}>
                          {String(i+1).padStart(2,'0')}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontWeight:900,fontSize:'13px',color:'#fff',marginBottom:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.name}</p>
                          <p style={{fontSize:'11px',color:'#4b5563',fontWeight:700}}>{t.game} · {new Date(t.created_at).toLocaleDateString()}</p>
                        </div>
                        <span style={{color:'#374151',fontSize:'16px'}}>›</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}