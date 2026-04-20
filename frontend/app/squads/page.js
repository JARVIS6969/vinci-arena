'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const C = {
  red:'#ef4444', cyan:'#00ffff', purple:'#a855f7',
  gold:'#fbbf24', green:'#00ff88', orange:'#f97316',
  bg:'#050510', card:'#0a0a1a', card2:'#0d0d20',
};

function ScanLine(){
  const [y,setY]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setY(p=>(p+.35)%110),18);return()=>clearInterval(id);},[]);
  return <div style={{position:'fixed',top:`${y}%`,left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,rgba(0,255,255,0.13),rgba(239,68,68,0.18),transparent)',zIndex:1,pointerEvents:'none'}}/>;
}

function ParticleCanvas(){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext('2d');
    const resize=()=>{c.width=window.innerWidth;c.height=window.innerHeight;};
    resize(); window.addEventListener('resize',resize);
    const pts=Array.from({length:45},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.2+.4,col:[C.cyan,C.purple,C.red][Math.floor(Math.random()*3)]}));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.col+'44';ctx.fill();});
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}}/>;
}

function Badge({children,color=C.cyan}){
  return <span style={{display:'inline-flex',alignItems:'center',gap:3,fontSize:10,fontWeight:600,padding:'3px 9px',borderRadius:20,fontFamily:"'Share Tech Mono',monospace",background:color+'18',color,border:`1px solid ${color}40`}}>{children}</span>;
}

