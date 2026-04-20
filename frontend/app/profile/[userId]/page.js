'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import GameStatsDisplay from '@/app/components/GameStatsDisplay';

const GAME_CONFIG = {
  'Free Fire': { icon: '🔥', color: '#ef4444', glow: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  'BGMI':      { icon: '🎯', color: '#f97316', glow: 'rgba(249,115,22,0.4)', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
  'Valorant':  { icon: '⚡', color: '#6366f1', glow: 'rgba(99,102,241,0.4)', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
};
const LF_COLOR = { Team:'#ef4444', Players:'#f97316', Scrims:'#6366f1', Tournament:'#eab308', 'Just Showcasing':'#10b981' };
const NEON = ['#ef4444','#f97316','#fbbf24','#10b981','#00ffff','#6366f1','#a78bfa','#ec4899'];

// ── Particle Banner ──
function BannerParticles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const stars = Array.from({length:120}, () => ({
      x:Math.random()*c.width, y:Math.random()*c.height,
      r:Math.random()*1.5+0.3, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.2,
      col:NEON[Math.floor(Math.random()*NEON.length)],
      bp:Math.random()*Math.PI*2, br:0.02+Math.random()*0.04,
    }));
    let frame=0, id;
    const loop = () => {
      id=requestAnimationFrame(loop); frame++;
      ctx.clearRect(0,0,c.width,c.height);
      stars.forEach(s => {
        s.x+=s.vx; s.y+=s.vy;
        if(s.x<0)s.x=c.width; if(s.x>c.width)s.x=0;
        if(s.y<0)s.y=c.height; if(s.y>c.height)s.y=0;
        const op=0.3+0.7*Math.abs(Math.sin(frame*s.br+s.bp));
        const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*4);
        g.addColorStop(0,s.col+'cc'); g.addColorStop(1,s.col+'00');
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r*4,0,Math.PI*2);
        ctx.fillStyle=g; ctx.globalAlpha=op*0.4; ctx.fill();
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=s.col; ctx.globalAlpha=op; ctx.fill();
        ctx.globalAlpha=1;
      });
      stars.forEach((a,i)=>stars.slice(i+1).forEach(b=>{
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<80){
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=a.col; ctx.globalAlpha=(1-d/80)*0.12;
          ctx.lineWidth=0.5; ctx.stroke(); ctx.globalAlpha=1;
        }
      }));
    };
    loop();
    return ()=>cancelAnimationFrame(id);
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}/>;
}

// ── Rotating Neon Ring Avatar ──
function NeonAvatar({name,avatarUrl,size=110}) {
  const [rot,setRot]=useState(0);
  useEffect(()=>{
    let id; const tick=()=>{setRot(r=>(r+0.5)%360);id=requestAnimationFrame(tick);};
    id=requestAnimationFrame(tick); return()=>cancelAnimationFrame(id);
  },[]);
  const colors=['#ef4444','#f97316','#fbbf24','#10b981','#00ffff','#6366f1','#a78bfa','#ec4899'];
  const idx=Math.floor(rot/45)%colors.length;
  const c1=colors[idx],c2=colors[(idx+1)%colors.length],c3=colors[(idx+2)%colors.length];
  return (
    <div style={{position:'relative',width:`${size+12}px`,height:`${size+12}px`,flexShrink:0}}>
      <div style={{position:'absolute',inset:0,borderRadius:'22px',background:`conic-gradient(from ${rot}deg,${c1},${c2},${c3},${c1})`,filter:`blur(2px) drop-shadow(0 0 8px ${c1})`}}/>
      <div style={{position:'absolute',inset:'3px',borderRadius:'19px',overflow:'hidden',background:'linear-gradient(135deg,#ef4444,#7c3aed)',boxShadow:'inset 0 0 20px rgba(0,0,0,0.5)'}}>
        {avatarUrl?<img src={avatarUrl} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:
        <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:`${size*0.4}px`,color:'#fff',textShadow:'0 0 20px rgba(255,255,255,0.5)'}}>
          {name?.[0]?.toUpperCase()||'?'}
        </div>}
      </div>
    </div>
  );
}

// ── 3D Tilt Card ──
function TiltCard({children, accentColor='#ef4444', style={}}) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({x:0,y:0,gx:50,gy:50});
  const [hov, setHov] = useState(false);
  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -20;
    const gx = ((e.clientX - r.left) / r.width) * 100;
    const gy = ((e.clientY - r.top) / r.height) * 100;
    setTilt({x,y,gx,gy});
  };
  return (
    <div ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>{setHov(false);setTilt({x:0,y:0,gx:50,gy:50});}}
      style={{
        transform: hov?`perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.02)`:'perspective(800px) rotateX(0) rotateY(0) scale(1)',
        transition: hov?'transform .1s':'transform .5s cubic-bezier(.16,1,.3,1)',
        position:'relative',overflow:'hidden',borderRadius:'20px',
        background:'#050505',
        border:`1px solid ${hov?accentColor:accentColor+'40'}`,
        boxShadow: hov?`0 20px 60px ${accentColor}25, 0 0 30px ${accentColor}15`:'none',
        ...style
      }}>
      {hov && <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:1,background:`radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.08) 0%, transparent 60%)`}}/>}
      <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:`linear-gradient(90deg,transparent,${accentColor},transparent)`,opacity:hov?1:0,transition:'opacity .3s',zIndex:2}}/>
      {children}
    </div>
  );
}

