'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

const C = {
  red:'#ef4444', cyan:'#00ffff', purple:'#a855f7',
  gold:'#fbbf24', green:'#00ff88', orange:'#f97316',
  bg:'#050510', card:'#0a0a1a', card2:'#0d0d20',
};

function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const pts = Array.from({length:55},()=>({
      x:Math.random()*c.width, y:Math.random()*c.height,
      vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      r:Math.random()*1.4+.4,
      col:[C.cyan,C.purple,C.red][Math.floor(Math.random()*3)],
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=c.width; if(p.x>c.width)p.x=0;
        if(p.y<0)p.y=c.height; if(p.y>c.height)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.col+'55'; ctx.fill();
      });
      pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<90){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(0,255,255,${.05*(1-d/90)})`;ctx.lineWidth=.4;ctx.stroke();}
      }));
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}}/>;
}

function ScanLine() {
  const [y,setY]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setY(p=>(p+.35)%110),18);return()=>clearInterval(id);},[]);
  return <div style={{position:'fixed',top:`${y}%`,left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,rgba(0,255,255,0.13),rgba(239,68,68,0.18),transparent)',zIndex:1,pointerEvents:'none'}}/>;
}

function Badge({children,color=C.cyan,small}){
  return <span style={{display:'inline-flex',alignItems:'center',gap:3,fontSize:small?9:10,fontWeight:600,padding:small?'2px 7px':'3px 10px',borderRadius:20,fontFamily:"'Share Tech Mono',monospace",background:color+'18',color,border:`1px solid ${color}40`}}>{children}</span>;
}

function SectionHead({label,right}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
      <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,letterSpacing:3,color:C.cyan,fontWeight:700,whiteSpace:'nowrap'}}>{label}</span>
      <div style={{flex:1,height:1,background:'linear-gradient(90deg,rgba(0,255,255,0.3),transparent)'}}/>
      {right}
    </div>
  );
}

function Corners({color='rgba(239,68,68,0.45)'}){
  const s={position:'absolute',width:10,height:10};
  return(<>
    <div style={{...s,top:7,left:7,borderTop:`1.5px solid ${color}`,borderLeft:`1.5px solid ${color}`}}/>
    <div style={{...s,top:7,right:7,borderTop:`1.5px solid ${color}`,borderRight:`1.5px solid ${color}`}}/>
  </>);
}

function StatBox({val,lbl,color,delay=0}){
  const [show,setShow]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setShow(true),delay);return()=>clearTimeout(t);},[delay]);
  return(
    <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(0,255,255,0.07)',borderRadius:12,padding:'13px 8px',textAlign:'center',position:'relative',overflow:'hidden',opacity:show?1:0,transform:show?'translateY(0)':'translateY(10px)',transition:'opacity .5s ease,transform .5s ease'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${color}50,transparent)`}}/>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:20,fontWeight:900,color,lineHeight:1}}>{val}</div>
      <div style={{fontSize:10,color:'#475569',fontFamily:"'Share Tech Mono',monospace",marginTop:4,letterSpacing:.5}}>{lbl}</div>
    </div>
  );
}