// ── Already In Squad Banner ───────────────────────────────────────────────────
function AlreadyInSquadBanner({ mySquad, router }) {
  const [leaving, setLeaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const gameColors = {'Free Fire':C.red,'BGMI':C.orange,'Valorant':C.purple};
  const gc = gameColors[mySquad?.game] || C.cyan;
  const isLeader = mySquad?._isLeader;

  const handleLeave = async () => {
    setLeaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/squads/${mySquad.id}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to leave squad');
      }
    } catch { alert('Error leaving squad'); }
    finally { setLeaving(false); setShowConfirm(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${mySquad.name}" permanently? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/squads/${mySquad.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } catch { alert('Error deleting squad'); }
  };

  return (
    <div style={{
      background: 'rgba(8,8,20,0.95)',
      border: `1px solid rgba(251,191,36,0.35)`,
      borderRadius: 14,
      padding: '18px 20px',
      marginBottom: 16,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Gold top line */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:'linear-gradient(90deg,#fbbf24,#f97316,transparent)'}}/>
      <div style={{position:'absolute',top:7,left:7,width:9,height:9,borderTop:'1.5px solid rgba(251,191,36,0.6)',borderLeft:'1.5px solid rgba(251,191,36,0.6)'}}/>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
        <span style={{fontSize:14}}>⚠️</span>
        <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:700,color:'rgba(251,191,36,0.8)',letterSpacing:3}}>ALREADY IN A SQUAD</span>
      </div>

      {/* Squad info */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12,padding:'10px 12px',background:'rgba(255,255,255,0.03)',borderRadius:10,border:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{width:36,height:36,borderRadius:8,background:`${gc}18`,border:`1.5px solid ${gc}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:900,color:gc,flexShrink:0}}>
          {(mySquad?.tag||mySquad?.name||'?').slice(0,2).toUpperCase()}
        </div>
        <div>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:900,color:'#fff'}}>{mySquad?.name}</div>
          <div style={{fontSize:10,color:'#475569',fontFamily:"'Share Tech Mono',monospace",marginTop:2}}>
            {mySquad?.game} · {isLeader ? '♔ Leader' : 'Member'}
          </div>
        </div>
        <button onClick={()=>router.push(`/squads/${mySquad.id}`)} style={{marginLeft:'auto',padding:'5px 12px',borderRadius:8,background:`${gc}12`,border:`1px solid ${gc}35`,color:gc,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1,flexShrink:0}}>
          View →
        </button>
      </div>

      {/* Message */}
      <div style={{fontSize:12,color:'#64748b',fontFamily:"'Rajdhani',sans-serif",fontWeight:500,lineHeight:1.6,marginBottom:14}}>
        You are already part of <span style={{color:'#fff',fontWeight:700}}>{mySquad?.name}</span>. To create or join a different squad, you must first {isLeader ? 'delete your current squad' : 'leave your current squad'}.
      </div>

      {/* Actions */}
      {!showConfirm ? (
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>router.push(`/squads/${mySquad.id}/edit`)}
            style={{flex:1,padding:'8px 0',borderRadius:9,background:'rgba(0,255,255,0.06)',border:'1px solid rgba(0,255,255,0.2)',color:C.cyan,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1}}>
            Manage Squad
          </button>
          {isLeader ? (
            <button onClick={handleDelete}
              style={{flex:1,padding:'8px 0',borderRadius:9,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1}}>
              Delete Squad
            </button>
          ) : (
            <button onClick={()=>setShowConfirm(true)}
              style={{flex:1,padding:'8px 0',borderRadius:9,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1}}>
              Leave Squad
            </button>
          )}
        </div>
      ) : (
        <div style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,padding:'12px 14px'}}>
          <div style={{fontSize:12,color:'rgba(239,68,68,0.8)',fontFamily:"'Share Tech Mono',monospace",marginBottom:10}}>
            ⚠ Are you sure you want to leave "{mySquad?.name}"?
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={handleLeave} disabled={leaving}
              style={{flex:1,padding:'7px 0',borderRadius:8,background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.4)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1,opacity:leaving?.6:1}}>
              {leaving ? '...' : 'Yes, Leave'}
            </button>
            <button onClick={()=>setShowConfirm(false)}
              style={{flex:1,padding:'7px 0',borderRadius:8,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',color:'#475569',fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1}}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── My Squad Panel (no squad) ─────────────────────────────────────────────────
function NoSquadPanel({ router }) {
  return (
    <div style={{background:C.card,border:'1px solid rgba(168,85,247,0.2)',borderRadius:14,padding:16,marginBottom:12,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:'linear-gradient(90deg,#a855f7,#00ffff,transparent)'}}/>
      <div style={{position:'absolute',top:6,left:6,width:8,height:8,borderTop:'1.5px solid rgba(168,85,247,0.5)',borderLeft:'1.5px solid rgba(168,85,247,0.5)'}}/>
      <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:'rgba(168,85,247,0.65)',letterSpacing:3,marginBottom:12}}>// MY SQUAD</p>
      <div style={{textAlign:'center',padding:'10px 0'}}>
        <div style={{fontSize:24,marginBottom:8,opacity:.25}}>⬡</div>
        <div style={{fontSize:10,color:'#334155',fontFamily:"'Share Tech Mono',monospace",marginBottom:14}}>Not in a squad yet</div>
        <button onClick={()=>router.push('/squads/create')}
          style={{width:'100%',padding:'9px 0',borderRadius:9,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.35)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:700,cursor:'pointer',letterSpacing:1,marginBottom:8}}>
          + Create Squad
        </button>
        <div style={{fontSize:10,color:'#1e293b',fontFamily:"'Share Tech Mono',monospace"}}>or browse squads and apply below</div>
      </div>
    </div>
  );
}

// ── My Squad Panel (has squad) ────────────────────────────────────────────────
function HasSquadPanel({ mySquad, router }) {
  const gameColors = {'Free Fire':C.red,'BGMI':C.orange,'Valorant':C.purple};
  const gc = gameColors[mySquad?.game] || C.cyan;
  const activeMembers = mySquad?.squad_members?.filter(m=>m.is_active)||[];

  return (
    <div style={{background:C.card,border:'1px solid rgba(168,85,247,0.25)',borderRadius:14,padding:16,marginBottom:12,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:'linear-gradient(90deg,#a855f7,#00ffff,transparent)'}}/>
      <div style={{position:'absolute',top:6,left:6,width:8,height:8,borderTop:'1.5px solid rgba(168,85,247,0.5)',borderLeft:'1.5px solid rgba(168,85,247,0.5)'}}/>
      <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:'rgba(168,85,247,0.65)',letterSpacing:3,marginBottom:12}}>// MY SQUAD</p>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
        <div style={{width:40,height:40,borderRadius:10,background:`${gc}18`,border:`1.5px solid ${gc}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:900,color:gc,flexShrink:0}}>
          {(mySquad.tag||mySquad.name||'?').slice(0,2).toUpperCase()}
        </div>
        <div>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:900,color:'#fff'}}>{mySquad.name}</div>
          <div style={{fontSize:10,color:'#475569',fontFamily:"'Share Tech Mono',monospace",marginTop:2}}>{mySquad.game} · {activeMembers.length}/7</div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:12}}>
        {[{val:mySquad.elo_rating||'—',lbl:'ELO',color:C.red},{val:mySquad.total_wins||0,lbl:'Wins',color:C.green}].map(s=>(
          <div key={s.lbl} style={{background:'rgba(255,255,255,0.025)',borderRadius:8,padding:'7px 4px',textAlign:'center',border:'1px solid rgba(168,85,247,0.08)'}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:900,color:s.color}}>{s.val}</div>
            <div style={{fontSize:9,color:'#475569',fontFamily:"'Share Tech Mono',monospace",marginTop:1}}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>router.push(`/squads/${mySquad.id}`)}
        style={{width:'100%',padding:'8px 0',borderRadius:9,background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.35)',color:C.purple,fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:700,cursor:'pointer',letterSpacing:1,marginBottom:6}}>
        View My Squad →
      </button>
      <button onClick={()=>router.push(`/squads/${mySquad.id}/edit`)}
        style={{width:'100%',padding:'8px 0',borderRadius:9,background:'rgba(0,255,255,0.05)',border:'1px solid rgba(0,255,255,0.18)',color:C.cyan,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1}}>
        Edit Squad
      </button>
    </div>
  );
}