// ── Animated Skill Bar ──
function SkillBar({label, value, max, color, suffix='', delay=0}) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  useEffect(()=>{
    const observer = new IntersectionObserver(([e])=>{
      if(e.isIntersecting) setTimeout(()=>setWidth(Math.min((parseFloat(value)||0)/max*100,100)),delay);
    },{threshold:0.3});
    if(ref.current) observer.observe(ref.current);
    return ()=>observer.disconnect();
  },[value,max,delay]);
  return (
    <div ref={ref} style={{marginBottom:'12px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'5px'}}>
        <span style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,color:'rgba(255,255,255,0.5)',letterSpacing:'2px'}}>{label}</span>
        <span style={{fontFamily:"'Orbitron',monospace",fontSize:'11px',fontWeight:900,color,textShadow:`0 0 8px ${color}`}}>{value}{suffix}</span>
      </div>
      <div style={{height:'6px',borderRadius:'99px',background:'rgba(255,255,255,0.06)',overflow:'hidden',position:'relative'}}>
        <div style={{height:'100%',borderRadius:'99px',width:`${width}%`,background:`linear-gradient(90deg,${color}80,${color})`,boxShadow:`0 0 10px ${color}`,transition:`width 1.2s cubic-bezier(.16,1,.3,1) ${delay}ms`,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)',animation:'shimmer 2s infinite',backgroundSize:'200% 100%'}}/>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:'2px'}}>
        <span style={{fontSize:'8px',color:'#374151',fontFamily:"'Orbitron',monospace"}}>0</span>
        <span style={{fontSize:'8px',color:'#374151',fontFamily:"'Orbitron',monospace"}}>{max}{suffix}</span>
      </div>
    </div>
  );
}

// ── Floating Emoji Reactions ──
function FloatingReactions() {
  const [reactions, setReactions] = useState([]);
  const emojis = ['🔥','⚡','💀','🏆','🎯','👑','💥','🎮','⭐','🚀'];
  const addReaction = () => {
    const id = Date.now();
    const emoji = emojis[Math.floor(Math.random()*emojis.length)];
    const x = 20 + Math.random()*60;
    setReactions(r=>[...r,{id,emoji,x}]);
    setTimeout(()=>setReactions(r=>r.filter(rx=>rx.id!==id)),2000);
  };
  return (
    <div style={{position:'relative',display:'inline-block'}}>
      <button onClick={addReaction}
        style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,padding:'6px 14px',borderRadius:'8px',background:'rgba(251,191,36,0.1)',border:'1px solid rgba(251,191,36,0.3)',color:'#fbbf24',cursor:'pointer',letterSpacing:'1px',transition:'all .2s'}}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(251,191,36,0.2)'}
        onMouseLeave={e=>e.currentTarget.style.background='rgba(251,191,36,0.1)'}>
        🎉 REACT
      </button>
      {reactions.map(r=>(
        <div key={r.id} style={{position:'absolute',bottom:'100%',left:`${r.x}%`,fontSize:'20px',animation:'floatUp 2s ease forwards',pointerEvents:'none',zIndex:50}}>{r.emoji}</div>
      ))}
    </div>
  );
}

// ── Glow Card ──
function GlowCard({children,accentColor='#ef4444',delay='0ms',style={}}) {
  const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{padding:'16px',borderRadius:'16px',background:'#050505',
        border:`1px solid ${hov?accentColor:accentColor+'30'}`,
        boxShadow:hov?`0 0 30px ${accentColor}25,inset 0 0 15px ${accentColor}05`:'none',
        transform:hov?'translateY(-3px)':'translateY(0)',
        transition:'all .3s cubic-bezier(.16,1,.3,1)',
        position:'relative',overflow:'hidden',animationDelay:delay,...style}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:`linear-gradient(90deg,transparent,${accentColor},transparent)`,opacity:hov?1:0,transition:'opacity .3s'}}/>
      {children}
    </div>
  );
}