function XpBar({current,max,level}){
  const [w,setW]=useState(0);
  useEffect(()=>{setTimeout(()=>setW((current/max)*100),500);},[current,max]);
  return(
    <div style={{marginBottom:18}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#475569',fontFamily:"'Share Tech Mono',monospace",marginBottom:5}}>
        <span>Squad XP · Lv.{level}</span><span>{current.toLocaleString()} / {max.toLocaleString()}</span>
      </div>
      <div style={{height:6,background:'rgba(255,255,255,0.05)',borderRadius:3,border:'1px solid rgba(168,85,247,0.2)',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${w}%`,borderRadius:3,background:`linear-gradient(90deg,${C.purple},${C.cyan})`,transition:'width 1.4s cubic-bezier(.25,.46,.45,.94)'}}/>
      </div>
    </div>
  );
}

function MemberCard({member,isLeader,onClick}){
  const [hov,setHov]=useState(false);
  const name=member.users?.name||member.in_game_name||'Player';
  const initials=name.slice(0,2).toUpperCase();
  const roleColors={leader:C.gold,fragger:C.red,igl:C.purple,sniper:C.orange,support:C.cyan,sub:C.green};
  const roleColor=roleColors[member.role?.toLowerCase()]||C.cyan;
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:C.card2,borderRadius:14,padding:14,textAlign:'center',cursor:'pointer',position:'relative',overflow:'hidden',border:isLeader?`1px solid rgba(251,191,36,0.4)`:`1px solid rgba(0,255,255,${hov?.28:.07})`,transform:hov?'translateY(-3px)':'translateY(0)',transition:'all .2s ease'}}>
      {isLeader&&<div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${C.gold},${C.orange})`}}/>}
      {isLeader&&<div style={{position:'absolute',top:9,right:11,fontSize:13}}>♔</div>}
      <div style={{width:46,height:46,borderRadius:'50%',margin:'0 auto 8px',background:roleColor+'22',border:`1.5px solid ${roleColor}50`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:900,color:roleColor}}>{initials}</div>
      <div style={{fontSize:13,fontWeight:600,color:'#e2e8f0',fontFamily:"'Rajdhani',sans-serif",marginBottom:5}}>{name}</div>
      <div style={{marginBottom:6,display:'flex',gap:4,justifyContent:'center',flexWrap:'wrap'}}>
        <Badge color={roleColor} small>{member.role||'Member'}</Badge>
        {isLeader&&<Badge color={C.gold} small>Leader</Badge>}
      </div>
      {member.in_game_name&&<div style={{fontSize:10,color:'#475569',fontFamily:"'Share Tech Mono',monospace",marginBottom:4}}>IGN: {member.in_game_name}</div>}
      <div style={{fontSize:10,color:'#334155',fontFamily:"'Share Tech Mono',monospace"}}>Joined {new Date(member.joined_at).toLocaleDateString()}</div>
      <button style={{marginTop:10,width:'100%',padding:'5px 0',borderRadius:8,background:'rgba(0,255,255,0.06)',border:'1px solid rgba(0,255,255,0.18)',color:C.cyan,fontFamily:"'Share Tech Mono',monospace",fontSize:10,cursor:'pointer'}}>View Profile →</button>
    </div>
  );
}

function TournamentRow({t}){
  const pos=t.position;
  const medal=pos===1?'🥇':pos===2?'🥈':pos===3?'🥉':null;
  const posColor=pos===1?C.gold:pos===2?'#94a3b8':pos===3?C.orange:C.cyan;
  return(
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:C.card2,border:'1px solid rgba(0,255,255,0.07)',borderRadius:12,padding:'12px 16px',marginBottom:8,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:2,background:posColor+'80'}}/>
      <div style={{paddingLeft:8}}>
        <div style={{fontSize:13,fontWeight:600,color:'#e2e8f0',fontFamily:"'Rajdhani',sans-serif"}}>{t.tournaments?.name||'Tournament'}</div>
        <div style={{fontSize:11,color:'#475569',fontFamily:"'Share Tech Mono',monospace",marginTop:2}}>{t.tournaments?.game} · {t.tournament_date?new Date(t.tournament_date).toLocaleDateString():'—'}</div>
      </div>
      <div style={{textAlign:'right'}}>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:900,color:posColor}}>{medal||`#${pos}`}</div>
        <div style={{fontSize:10,color:'#475569',fontFamily:"'Share Tech Mono',monospace",marginTop:2}}>{t.total_points} pts · {t.total_kills} kills</div>
      </div>
    </div>
  );
}