// ── Rankings Panel ────────────────────────────────────────────────────────────
function RankingsPanel() {
  return (
    <div style={{background:C.card,border:'1px solid rgba(251,191,36,0.2)',borderRadius:14,padding:16,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:'linear-gradient(90deg,#fbbf24,transparent)'}}/>
      <div style={{position:'absolute',top:6,left:6,width:8,height:8,borderTop:'1.5px solid rgba(251,191,36,0.5)',borderLeft:'1.5px solid rgba(251,191,36,0.5)'}}/>
      <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:'rgba(251,191,36,0.65)',letterSpacing:3,marginBottom:14}}>// RANKINGS</p>
      <div style={{textAlign:'center',padding:'16px 0'}}>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:26,color:'rgba(251,191,36,0.2)',marginBottom:10}}>🏆</div>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:900,color:'rgba(251,191,36,0.5)',letterSpacing:3,marginBottom:8}}>COMING SOON</div>
        <div style={{fontSize:10,color:'#334155',fontFamily:"'Share Tech Mono',monospace",lineHeight:1.7}}>
          Global squad leaderboard<br/>ELO-based ranking system<br/>Season rewards & badges
        </div>
        <div style={{marginTop:12,padding:'6px 10px',borderRadius:8,background:'rgba(251,191,36,0.05)',border:'1px solid rgba(251,191,36,0.14)',fontSize:9,color:'rgba(251,191,36,0.35)',fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>
          // Season 1 — Q3 2026
        </div>
      </div>
    </div>
  );
}