// ── NEW: Squad Profile Card ──
function SquadCard({ squad, onView }) {
  const [hov, setHov] = useState(false);
  if (!squad) return null;

  const gameColor = GAME_CONFIG[squad.game]?.color || '#a855f7';
  const gameIcon  = GAME_CONFIG[squad.game]?.icon  || '🎮';
  const activeMembers = squad.squad_members?.filter(m => m.is_active) || [];
  const winRate = squad.total_tournaments > 0
    ? Math.round((squad.total_wins / squad.total_tournaments) * 100)
    : 0;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '14px',
        borderRadius: '16px',
        background: '#050505',
        border: `1px solid ${hov ? '#a855f7' : 'rgba(168,85,247,0.3)'}`,
        boxShadow: hov ? '0 0 30px rgba(168,85,247,0.2), inset 0 0 15px rgba(168,85,247,0.04)' : 'none',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all .3s cubic-bezier(.16,1,.3,1)',
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={onView}
    >
      {/* Top rainbow line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: 'linear-gradient(90deg,#a855f7,#00ffff,#ef4444)', opacity: hov ? 1 : 0.5, transition: 'opacity .3s' }} />
      {/* Corner brackets */}
      <div style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderTop: '1.5px solid rgba(168,85,247,0.6)', borderLeft: '1.5px solid rgba(168,85,247,0.6)' }} />
      <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderTop: '1.5px solid rgba(168,85,247,0.6)', borderRight: '1.5px solid rgba(168,85,247,0.6)' }} />

      {/* Header label */}
      <p style={{ fontFamily: "'Orbitron',monospace", fontSize: '9px', fontWeight: 900, color: 'rgba(168,85,247,0.65)', letterSpacing: '3px', marginBottom: '10px' }}>// SQUAD</p>

      {/* Squad identity row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(239,68,68,0.15))',
          border: '1.5px solid rgba(168,85,247,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Orbitron',monospace", fontSize: 13, fontWeight: 900, color: '#a855f7',
        }}>
          {(squad.tag || squad.name || '?').slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 13, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {squad.name}
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: gameColor + '18', color: gameColor, border: `1px solid ${gameColor}40`, fontFamily: "'Share Tech Mono',monospace" }}>
              {gameIcon} {squad.game}
            </span>
            {squad.region && (
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)', fontFamily: "'Share Tech Mono',monospace" }}>
                {squad.region}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats mini row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
        {[
          { val: squad.elo_rating || '—', lbl: 'ELO',  color: '#ef4444' },
          { val: squad.total_wins || 0,   lbl: 'Wins',  color: '#00ff88' },
          { val: `${winRate}%`,            lbl: 'W-Rate',color: '#fbbf24' },
        ].map(s => (
          <div key={s.lbl} style={{ background: 'rgba(255,255,255,0.025)', borderRadius: 8, padding: '6px 4px', textAlign: 'center', border: '1px solid rgba(168,85,247,0.08)' }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 13, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 9, color: '#475569', fontFamily: "'Share Tech Mono',monospace", marginTop: 2, letterSpacing: 0.5 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Members avatars row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {activeMembers.slice(0, 5).map((m, i) => (
            <div key={m.id || i} style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Orbitron',monospace", fontSize: 9, fontWeight: 900, color: '#a855f7',
            }}>
              {(m.users?.name || m.in_game_name || '?').slice(0, 1).toUpperCase()}
            </div>
          ))}
          {activeMembers.length > 5 && (
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#475569' }}>
              +{activeMembers.length - 5}
            </div>
          )}
          <div style={{ fontSize: 10, color: '#475569', fontFamily: "'Share Tech Mono',monospace", marginLeft: 4, alignSelf: 'center' }}>
            {activeMembers.length}/7
          </div>
        </div>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, color: '#a855f7', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
          View Squad <span style={{ fontSize: 11 }}>→</span>
        </div>
      </div>
    </div>
  );
}

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [profile,setProfile]=useState(null);
  const [games,setGames]=useState([]);
  const [allStats,setAllStats]=useState([]);
  const [activeGame,setActiveGame]=useState(null);
  const [loading,setLoading]=useState(true);
  const [notFound,setNotFound]=useState(false);
  const [currentUserId,setCurrentUserId]=useState('');
  const [messaging,setMessaging]=useState(false);
  const [ffUid,setFfUid]=useState('');
  const [ffStats,setFfStats]=useState(null);
  const [ffLoading,setFfLoading]=useState(false);
  const [ffError,setFfError]=useState('');
  const [ffMode,setFfMode]=useState('br');
  const [ffInputMode,setFfInputMode]=useState(null);
  const [ocrLoading,setOcrLoading]=useState(false);
  // ── NEW: squad state ──
  const [userSquad, setUserSquad] = useState(null);

  useEffect(()=>{setCurrentUserId(localStorage.getItem('userId')||'');fetchAll();},[params.userId]);

  const fetchAll=async()=>{
    try{
      const token=localStorage.getItem('token');
      const h={Authorization:`Bearer ${token}`};
      const [pR,gR,sR]=await Promise.all([
        fetch(`http://localhost:3001/api/profiles/user/${params.userId}`,{headers:h}),
        fetch(`http://localhost:3001/api/profiles/user/${params.userId}/games`,{headers:h}),
        fetch(`http://localhost:3001/api/profiles/user/${params.userId}/stats`,{headers:h}),
      ]);
      if(!pR.ok && pR.status !== 404){setNotFound(true);return;}
      const [p,g,s]=await Promise.all([pR.json(),gR.json(),sR.json()]);
      setProfile(p);setGames(g||[]);setAllStats(s||[]);
      if(g?.length>0)setActiveGame(g[0].game);

      // ── NEW: fetch this user's squad ──
      try {
        const squadsRes = await fetch(`http://localhost:3001/api/squads/user/${params.userId}`, { headers: h });
        if (squadsRes.ok) {
          const squadsData = await squadsRes.json();
          // find the squad where this user is an active member
          setUserSquad(squadsData || null);
        }
      } catch { /* squad fetch failed silently — not critical */ }

    }catch{setNotFound(true);}
    finally{setLoading(false);}
  };

  const handleSendMessage=async()=>{
    setMessaging(true);
    try{
      const token=localStorage.getItem('token');
      await fetch('http://localhost:3001/api/chat/messages',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({message:'👋 Hey!',receiver_id:params.userId})});
      const convRes=await fetch('http://localhost:3001/api/chat/conversations',{headers:{Authorization:`Bearer ${token}`}});
      const data=await convRes.json();
      const uid=localStorage.getItem('userId');
      const dm=data.dms?.find(d=>(d.user1_id===uid&&d.user2_id===params.userId)||(d.user2_id===uid&&d.user1_id===params.userId));
      if(dm)router.push(`/chat/dm/${dm.id}`);
    }catch{}
    finally{setMessaging(false);}
  };

  const fetchFFStats=async()=>{
    if(!ffUid.trim())return;
    setFfLoading(true);setFfError('');
    try{
      const res=await fetch(`http://localhost:3001/api/freefire/stats/${ffUid.trim()}`);
      const data=await res.json();
      if(data.error){setFfError('Player not found!');setFfStats(null);}else setFfStats(data);
    }catch{setFfError('Failed to fetch');}
    finally{setFfLoading(false);}
  };

  const handleFFOcr=async(file)=>{
    setOcrLoading(true);setFfError('');
    try{
      const Tesseract=(await import('tesseract.js')).default;
      const{data:{text}}=await Tesseract.recognize(file,'eng');
      const m=text.match(/\b[0-9]{8,12}\b/);
      if(m){
        setFfUid(m[0]);setFfInputMode('uid');
        const res=await fetch(`http://localhost:3001/api/freefire/stats/${m[0]}`);
        const data=await res.json();
        if(data.error)setFfError('UID found but not found!');else setFfStats(data);
      }else setFfError('UID not found. Try manual entry.');
    }catch{setFfError('OCR failed.');}
    finally{setOcrLoading(false);}
  };

  const activeStats=allStats.find(s=>s.game===activeGame)?.stats||{};
  const activeGC=GAME_CONFIG[activeGame]||GAME_CONFIG['Free Fire'];
  const activeGD=games.find(g=>g.game===activeGame);
  const isOwner=currentUserId&&String(currentUserId)===String(params.userId);

  const StatMini=({label,value,icon})=>(
    <div style={{textAlign:'center',padding:'8px 6px',background:'#080808',borderRadius:'8px',border:'1px solid rgba(239,68,68,0.08)'}}>
      <div style={{fontSize:'14px',marginBottom:'2px'}}>{icon}</div>
      <div style={{fontFamily:"'Orbitron',monospace",fontWeight:900,color:'#fff',fontSize:'12px'}}>{value}</div>
      <div style={{fontFamily:"'Orbitron',monospace",color:'#ef4444',fontSize:'7px',letterSpacing:'1px'}}>{label}</div>
    </div>
  );

  if(loading)return(
    <div style={{minHeight:'100vh',background:'#07070f',display:'flex',alignItems:'center',justifyContent:'center',paddingTop:'104px'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:'40px',height:'40px',border:'2px solid rgba(239,68,68,0.2)',borderTop:'2px solid #ef4444',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}}/>
        <div style={{color:'#ef4444',fontFamily:"'Orbitron',sans-serif",fontSize:'11px',letterSpacing:'3px'}}>LOADING...</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if(notFound)return(
    <div style={{minHeight:'100vh',background:'#07070f',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',paddingTop:'104px'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:'60px',marginBottom:'16px'}}>💀</div>
        <p style={{color:'#ef4444',fontFamily:"'Orbitron',sans-serif",fontSize:'18px',marginBottom:'8px'}}>PROFILE NOT FOUND</p>
        <button onClick={()=>router.back()} style={{background:'#ef4444',color:'#fff',border:'none',padding:'8px 20px',borderRadius:'8px',fontFamily:"'Orbitron',sans-serif",fontSize:'11px',cursor:'pointer'}}>← GO BACK</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:'100vh',background:'#07070f',color:'#fff',fontFamily:"'Rajdhani',sans-serif",paddingTop:'104px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:linear-gradient(#ef4444,#a78bfa,#00ffff)}
        @keyframes scan{0%{top:-2px;opacity:0}5%{opacity:.07}95%{opacity:.04}100%{top:100%;opacity:0}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes rainbowText{
          0%{color:#ef4444;text-shadow:0 0 20px #ef4444}14%{color:#f97316;text-shadow:0 0 20px #f97316}
          28%{color:#fbbf24;text-shadow:0 0 20px #fbbf24}42%{color:#10b981;text-shadow:0 0 20px #10b981}
          57%{color:#00ffff;text-shadow:0 0 20px #00ffff}71%{color:#6366f1;text-shadow:0 0 20px #6366f1}
          85%{color:#a78bfa;text-shadow:0 0 20px #a78bfa}100%{color:#ef4444;text-shadow:0 0 20px #ef4444}
        }
        @keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-80px) scale(1.5)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes neonPulse{0%,100%{opacity:.7}50%{opacity:1}}
        @keyframes rgbshift{0%{border-color:#ef4444}33%{border-color:#a855f7}66%{border-color:#00ffff}100%{border-color:#ef4444}}
        .scan-fx{position:absolute;left:0;right:0;height:1px;pointer-events:none;z-index:10;
          background:linear-gradient(90deg,transparent,rgba(239,68,68,.6),rgba(0,255,255,.3),transparent);
          animation:scan 7s linear infinite}
        .blink{animation:blink 2s infinite}
        .fu{animation:fadeUp .5s ease both}
        .rainbow-name{animation:rainbowText 2.4s linear infinite}
        .grid-bg{background-image:linear-gradient(rgba(239,68,68,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(239,68,68,.04) 1px,transparent 1px);background-size:44px 44px}
        .c{position:absolute;width:12px;height:12px;border-style:solid;pointer-events:none}
        .tl{top:6px;left:6px;border-width:2px 0 0 2px}
        .tr{top:6px;right:6px;border-width:2px 2px 0 0}
        .bl{bottom:6px;left:6px;border-width:0 0 2px 2px}
        .br2{bottom:6px;right:6px;border-width:0 2px 2px 0}
        .game-tab{transition:all .25s;cursor:pointer;border-radius:10px;border:none}
        .game-tab:hover{transform:translateY(-2px)}
        .hub-row{transition:all .2s;cursor:pointer}
        .hub-row:hover{transform:translateX(4px)}
        .action-btn{transition:all .25s;cursor:pointer;border:none}
        .action-btn:hover{transform:translateY(-2px);filter:brightness(1.2)}
        .squad-card-hover:hover{border-color:rgba(168,85,247,0.6)!important;animation:rgbshift 2s linear infinite}
      `}</style>

      <div className="grid-bg">
        {/* ── BANNER ── */}
        <div style={{position:'relative',height:'220px',overflow:'hidden'}}>
          {profile?.banner_url?<img src={profile.banner_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.5}}/>:
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#1a0000,#050015,#000d1a)'}}>
            <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.1}}>
              <defs><pattern id="cir" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M0 40 L20 40 L30 30 L50 30 L60 40 L80 40" stroke="#ef4444" strokeWidth="0.5" fill="none"/>
                <path d="M40 0 L40 20 L50 30" stroke="#00ffff" strokeWidth="0.5" fill="none"/>
                <circle cx="30" cy="30" r="2" fill="#ef4444"/><circle cx="50" cy="30" r="2" fill="#00ffff"/>
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#cir)"/>
            </svg>
          </div>}
          <BannerParticles/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 30%,#07070f 100%)'}}/>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#10b981,#00ffff,#6366f1,#a78bfa,#ec4899,#ef4444)',backgroundSize:'200% 100%',animation:'neonPulse 2s ease infinite'}}/>
          <div className="scan-fx"/>
          <button onClick={()=>router.back()} style={{position:'absolute',top:'16px',left:'16px',background:'rgba(0,0,0,0.7)',border:'1px solid rgba(239,68,68,0.35)',color:'#ef4444',padding:'6px 14px',borderRadius:'8px',fontFamily:"'Orbitron',monospace",fontSize:'10px',letterSpacing:'2px',cursor:'pointer',backdropFilter:'blur(10px)'}}>← BACK</button>
          {isOwner&&<button onClick={()=>router.push('/profile/edit')} style={{position:'absolute',top:'16px',right:'16px',background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.4)',color:'#ef4444',padding:'6px 14px',borderRadius:'8px',fontFamily:"'Orbitron',monospace",fontSize:'10px',letterSpacing:'2px',cursor:'pointer'}}>✏ EDIT</button>}
        </div>

        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 24px'}}>
          {/* ── PROFILE HEADER ── */}
          <div style={{display:'flex',alignItems:'flex-end',gap:'20px',marginTop:'-60px',marginBottom:'24px',position:'relative',zIndex:10}}>
            <NeonAvatar name={profile?.display_name} avatarUrl={profile?.avatar_url} size={110}/>
            <div style={{flex:1,paddingBottom:'8px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap',marginBottom:'4px'}}>
                <h1 className="rainbow-name" style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'28px',margin:0,letterSpacing:'2px'}}>
                  {profile?.display_name||'UNKNOWN'}
                </h1>
                {profile?.country&&<span style={{color:'#6b7280',fontSize:'14px',fontWeight:700}}>🌏 {profile.country}</span>}
                <div style={{display:'flex',alignItems:'center',gap:'5px',padding:'3px 10px',borderRadius:'99px',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)'}}>
                  <span className="blink" style={{width:'6px',height:'6px',borderRadius:'50%',background:'#10b981',boxShadow:'0 0 6px #10b981',display:'inline-block'}}/>
                  <span style={{fontFamily:"'Orbitron',monospace",fontSize:'8px',color:'#10b981',fontWeight:900,letterSpacing:'1px'}}>ONLINE</span>
                </div>
                <FloatingReactions/>
              </div>
              {profile?.tagline&&<p style={{color:'rgba(255,255,255,0.5)',fontWeight:700,fontSize:'14px',marginBottom:'8px',fontStyle:'italic'}}>"{profile.tagline}"</p>}
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
                {games.map(g=>{const gc=GAME_CONFIG[g.game];return(
                  <span key={g.game} style={{fontFamily:"'Orbitron',monospace",fontSize:'10px',fontWeight:700,padding:'4px 12px',borderRadius:'99px',background:gc?.bg,border:`1px solid ${gc?.border}`,color:gc?.color,boxShadow:`0 0 10px ${gc?.glow}20`}}>{gc?.icon} {g.game}</span>
                );})}
                {profile?.looking_for&&<span style={{fontFamily:"'Orbitron',monospace",fontSize:'10px',fontWeight:700,padding:'4px 12px',borderRadius:'99px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:LF_COLOR[profile.looking_for]||'#6b7280'}}>🔍 LF {profile.looking_for?.toUpperCase()}</span>}
                {!isOwner&&currentUserId&&<button className="action-btn" onClick={handleSendMessage} disabled={messaging} style={{fontFamily:"'Orbitron',monospace",fontSize:'10px',fontWeight:900,padding:'6px 16px',borderRadius:'8px',background:'linear-gradient(135deg,#ef4444,#dc2626)',color:'#fff',boxShadow:'0 0 20px rgba(239,68,68,0.5)',letterSpacing:'1px'}}>{messaging?'⟳':'💬'} MESSAGE</button>}
              </div>
            </div>
          </div>

          {/* ── 3-COLUMN LAYOUT ── */}
          <div style={{display:'grid',gridTemplateColumns:'250px 1fr 270px',gap:'16px',paddingBottom:'40px'}}>

            {/* ── COL 1 ── */}
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>

              {/* ── SQUAD CARD (NEW — above bio) ── */}
              {userSquad ? (
                <SquadCard
                  squad={userSquad}
                  onView={() => router.push(`/squads/${userSquad.id}`)}
                />
              ) : isOwner ? (
                /* Owner with no squad — show a "Create / Join" prompt */
                <GlowCard accentColor="#a855f7">
                  <p style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,color:'rgba(168,85,247,0.65)',letterSpacing:'3px',marginBottom:'10px'}}>//  SQUAD</p>
                  <div style={{textAlign:'center',padding:'14px 0'}}>
                    <div style={{fontSize:'28px',marginBottom:'8px',opacity:0.4}}>⬡</div>
                    <p style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',color:'#334155',letterSpacing:'2px',marginBottom:'12px'}}>NOT IN A SQUAD</p>
                    <div style={{display:'flex',gap:'6px',justifyContent:'center'}}>
                      <button onClick={()=>router.push('/squads/create')} style={{padding:'5px 12px',borderRadius:8,background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.3)',color:'#a855f7',fontFamily:"'Orbitron',monospace",fontSize:9,cursor:'pointer',letterSpacing:1}}>+ Create</button>
                      <button onClick={()=>router.push('/squads')} style={{padding:'5px 12px',borderRadius:8,background:'rgba(0,255,255,0.05)',border:'1px solid rgba(0,255,255,0.2)',color:'#00ffff',fontFamily:"'Orbitron',monospace",fontSize:9,cursor:'pointer',letterSpacing:1}}>Browse</button>
                    </div>
                  </div>
                </GlowCard>
              ) : null /* other user with no squad — show nothing */}

              {/* BIO */}
              {profile?.bio&&(
                <GlowCard accentColor="#ef4444">
                  <div className="scan-fx"/><div className="c tl" style={{borderColor:'#ef4444'}}/><div className="c br2" style={{borderColor:'rgba(0,255,255,0.3)'}}/>
                  <p style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,color:'rgba(239,68,68,0.6)',letterSpacing:'3px',marginBottom:'10px'}}>//  BIO</p>
                  <p style={{color:'rgba(255,255,255,0.6)',fontSize:'13px',lineHeight:1.7,fontWeight:600}}>{profile.bio}</p>
                </GlowCard>
              )}

              {/* SOCIALS */}
              {(profile?.youtube_url||profile?.instagram_url||profile?.discord_tag||profile?.twitter_url)&&(
                <GlowCard accentColor="#a78bfa">
                  <p style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,color:'rgba(167,139,250,0.6)',letterSpacing:'3px',marginBottom:'10px'}}>//  SOCIALS</p>
                  <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    {profile.youtube_url&&<a href={profile.youtube_url} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',fontWeight:700,color:'rgba(255,255,255,0.5)',textDecoration:'none',padding:'5px 8px',borderRadius:'6px',background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.12)'}}><span style={{color:'#ef4444'}}>▶</span> YouTube</a>}
                    {profile.instagram_url&&<a href={profile.instagram_url} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',fontWeight:700,color:'rgba(255,255,255,0.5)',textDecoration:'none',padding:'5px 8px',borderRadius:'6px',background:'rgba(236,72,153,0.06)',border:'1px solid rgba(236,72,153,0.12)'}}><span style={{color:'#ec4899'}}>📷</span> Instagram</a>}
                    {profile.discord_tag&&<div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',fontWeight:700,color:'rgba(255,255,255,0.5)',padding:'5px 8px',borderRadius:'6px',background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.12)'}}><span style={{color:'#6366f1'}}>💬</span> {profile.discord_tag}</div>}
                    {profile.twitter_url&&<a href={profile.twitter_url} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',fontWeight:700,color:'rgba(255,255,255,0.5)',textDecoration:'none',padding:'5px 8px',borderRadius:'6px',background:'rgba(34,211,238,0.06)',border:'1px solid rgba(34,211,238,0.12)'}}><span style={{color:'#22d3ee'}}>🐦</span> Twitter/X</a>}
                  </div>
                </GlowCard>
              )}

              {/* ACHIEVEMENTS */}
              <GlowCard accentColor="#fbbf24">
                <div className="scan-fx"/><div className="c tl" style={{borderColor:'#fbbf24'}}/><div className="c br2" style={{borderColor:'rgba(251,191,36,0.4)'}}/>
                <p style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,color:'rgba(251,191,36,0.6)',letterSpacing:'3px',marginBottom:'10px'}}>//  ACHIEVEMENTS</p>
                <button onClick={()=>router.push(`/profile/${params.userId}/achievements`)}
                  style={{width:'100%',padding:'7px',marginBottom:'10px',borderRadius:'8px',background:'rgba(251,191,36,0.08)',border:'1px solid rgba(251,191,36,0.3)',color:'#fbbf24',fontFamily:"'Orbitron',monospace",fontSize:'8px',fontWeight:900,letterSpacing:'2px',cursor:'pointer',transition:'all .2s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(251,191,36,0.18)';e.currentTarget.style.boxShadow='0 0 15px rgba(251,191,36,0.3)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(251,191,36,0.08)';e.currentTarget.style.boxShadow='none'}}>
                  🏆 SEE ALL ACHIEVEMENTS →
                </button>
                {(profile?.achievements||[]).length===0?(
                  <div style={{textAlign:'center',padding:'16px',border:'1px dashed rgba(251,191,36,0.15)',borderRadius:'10px'}}>
                    <p style={{fontFamily:"'Orbitron',monospace",color:'#374151',fontSize:'9px',letterSpacing:'2px'}}>NO ACHIEVEMENTS YET</p>
                  </div>
                ):(profile?.achievements||[]).slice(0,3).map((a,i)=>(
                  <div key={i} className="hub-row" style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px',borderRadius:'10px',background:'#0a0a0a',border:'1px solid rgba(251,191,36,0.15)',marginBottom:'6px'}}>
                    <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'rgba(251,191,36,0.12)',border:'1px solid rgba(251,191,36,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>🏆</div>
                    <div><p style={{fontWeight:900,fontSize:'11px',color:'#fff',margin:0}}>{a.title}</p>
                    {a.game&&<span style={{fontSize:'10px',fontWeight:700,color:GAME_CONFIG[a.game]?.color||'#ef4444'}}>{a.game}</span>}</div>
                  </div>
                ))}
              </GlowCard>

              {/* SKILL BARS */}
              {Object.keys(activeStats).length>0&&(
                <GlowCard accentColor="#00ffff">
                  <p style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,color:'rgba(0,255,255,0.6)',letterSpacing:'3px',marginBottom:'14px'}}>//  SKILL METRICS</p>
                  {activeStats.kd_ratio&&<SkillBar label="K/D RATIO" value={activeStats.kd_ratio} max={10} color="#ef4444" delay={0}/>}
                  {activeStats.win_rate&&<SkillBar label="WIN RATE" value={activeStats.win_rate} max={100} color="#fbbf24" suffix="%" delay={150}/>}
                  {activeStats.headshot&&<SkillBar label="HEADSHOT" value={activeStats.headshot} max={100} color="#a78bfa" suffix="%" delay={300}/>}
                  {activeStats.total_kills&&<SkillBar label="TOTAL KILLS" value={activeStats.total_kills} max={Math.max(parseFloat(activeStats.total_kills)*1.5,100)} color="#00ffff" delay={450}/>}
                </GlowCard>
              )}
            </div>

            {/* ── COL 2 — Game Card ── */}
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {games.length>0?(
                <>
                  <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                    {games.map(g=>{const gc=GAME_CONFIG[g.game];return(
                      <button key={g.game} className="game-tab" onClick={()=>setActiveGame(g.game)}
                        style={{padding:'8px 18px',fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'10px',letterSpacing:'1px',cursor:'pointer',background:activeGame===g.game?gc?.bg:'rgba(255,255,255,0.04)',border:`1px solid ${activeGame===g.game?gc?.color:'rgba(255,255,255,0.06)'}`,color:activeGame===g.game?gc?.color:'#6b7280',boxShadow:activeGame===g.game?`0 0 20px ${gc?.glow}`:'none'}}>
                        {gc?.icon} {g.game}
                      </button>
                    );})}
                    {isOwner&&<button className="game-tab" onClick={()=>router.push('/profile/edit')} style={{padding:'8px 14px',fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'9px',letterSpacing:'1px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:'#ef4444',cursor:'pointer'}}>✏ EDIT</button>}
                  </div>

                  {activeGame&&(
                    <TiltCard accentColor={activeGC.color} style={{padding:'20px'}}>
                      <div className="scan-fx"/>
                      <div className="c tl" style={{borderColor:activeGC.color}}/><div className="c tr" style={{borderColor:activeGC.color}}/>
                      <div className="c bl" style={{borderColor:`${activeGC.color}60`}}/><div className="c br2" style={{borderColor:`${activeGC.color}60`}}/>
                      <div style={{position:'absolute',inset:0,backgroundImage:`radial-gradient(ellipse 60% 50% at 80% 30%,${activeGC.color}08,transparent)`,pointerEvents:'none',zIndex:0}}/>
                      <div style={{position:'relative',zIndex:1}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                            <span style={{fontSize:'32px',filter:`drop-shadow(0 0 12px ${activeGC.color})`}}>{activeGC.icon}</span>
                            <div>
                              <p style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'18px',textShadow:`0 0 20px ${activeGC.color}60`,margin:0}}>{activeGame}</p>
                              <div style={{display:'flex',gap:'8px',marginTop:'4px'}}>
                                {activeGD?.role&&<span style={{fontSize:'11px',fontWeight:700,color:activeGC.color}}>{activeGD.role}</span>}
                                {activeGD?.rank&&<span style={{fontSize:'11px',fontWeight:900,padding:'2px 10px',borderRadius:'99px',background:activeGC.bg,border:`1px solid ${activeGC.border}`,color:activeGC.color,fontFamily:"'Orbitron',monospace"}}>👑 {activeGD.rank}</span>}
                              </div>
                            </div>
                          </div>
                          {isOwner&&<div style={{display:'flex',gap:'8px'}}>
                            <button onClick={()=>router.push('/profile/edit')} style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,padding:'6px 14px',borderRadius:'8px',background:activeGC.bg,color:activeGC.color,border:`1px solid ${activeGC.border}`,cursor:'pointer'}}>✏ EDIT</button>
                            <button onClick={()=>router.push(`/profile/edit?step=3&game=${activeGame}`)} style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,padding:'6px 14px',borderRadius:'8px',background:'rgba(16,185,129,0.1)',color:'#10b981',border:'1px solid rgba(16,185,129,0.3)',cursor:'pointer'}}>📊 STATS</button>
                          </div>}
                        </div>
                        {Object.keys(activeStats).length>0?
                          <GameStatsDisplay stats={activeStats} accentColor={activeGC.color} gameName={activeGame}/>:
                          <div style={{textAlign:'center',padding:'32px'}}>
                            <p style={{fontFamily:"'Orbitron',monospace",color:'#374151',fontSize:'11px',letterSpacing:'2px'}}>NO STATS ADDED YET</p>
                            {isOwner&&<button onClick={()=>router.push('/profile/edit?step=3')} style={{marginTop:'12px',fontFamily:"'Orbitron',monospace",fontSize:'10px',fontWeight:900,padding:'8px 18px',borderRadius:'8px',background:activeGC.bg,color:activeGC.color,border:`1px solid ${activeGC.border}`,cursor:'pointer'}}>+ ADD STATS</button>}
                          </div>}
                      </div>
                    </TiltCard>
                  )}
                </>
              ):(
                <div style={{padding:'40px',textAlign:'center',borderRadius:'20px',background:'#050505',border:'1px solid rgba(239,68,68,0.1)'}}>
                  <div style={{fontSize:'48px',marginBottom:'12px'}}>🎮</div>
                  <p style={{fontFamily:"'Orbitron',monospace",color:'#374151',letterSpacing:'2px',fontSize:'12px'}}>NO GAMES ADDED</p>
                  {isOwner&&<button onClick={()=>router.push('/profile/edit')} style={{marginTop:'12px',fontFamily:"'Orbitron',monospace",fontSize:'10px',fontWeight:900,padding:'8px 18px',borderRadius:'8px',background:'rgba(239,68,68,0.1)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.3)',cursor:'pointer'}}>+ SETUP PROFILE</button>}
                </div>
              )}
            </div>

            {/* ── COL 3 — Live FF Stats + Clips ── */}
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {activeGame==='Free Fire'&&(
                <GlowCard accentColor="#ef4444" style={{padding:'16px'}}>
                  <div className="scan-fx"/>
                  <p style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,color:'rgba(239,68,68,0.7)',letterSpacing:'3px',marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
                    <span className="blink" style={{width:'6px',height:'6px',borderRadius:'50%',background:'#ef4444',boxShadow:'0 0 6px #ef4444',display:'inline-block',flexShrink:0}}/>
                    LIVE FF STATS
                  </p>
                  {!ffInputMode&&!ffStats&&(
                    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                      {[{mode:'uid',icon:'🔢',title:'ENTER UID',sub:'Auto fetch stats',badge:'QUICK → AUTO FETCH',bg:'rgba(239,68,68,0.07)',bdr:'rgba(239,68,68,0.22)',bbg:'rgba(239,68,68,0.15)',bc:'#ef4444'},
                        {mode:'ocr',icon:'📸',title:'SCREENSHOT',sub:'OCR auto extract',badge:'OCR → AUTO EXTRACT',bg:'rgba(99,102,241,0.07)',bdr:'rgba(99,102,241,0.22)',bbg:'rgba(99,102,241,0.15)',bc:'#6366f1'}].map(b=>(
                        <button key={b.mode} onClick={()=>setFfInputMode(b.mode)} style={{padding:'14px',borderRadius:'12px',background:b.bg,border:`1px solid ${b.bdr}`,cursor:'pointer',textAlign:'center',transition:'all .25s'}}
                          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                          onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                          <div style={{fontSize:'22px',marginBottom:'6px'}}>{b.icon}</div>
                          <div style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:'10px',color:'#fff',marginBottom:'2px'}}>{b.title}</div>
                          <div style={{fontSize:'10px',color:'#4b5563',marginBottom:'8px'}}>{b.sub}</div>
                          <div style={{padding:'4px',borderRadius:'6px',background:b.bbg,color:b.bc,fontFamily:"'Orbitron',monospace",fontSize:'8px',letterSpacing:'1px'}}>{b.badge}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {ffInputMode==='uid'&&!ffStats&&(
                    <div>
                      <button onClick={()=>{setFfInputMode(null);setFfError('');}} style={{background:'none',border:'none',color:'#6b7280',fontWeight:700,fontSize:'12px',cursor:'pointer',marginBottom:'8px'}}>← BACK</button>
                      <div style={{display:'flex',gap:'6px'}}>
                        <input value={ffUid} onChange={e=>setFfUid(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchFFStats()} placeholder="Enter UID..."
                          style={{flex:1,background:'#0a0a0a',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'8px',color:'#fff',padding:'8px 12px',fontFamily:"'Rajdhani',sans-serif",fontSize:'13px',outline:'none'}}/>
                        <button onClick={fetchFFStats} disabled={ffLoading} style={{padding:'8px 12px',borderRadius:'8px',background:'linear-gradient(135deg,#ef4444,#dc2626)',border:'none',color:'#fff',fontFamily:"'Orbitron',monospace",fontSize:'10px',cursor:'pointer'}}>{ffLoading?'⟳':'🔍'}</button>
                      </div>
                      {ffError&&<p style={{color:'#ef4444',fontSize:'11px',marginTop:'6px'}}>{ffError}</p>}
                    </div>
                  )}
                  {ffInputMode==='ocr'&&!ffStats&&(
                    <div>
                      <button onClick={()=>{setFfInputMode(null);setFfError('');}} style={{background:'none',border:'none',color:'#6b7280',fontWeight:700,fontSize:'12px',cursor:'pointer',marginBottom:'8px'}}>← BACK</button>
                      <label style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'20px',borderRadius:'12px',background:'#0a0a0a',border:'2px dashed rgba(99,102,241,0.3)',cursor:'pointer'}}>
                        <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>e.target.files[0]&&handleFFOcr(e.target.files[0])}/>
                        {ocrLoading?<div style={{color:'#6366f1',fontFamily:"'Orbitron',monospace",fontSize:'10px'}}>SCANNING...</div>:
                        <><div style={{fontSize:'28px',marginBottom:'6px'}}>📲</div>
                        <div style={{fontFamily:"'Orbitron',monospace",fontSize:'10px',color:'#fff',marginBottom:'4px'}}>UPLOAD SS</div>
                        <div style={{fontSize:'10px',color:'#4b5563',textAlign:'center'}}>Auto extract UID</div></>}
                      </label>
                      {ffError&&<p style={{color:'#ef4444',fontSize:'11px',marginTop:'6px'}}>{ffError}</p>}
                    </div>
                  )}
                  {ffStats&&(
                    <div>
                      <div style={{display:'flex',gap:'6px',marginBottom:'10px'}}>
                        {['br','cs'].map(m=>(
                          <button key={m} onClick={()=>setFfMode(m)} style={{padding:'5px 12px',borderRadius:'6px',fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,cursor:'pointer',background:ffMode===m?'rgba(239,68,68,0.2)':'#0a0a0a',border:`1px solid ${ffMode===m?'#ef4444':'rgba(255,255,255,0.05)'}`,color:ffMode===m?'#ef4444':'#6b7280'}}>
                            {m==='br'?'🔥 BR':'⚔️ CS'}
                          </button>
                        ))}
                        <button onClick={()=>{setFfStats(null);setFfInputMode(null);setFfUid('');}} style={{marginLeft:'auto',padding:'5px 10px',borderRadius:'6px',background:'#0a0a0a',border:'1px solid rgba(255,255,255,0.05)',color:'#6b7280',fontSize:'10px',cursor:'pointer'}}>↺</button>
                      </div>
                      {ffMode==='br'&&ffStats.br&&['solostats','duostats','quadstats'].map(mode=>{
                        const s=ffStats.br[mode];if(!s?.gamesplayed)return null;
                        const d=s.detailedstats||{};
                        const kd=s.kills&&s.gamesplayed?(s.kills/s.gamesplayed).toFixed(2):'0';
                        const wr=s.wins&&s.gamesplayed?((s.wins/s.gamesplayed)*100).toFixed(1):'0';
                        const hs=d.headshotkills&&s.kills?((d.headshotkills/s.kills)*100).toFixed(1):'0';
                        return(
                          <div key={mode} style={{marginBottom:'8px',padding:'10px',borderRadius:'10px',background:'#0a0a0a',border:'1px solid rgba(239,68,68,0.1)'}}>
                            <p style={{fontFamily:"'Orbitron',monospace",fontSize:'8px',color:'#ef4444',marginBottom:'8px',letterSpacing:'2px'}}>{mode==='solostats'?'👤 SOLO':mode==='duostats'?'👥 DUO':'👥 SQUAD'}</p>
                            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'4px'}}>
                              {[{l:'MATCH',v:s.gamesplayed,i:'🎮'},{l:'KILLS',v:s.kills,i:'💀'},{l:'WINS',v:s.wins,i:'🏆'},{l:'K/D',v:kd,i:'⚔️'},{l:'WIN%',v:`${wr}%`,i:'🥇'},{l:'HS%',v:`${hs}%`,i:'🎯'}].map((st,idx)=>(
                                <StatMini key={idx} label={st.l} value={st.v} icon={st.i}/>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      {ffMode==='cs'&&ffStats.cs?.csstats&&(()=>{
                        const s=ffStats.cs.csstats;const d=s.detailedstats||{};
                        const kd=s.kills&&d.deaths?(s.kills/d.deaths).toFixed(2):'0';
                        return(
                          <div style={{padding:'10px',borderRadius:'10px',background:'#0a0a0a',border:'1px solid rgba(239,68,68,0.1)'}}>
                            <p style={{fontFamily:"'Orbitron',monospace",fontSize:'8px',color:'#ef4444',marginBottom:'8px',letterSpacing:'2px'}}>⚔️ CLASH SQUAD</p>
                            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'4px'}}>
                              {[{l:'MATCH',v:s.gamesplayed,i:'🎮'},{l:'KILLS',v:s.kills,i:'💀'},{l:'WINS',v:s.wins,i:'🏆'},{l:'K/D',v:kd,i:'⚔️'},{l:'MVP',v:d.mvpcount,i:'⭐'},{l:'DMG',v:d.damage,i:'💥'}].filter(x=>x.v).map((st,idx)=>(
                                <StatMini key={idx} label={st.l} value={st.v} icon={st.i}/>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </GlowCard>
              )}
              {profile?.gameplay_clips?.length>0&&(
                <GlowCard accentColor="#a78bfa" style={{padding:'16px'}}>
                  <p style={{fontFamily:"'Orbitron',monospace",fontSize:'9px',fontWeight:900,color:'rgba(167,139,250,0.6)',letterSpacing:'3px',marginBottom:'10px'}}>//  GAMEPLAY CLIPS</p>
                  <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    {profile.gameplay_clips.map((clip,i)=>(
                      <div key={i} style={{borderRadius:'10px',overflow:'hidden',border:'1px solid rgba(167,139,250,0.2)'}}>
                        {clip.youtube_url&&<div style={{aspectRatio:'16/9'}}><iframe src={clip.youtube_url.replace('watch?v=','embed/')} style={{width:'100%',height:'100%'}} allowFullScreen title={clip.title}/></div>}
                        <div style={{padding:'8px',background:'rgba(0,0,0,0.5)'}}><p style={{fontWeight:900,fontSize:'12px',color:'#fff',margin:0}}>{clip.title}</p></div>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}