export default function SquadProfilePage() {
  const router = useRouter();
  const params = useParams();
  const squadId = params.id;
  const [squad, setSquad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => { fetchSquad(); }, [squadId]);

  const fetchSquad = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      const res = await fetch(`http://localhost:3001/api/squads/${squadId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSquad(data);
        const userId = localStorage.getItem('userId');
        const leader = data.squad_members?.find(m => m.role === 'leader' && m.user_id === userId);
        setIsLeader(!!leader);
      } else { router.push('/squads'); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this squad? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/squads/${squadId}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) { alert('Squad deleted'); router.push('/squads'); }
      else alert('Failed to delete squad');
    } catch { alert('Error deleting squad'); }
  };

  if (loading) return (
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;600&family=Share+Tech+Mono&display=swap');`}</style>
      <div style={{width:48,height:48,border:`3px solid rgba(239,68,68,0.2)`,borderTopColor:C.red,borderRadius:'50%',animation:'spin .8s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!squad) return null;

  const activeMembers = squad.squad_members?.filter(m => m.is_active).sort((a,b)=>a.role==='leader'?-1:1)||[];
  const openSlots = Math.max(0, 7 - activeMembers.length);
  const winRate = squad.total_tournaments > 0 ? Math.round((squad.total_wins / squad.total_tournaments) * 100) : 0;
  const [xpCurrent, xpMax, squadLevel] = [6800, 10000, 12]; // replace with real squad XP when available

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:'#e2e8f0',paddingTop:104,paddingBottom:60,position:'relative',fontFamily:"'Rajdhani',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;600&family=Share+Tech+Mono&display=swap');
        @keyframes rgbshift{0%{border-color:#ef4444}33%{border-color:#a855f7}66%{border-color:#00ffff}100%{border-color:#ef4444}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes pulse2{0%,100%{opacity:1}50%{opacity:.3}}
        *{box-sizing:border-box}
      `}</style>

      <ParticleCanvas/>
      <ScanLine/>

      {/* Cyber grid */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',backgroundImage:'linear-gradient(rgba(0,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.025) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>

      <div style={{maxWidth:900,margin:'0 auto',padding:'0 20px',position:'relative',zIndex:2}}>

        {/* ── BANNER ── */}
        <div style={{borderRadius:'16px 16px 0 0',overflow:'hidden',position:'relative',height:140,background:C.bg}}>
          <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.04) 1px,transparent 1px)',backgroundSize:'30px 30px'}}/>
          <div style={{position:'absolute',top:-50,left:'20%',width:220,height:160,background:'radial-gradient(ellipse,rgba(239,68,68,0.18) 0%,transparent 70%)'}}/>
          <div style={{position:'absolute',top:-50,right:'15%',width:180,height:160,background:'radial-gradient(ellipse,rgba(0,255,255,0.1) 0%,transparent 70%)'}}/>
          {/* Rainbow top line */}
          <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#00ff88,#00ffff,#a855f7,#ec4899,#ef4444)',backgroundSize:'200% 100%',animation:'shimmer 3s linear infinite'}}/>
          <div style={{position:'absolute',top:14,left:20,fontFamily:"'Orbitron',sans-serif",fontSize:10,color:'rgba(0,255,255,0.55)',letterSpacing:2}}>// SQUAD PROFILE //</div>
          {/* Status badges */}
          <div style={{position:'absolute',top:14,right:14,display:'flex',gap:6,flexWrap:'wrap'}}>
            <Badge color={C.green}>● Open · {activeMembers.length}/7</Badge>
            <Badge color={C.red}>{squad.game}</Badge>
            {squad.region&&<Badge color={C.purple}>{squad.region}</Badge>}
          </div>
          {/* Avatar */}
          <div style={{position:'absolute',bottom:-34,left:22,width:68,height:68,borderRadius:'50%',background:'linear-gradient(135deg,#1a0a2e,#2d1060)',border:`2px solid ${C.purple}`,animation:'rgbshift 3s linear infinite',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:20,fontWeight:900,color:'#fff',zIndex:5}}>
            {(squad.tag||squad.name||'?').slice(0,2).toUpperCase()}
          </div>
        </div>

        {/* ── MAIN BODY ── */}
        <div style={{background:C.card,border:'1px solid rgba(0,255,255,0.07)',borderTop:'none',borderRadius:'0 0 16px 16px',padding:'48px 24px 28px',position:'relative'}}>
          <Corners/>

          {/* Name + action row */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4,flexWrap:'wrap',gap:10}}>
            <div>
              <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:900,color:'#fff',letterSpacing:1,margin:0,textShadow:'0 0 24px rgba(239,68,68,0.3)'}}>
                {squad.name} <span style={{color:'rgba(0,255,255,0.4)',fontSize:13,fontWeight:400}}>[{squad.tag}]</span>
              </h1>
              {squad.bio&&<p style={{fontSize:12,color:'#475569',fontFamily:"'Share Tech Mono',monospace",margin:'5px 0 0',maxWidth:500}}>{squad.bio}</p>}
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              <Badge color={C.purple}>Lv.{squadLevel}</Badge>
              <Badge color={C.gold}>ELO {squad.elo_rating}</Badge>
              {isLeader&&(
                <>
                  <button onClick={()=>router.push(`/squads/${squadId}/edit`)} style={{padding:'4px 12px',borderRadius:8,background:'rgba(0,255,255,0.07)',border:'1px solid rgba(0,255,255,0.25)',color:C.cyan,cursor:'pointer',fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:1}}>Edit</button>
                  <button onClick={handleDelete} style={{padding:'4px 12px',borderRadius:8,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.3)',color:C.red,cursor:'pointer',fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:1}}>Delete</button>
                </>
              )}
            </div>
          </div>

          {/* XP Bar */}
          <div style={{marginTop:18}}><XpBar current={xpCurrent} max={xpMax} level={squadLevel}/></div>

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:10,marginBottom:26}}>
            <StatBox val={squad.elo_rating} lbl="ELO Rating" color={C.red} delay={100}/>
            <StatBox val={squad.total_wins} lbl="Total Wins" color={C.green} delay={200}/>
            <StatBox val={squad.total_tournaments} lbl="Tournaments" color={C.cyan} delay={300}/>
            <StatBox val={`${winRate}%`} lbl="Win Rate" color={C.gold} delay={400}/>
          </div>

          {/* ── MEMBERS ── */}
          <SectionHead label="// Members" right={
            <div style={{display:'flex',gap:6,alignItems:'center'}}>
              <span style={{fontSize:10,color:'#475569',fontFamily:"'Share Tech Mono',monospace"}}>{activeMembers.length}/7 slots</span>
              {isLeader&&<button style={{padding:'3px 10px',borderRadius:6,background:'rgba(0,255,255,0.06)',border:'1px solid rgba(0,255,255,0.2)',color:C.cyan,cursor:'pointer',fontFamily:"'Share Tech Mono',monospace",fontSize:10}}>+ Invite</button>}
            </div>
          }/>

          {activeMembers.length>0?(
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginBottom:26}}>
              {activeMembers.map((m,i)=>(
                <MemberCard key={m.id} member={m} isLeader={m.role==='leader'}
                  onClick={()=>router.push(`/profile/${m.user_id}`)}/>
              ))}
              {Array.from({length:openSlots}).map((_,i)=>(
                <div key={`open-${i}`} style={{background:'rgba(255,255,255,0.01)',border:'1px dashed rgba(255,255,255,0.08)',borderRadius:14,padding:14,textAlign:'center'}}>
                  <div style={{width:46,height:46,borderRadius:'50%',margin:'0 auto 8px',background:'rgba(255,255,255,0.02)',border:'1px dashed rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,color:'rgba(255,255,255,0.12)'}}>+</div>
                  <div style={{fontSize:11,color:'#334155',fontFamily:"'Share Tech Mono',monospace",marginBottom:8}}>Open Slot</div>
                  <button onClick={()=>router.push(`/squads/${squadId}/apply`)} style={{width:'100%',padding:'5px 0',borderRadius:8,background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.22)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1}}>Apply →</button>
                </div>
              ))}
            </div>
          ):(
            <div style={{textAlign:'center',padding:'32px 0',color:'#334155',fontFamily:"'Share Tech Mono',monospace",fontSize:12,marginBottom:26}}>No active members yet</div>
          )}

          {/* ── TOURNAMENT HISTORY ── */}
          <SectionHead label="// Tournament History" right={
            squad.squad_tournaments?.length>0&&<Badge color={C.gold} small>{squad.squad_tournaments.length} played</Badge>
          }/>

          {squad.squad_tournaments?.length>0?(
            <div style={{marginBottom:26}}>
              {squad.squad_tournaments.map((t,i)=><TournamentRow key={t.id||i} t={t}/>)}
            </div>
          ):(
            <div style={{textAlign:'center',padding:'32px 0',marginBottom:26,background:'rgba(255,255,255,0.01)',border:'1px solid rgba(0,255,255,0.05)',borderRadius:12}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:28,marginBottom:10,color:'rgba(251,191,36,0.25)'}}>⬡</div>
              <div style={{fontSize:12,color:'#334155',fontFamily:"'Share Tech Mono',monospace"}}>No tournament history yet</div>
              <div style={{fontSize:11,color:'#1e293b',fontFamily:"'Share Tech Mono',monospace",marginTop:4}}>Enter tournaments to build your record</div>
            </div>
          )}

          {/* ── PRIZE MONEY ── */}
          {squad.total_prize_money>0&&(
            <div style={{background:'rgba(251,191,36,0.04)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:12,padding:'14px 18px',marginBottom:26,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,color:C.gold,letterSpacing:2}}>// Total Prize Earned</div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:900,color:C.gold}}>₹{Number(squad.total_prize_money).toLocaleString()}</div>
            </div>
          )}

          {/* ── ACTION ROW ── */}
          <div style={{display:'flex',gap:10,marginTop:8}}>
            {!isLeader&&(
              <button onClick={()=>router.push(`/squads/${squadId}/apply`)} style={{flex:1,padding:'11px 0',borderRadius:10,cursor:'pointer',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.4)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,letterSpacing:1.5}}>Apply to Join Squad</button>
            )}
            <button onClick={()=>router.push(`/chat`)} style={{flex:1,padding:'11px 0',borderRadius:10,cursor:'pointer',background:'rgba(0,255,255,0.05)',border:'1px solid rgba(0,255,255,0.2)',color:C.cyan,fontFamily:"'Orbitron',sans-serif",fontSize:10,letterSpacing:1.5}}>Open Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}