// ── Squad Card ────────────────────────────────────────────────────────────────
function SquadCard({ squad, mySquad, onBlockedClick }) {
  const [hov,setHov]=useState(false);
  const activeMembers=squad.squad_members?.filter(m=>m.is_active)||[];
  const gameColors={'Free Fire':C.red,'BGMI':C.orange,'Valorant':C.purple};
  const gameColor=gameColors[squad.game]||C.cyan;
  const winRate=squad.total_tournaments>0?Math.round((squad.total_wins/squad.total_tournaments)*100):0;
  const isMySquad = mySquad?.id === squad.id;
  const hasOtherSquad = mySquad && !isMySquad;

  const cardContent = (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={hasOtherSquad ? onBlockedClick : undefined}
      style={{background:C.card,border:`1px solid rgba(0,255,255,${hov?.22:.07})`,borderRadius:16,padding:20,cursor:'pointer',position:'relative',overflow:'hidden',transform:hov?'translateY(-4px)':'translateY(0)',transition:'all .22s ease',height:'100%',opacity:hasOtherSquad&&!isMySquad?.7:1}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${gameColor},transparent)`,opacity:hov?1:.4,transition:'opacity .2s'}}/>
      <div style={{position:'absolute',top:6,left:6,width:8,height:8,borderTop:`1.5px solid rgba(0,255,255,${hov?.35:.15})`,borderLeft:`1.5px solid rgba(0,255,255,${hov?.35:.15})`}}/>
      <div style={{position:'absolute',top:6,right:6,width:8,height:8,borderTop:`1.5px solid rgba(0,255,255,${hov?.35:.15})`,borderRight:`1.5px solid rgba(0,255,255,${hov?.35:.15})`}}/>
      {isMySquad && <div style={{position:'absolute',top:8,right:24,fontSize:11}}>♔</div>}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
        <div style={{width:52,height:52,borderRadius:12,background:`linear-gradient(135deg,${gameColor}22,${C.purple}22)`,border:`1.5px solid ${gameColor}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:900,color:gameColor,flexShrink:0}}>
          {(squad.tag||squad.name||'?').slice(0,3).toUpperCase()}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:900,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{squad.name}</div>
          <div style={{display:'flex',gap:5,marginTop:5,flexWrap:'wrap'}}>
            <Badge color={gameColor}>{squad.game}</Badge>
            {squad.region&&<Badge color={C.purple}>{squad.region}</Badge>}
            {isMySquad&&<Badge color={C.gold}>My Squad</Badge>}
          </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:14}}>
        {[{val:squad.elo_rating,lbl:'ELO',color:C.red},{val:squad.total_wins,lbl:'Wins',color:C.green},{val:`${winRate}%`,lbl:'W-Rate',color:C.gold}].map(s=>(
          <div key={s.lbl} style={{background:'rgba(255,255,255,0.025)',borderRadius:8,padding:'8px 4px',textAlign:'center',border:'1px solid rgba(0,255,255,0.05)'}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:15,fontWeight:900,color:s.color}}>{s.val}</div>
            <div style={{fontSize:9,color:'#475569',fontFamily:"'Share Tech Mono',monospace",marginTop:2,letterSpacing:.5}}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <div style={{borderTop:'1px solid rgba(0,255,255,0.06)',paddingTop:12}}>
        <div style={{fontSize:10,color:'#334155',fontFamily:"'Share Tech Mono',monospace",marginBottom:6}}>Members · {activeMembers.length}/7</div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {activeMembers.slice(0,5).map(m=>(
            <div key={m.id} style={{width:28,height:28,borderRadius:'50%',background:`${C.purple}22`,border:`1px solid ${C.purple}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:900,color:C.purple}}>
              {(m.users?.name||'?').slice(0,1).toUpperCase()}
            </div>
          ))}
          {activeMembers.length>5&&<div style={{width:28,height:28,borderRadius:'50%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#475569'}}>+{activeMembers.length-5}</div>}
          {Array.from({length:Math.min(2,7-activeMembers.length)}).map((_,i)=>(
            <div key={`open-${i}`} style={{width:28,height:28,borderRadius:'50%',background:'rgba(255,255,255,0.01)',border:'1px dashed rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'rgba(255,255,255,0.12)'}}>+</div>
          ))}
        </div>
        {hasOtherSquad && !isMySquad && hov && (
          <div style={{marginTop:8,fontSize:10,color:'rgba(251,191,36,0.6)',fontFamily:"'Share Tech Mono',monospace"}}>
            ⚠ Leave your squad first to join this one
          </div>
        )}
      </div>
    </div>
  );

  if (hasOtherSquad) return cardContent;
  return <Link href={`/squads/${squad.id}`} style={{textDecoration:'none'}}>{cardContent}</Link>;
}

// ── Blocked Toast ─────────────────────────────────────────────────────────────
function BlockedToast({ mySquad, onClose, router }) {
  const isLeader = mySquad?._isLeader;
  useEffect(() => { const t = setTimeout(onClose, 6000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)',
      zIndex:999, minWidth:340, maxWidth:480,
      background:'rgba(8,8,20,0.97)',
      border:'1px solid rgba(251,191,36,0.4)',
      borderRadius:14, padding:'16px 20px',
      boxShadow:'0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(251,191,36,0.1)',
    }}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:'linear-gradient(90deg,#fbbf24,#ef4444,transparent)'}}/>
      <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
        <span style={{fontSize:20,flexShrink:0}}>🚫</span>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,color:'rgba(251,191,36,0.9)',letterSpacing:2,marginBottom:6}}>
            ALREADY IN A SQUAD
          </div>
          <div style={{fontSize:12,color:'#94a3b8',fontFamily:"'Rajdhani',sans-serif",fontWeight:500,lineHeight:1.6,marginBottom:12}}>
            You're currently in <span style={{color:'#fff',fontWeight:700}}>{mySquad?.name}</span>. You must {isLeader ? 'delete your squad' : 'leave your squad'} before you can join or create another one.
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>{router.push(`/squads/${mySquad.id}/edit`);onClose();}}
              style={{padding:'6px 14px',borderRadius:8,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1}}>
              {isLeader ? 'Delete Squad' : 'Leave Squad'} →
            </button>
            <button onClick={()=>{router.push(`/squads/${mySquad.id}`);onClose();}}
              style={{padding:'6px 14px',borderRadius:8,background:'rgba(0,255,255,0.05)',border:'1px solid rgba(0,255,255,0.15)',color:C.cyan,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1}}>
              View My Squad
            </button>
            <button onClick={onClose}
              style={{marginLeft:'auto',padding:'6px 10px',borderRadius:8,background:'transparent',border:'none',color:'#334155',fontFamily:"'Share Tech Mono',monospace",fontSize:12,cursor:'pointer'}}>
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SquadsPage() {
  const router = useRouter();
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mySquad, setMySquad] = useState(null);
  const [mySquadLoading, setMySquadLoading] = useState(true);
  const [filter, setFilter] = useState({ game:'', region:'' });
  const [search, setSearch] = useState('');
  const [showBlockedToast, setShowBlockedToast] = useState(false);

  useEffect(() => { fetchSquads(); fetchMySquad(); }, []);
  useEffect(() => { fetchSquads(); }, [filter]);

  const fetchMySquad = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return;
      const res = await fetch(`http://localhost:3001/api/squads/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          // Determine if user is leader
          data._isLeader = data.squad_members?.some(
            m => m.user_id === userId && m.role === 'leader' && m.is_active
          );
        }
        setMySquad(data);
      }
    } catch {}
    finally { setMySquadLoading(false); }
  };

  const fetchSquads = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      const params = new URLSearchParams();
      if (filter.game) params.append('game', filter.game);
      if (filter.region) params.append('region', filter.region);
      const res = await fetch(`http://localhost:3001/api/squads?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setSquads(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // intercept create button
  const handleCreateClick = () => {
    if (mySquad) { setShowBlockedToast(true); return; }
    router.push('/squads/create');
  };

  const filtered = squads.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.tag?.toLowerCase().includes(search.toLowerCase())
  );

  const selectStyle = { background:C.card2, border:'1px solid rgba(0,255,255,0.15)', borderRadius:10, padding:'8px 14px', color:'#e2e8f0', fontFamily:"'Share Tech Mono',monospace", fontSize:12, outline:'none', cursor:'pointer' };

  if (loading) return (
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;600&family=Share+Tech+Mono&display=swap');@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:48,height:48,border:`3px solid rgba(239,68,68,0.2)`,borderTopColor:C.red,borderRadius:'50%',animation:'spin .8s linear infinite'}}/>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:'#e2e8f0',paddingTop:104,paddingBottom:60,position:'relative',fontFamily:"'Rajdhani',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;600&family=Share+Tech+Mono&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        *{box-sizing:border-box}
        input::placeholder{color:#334155}
        select option{background:#0a0a1a}
      `}</style>

      <ParticleCanvas/>
      <ScanLine/>
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',backgroundImage:'linear-gradient(rgba(0,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.025) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>

      {/* Blocked toast */}
      {showBlockedToast && (
        <BlockedToast mySquad={mySquad} onClose={()=>setShowBlockedToast(false)} router={router}/>
      )}

      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',position:'relative',zIndex:2}}>

        {/* Header */}
        <div style={{marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
            <div style={{height:1,width:32,background:`linear-gradient(90deg,transparent,${C.cyan})`}}/>
            <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:C.cyan,letterSpacing:3}}>// SQUADS</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:12}}>
            <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:28,fontWeight:900,color:'#fff',margin:0,textShadow:'0 0 30px rgba(239,68,68,0.25)'}}>Squad Hub</h1>
            <button onClick={handleCreateClick}
              style={{
                padding:'10px 22px', borderRadius:10,
                background: mySquad ? 'rgba(255,255,255,0.03)' : 'rgba(239,68,68,0.1)',
                border: mySquad ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(239,68,68,0.4)',
                color: mySquad ? '#334155' : C.red,
                fontFamily:"'Orbitron',sans-serif", fontSize:11, fontWeight:700, letterSpacing:1.5, cursor:'pointer',
                transition:'all .15s',
              }}>
              {mySquad ? '🔒 Create Squad' : '+ Create Squad'}
            </button>
          </div>
        </div>

        {/* 2-col layout */}
        <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:20,alignItems:'start'}}>

          {/* Sidebar */}
          <div style={{position:'sticky',top:120}}>
            {mySquadLoading ? (
              <div style={{background:C.card,border:'1px solid rgba(168,85,247,0.15)',borderRadius:14,padding:16,marginBottom:12,textAlign:'center'}}>
                <div style={{fontSize:10,color:'#334155',fontFamily:"'Share Tech Mono',monospace"}}>Loading...</div>
              </div>
            ) : mySquad ? (
              <>
                <AlreadyInSquadBanner mySquad={mySquad} router={router}/>
                <HasSquadPanel mySquad={mySquad} router={router}/>
              </>
            ) : (
              <NoSquadPanel router={router}/>
            )}
            <RankingsPanel/>
          </div>

          {/* Main grid */}
          <div>
            {/* Filters */}
            <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search squad name or tag..." style={{...selectStyle,flex:1,minWidth:160}}/>
              {['','Free Fire','BGMI','Valorant'].map(g=>{
                const gc={'Free Fire':C.red,'BGMI':C.orange,'Valorant':C.purple,'':C.cyan}[g];
                const active=filter.game===g;
                return(
                  <button key={g||'all'} onClick={()=>setFilter({...filter,game:g})} style={{padding:'7px 14px',borderRadius:20,fontSize:11,fontFamily:"'Share Tech Mono',monospace",cursor:'pointer',background:active?gc+'22':'transparent',border:`1px solid ${active?gc+'55':'rgba(255,255,255,0.08)'}`,color:active?gc:'#475569',transition:'all .15s'}}>
                    {g||'All Games'}
                  </button>
                );
              })}
              <select value={filter.region} onChange={e=>setFilter({...filter,region:e.target.value})} style={selectStyle}>
                <option value="">All Regions</option>
                <option value="India">India</option>
                <option value="Global">Global</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Americas">Americas</option>
              </select>
            </div>

            {/* Note when user has squad */}
            {mySquad && (
              <div style={{marginBottom:14,padding:'10px 14px',borderRadius:10,background:'rgba(251,191,36,0.04)',border:'1px solid rgba(251,191,36,0.15)',fontSize:11,color:'rgba(251,191,36,0.5)',fontFamily:"'Share Tech Mono',monospace",display:'flex',alignItems:'center',gap:8}}>
                <span>⚠</span>
                <span>You are already in <strong style={{color:'rgba(251,191,36,0.8)'}}>{mySquad.name}</strong>. Leave or delete it first to join another squad.</span>
              </div>
            )}

            {filtered.length===0 ? (
              <div style={{textAlign:'center',padding:'80px 0'}}>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:40,color:'rgba(239,68,68,0.15)',marginBottom:16}}>⬡</div>
                <div style={{fontSize:14,color:'#334155',fontFamily:"'Share Tech Mono',monospace",marginBottom:8}}>No squads found</div>
                {!mySquad && (
                  <button onClick={()=>router.push('/squads/create')} style={{padding:'10px 24px',borderRadius:10,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.35)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:11,cursor:'pointer',letterSpacing:1}}>
                    + Create Squad
                  </button>
                )}
              </div>
            ) : (
              <>
                <div style={{fontSize:11,color:'#334155',fontFamily:"'Share Tech Mono',monospace",marginBottom:14}}>{filtered.length} squad{filtered.length!==1?'s':''} found</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16}}>
                  {filtered.map(s=>(
                    <SquadCard key={s.id} squad={s} mySquad={mySquad}
                      onBlockedClick={()=>setShowBlockedToast(true)}/>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}