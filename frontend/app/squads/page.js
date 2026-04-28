'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  red:'#ef4444', cyan:'#00ffff', purple:'#a855f7',
  gold:'#fbbf24', green:'#22d3ee', orange:'#f97316',
  bg:'#030308', card:'#07070f', card2:'#0b0b18',
  border:'rgba(0,255,255,0.08)', text:'#e2e8f0',
  muted:'#334155', dim:'#1e293b',
};
const GAME_COLOR = { 'Free Fire':C.red, 'BGMI':C.orange, 'Valorant':C.purple };
function hexToRgb(h){ const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`${r},${g},${b}`; }

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#030308!important;color:#e2e8f0;font-family:'Rajdhani',sans-serif;}
input,select{font-family:'Share Tech Mono',monospace;}
input::placeholder{color:#1e293b;}
select option{background:#07070f;}
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(0,255,255,0.15);border-radius:4px;}

@keyframes spin   {to{transform:rotate(360deg)}}
@keyframes scanY  {0%{top:-2%}100%{top:102%}}
@keyframes pulse  {0%,100%{opacity:0.3}50%{opacity:1}}
@keyframes fadeUp {from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes float  {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

@keyframes rbBorder{
  0%  {border-color:#ff2222;box-shadow:0 0 16px rgba(255,34,34,.55),0 0 32px rgba(255,34,34,.15);}
  14% {border-color:#ff8800;box-shadow:0 0 16px rgba(255,136,0,.55),0 0 32px rgba(255,136,0,.15);}
  28% {border-color:#ffe600;box-shadow:0 0 16px rgba(255,230,0,.55),0 0 32px rgba(255,230,0,.15);}
  42% {border-color:#00ff44;box-shadow:0 0 16px rgba(0,255,68,.55), 0 0 32px rgba(0,255,68,.15);}
  57% {border-color:#00ffff;box-shadow:0 0 16px rgba(0,255,255,.55),0 0 32px rgba(0,255,255,.15);}
  71% {border-color:#0088ff;box-shadow:0 0 16px rgba(0,136,255,.55),0 0 32px rgba(0,136,255,.15);}
  85% {border-color:#cc00ff;box-shadow:0 0 16px rgba(204,0,255,.55),0 0 32px rgba(204,0,255,.15);}
  100%{border-color:#ff2222;box-shadow:0 0 16px rgba(255,34,34,.55),0 0 32px rgba(255,34,34,.15);}
}
@keyframes rbText{
  0%  {color:#ff4444;} 14%{color:#ff8800;} 28%{color:#ffee00;}
  42% {color:#44ff88;} 57%{color:#00ffff;} 71%{color:#44aaff;}
  85% {color:#cc44ff;} 100%{color:#ff4444;}
}
@keyframes rbBg{
  0%  {background:rgba(255,34,34,.12);}  14%{background:rgba(255,136,0,.12);}
  28% {background:rgba(255,230,0,.09);}  42%{background:rgba(0,255,68,.09);}
  57% {background:rgba(0,255,255,.09);}  71%{background:rgba(0,100,255,.12);}
  85% {background:rgba(180,0,255,.12);} 100%{background:rgba(255,34,34,.12);}
}
@keyframes rbBar{0%{background-position:0% 50%}100%{background-position:200% 50%}}

.rb-btn{
  animation:rbBorder 2.5s linear infinite,rbBg 2.5s linear infinite;
  border-width:1.5px!important;border-style:solid!important;
}
.rb-btn:hover{transform:translateY(-2px) scale(1.04)!important;}
.rb-btn .rb-text{animation:rbText 2.5s linear infinite;}
.rb-bar{
  background:linear-gradient(90deg,#ff0000,#ff8800,#ffff00,#00ff88,#00ffff,#0088ff,#cc00ff,#ff0000);
  background-size:200% 100%;
  animation:rbBar 2.5s linear infinite;
}
.sq-card{animation:fadeUp .32s ease both;}
.sq-card:nth-child(1){animation-delay:.03s} .sq-card:nth-child(2){animation-delay:.07s}
.sq-card:nth-child(3){animation-delay:.11s} .sq-card:nth-child(4){animation-delay:.15s}
.sq-card:nth-child(5){animation-delay:.19s} .sq-card:nth-child(6){animation-delay:.23s}
`;

// ── Particle stars ────────────────────────────────────────────────────────────
function StarField(){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c)return;
    const ctx=c.getContext('2d');
    const resize=()=>{c.width=window.innerWidth;c.height=window.innerHeight;};
    resize(); window.addEventListener('resize',resize);
    const COLS=['#ff4444','#ff8800','#ffff44','#44ff88','#00ffff','#4488ff','#cc44ff','#ff44aa','#ffffff','#ffffff'];
    const stars=Array.from({length:170},()=>({
      x:Math.random()*window.innerWidth,
      y:Math.random()*window.innerHeight,
      r:Math.random()*1.7+0.3,
      col:COLS[Math.floor(Math.random()*COLS.length)],
      phase:Math.random()*Math.PI*2,
      speed:Math.random()*0.007+0.002,
      vx:(Math.random()-.5)*0.16,
      vy:(Math.random()-.5)*0.16,
    }));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      const now=Date.now()*0.001;
      stars.forEach(s=>{
        s.x+=s.vx; s.y+=s.vy;
        if(s.x<0)s.x=c.width; if(s.x>c.width)s.x=0;
        if(s.y<0)s.y=c.height; if(s.y>c.height)s.y=0;
        const alpha=0.1+0.8*Math.abs(Math.sin(now*s.speed*60+s.phase));
        ctx.beginPath();
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=s.col+(Math.round(alpha*255).toString(16).padStart(2,'0'));
        ctx.fill();
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}}/>;
}

function RainbowBar(){
  return <div className="rb-bar" style={{position:'fixed',top:0,left:0,right:0,height:3,zIndex:100,pointerEvents:'none'}}/>;
}

function ScanLine(){
  return(
    <div style={{position:'fixed',inset:0,zIndex:1,pointerEvents:'none',overflow:'hidden'}}>
      <div style={{position:'absolute',left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(0,255,255,0.07),rgba(168,85,247,0.1),transparent)',animation:'scanY 8s linear infinite'}}/>
    </div>
  );
}

function HexBg(){
  return(
    <svg style={{position:'fixed',inset:0,width:'100%',height:'100%',opacity:.03,zIndex:0,pointerEvents:'none'}} xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="hx" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
        <polygon points="28,2 54,16 54,42 28,56 2,42 2,16" fill="none" stroke="#00ffff" strokeWidth=".5"/>
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#hx)"/>
    </svg>
  );
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({data=[],color=C.cyan,height=28}){
  if(!data.length)return null;
  const VW=200,VH=40,n=data.length;
  const mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1;
  const xOf=i=>n===1?VW/2:(i/(n-1))*VW;
  const yOf=v=>VH-(((v-mn)/rng)*(VH-6)+3);
  const pts=data.map((v,i)=>`${xOf(i)},${yOf(v)}`).join(' ');
  const gid=`sg${color.replace('#','')}`;
  return(
    <div style={{width:'100%',height,overflow:'visible'}}>
      <svg width="100%" height={height} viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" style={{overflow:'visible'}}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity=".3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={`0,${VH} ${pts} ${VW},${VH}`} fill={`url(#${gid})`}/>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
        <circle cx={xOf(n-1)} cy={yOf(data[n-1])} r="3" fill={color} vectorEffect="non-scaling-stroke" style={{filter:`drop-shadow(0 0 4px ${color})`}}/>
      </svg>
    </div>
  );
}

function Badge({children,color=C.cyan,size=10}){
  return <span style={{display:'inline-flex',alignItems:'center',gap:3,fontSize:size,fontWeight:700,padding:'2px 8px',borderRadius:20,fontFamily:"'Share Tech Mono',monospace",background:`rgba(${hexToRgb(color)},.12)`,color,border:`1px solid rgba(${hexToRgb(color)},.35)`,letterSpacing:.5}}>{children}</span>;
}
function GlowDot({color=C.cyan,size=6,pulse=false}){
  return <div style={{width:size,height:size,borderRadius:'50%',background:color,boxShadow:`0 0 6px ${color}`,animation:pulse?'pulse 2s ease-in-out infinite':undefined,flexShrink:0}}/>;
}
function StatBox({val,lbl,color}){
  return(
    <div style={{background:'rgba(255,255,255,0.02)',borderRadius:10,padding:'10px 4px',textAlign:'center',border:`1px solid rgba(${hexToRgb(color)},.1)`,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:`linear-gradient(90deg,transparent,${color}55,transparent)`}}/>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:17,fontWeight:900,color,lineHeight:1}}>{val}</div>
      <div style={{fontSize:8,color:C.muted,fontFamily:"'Share Tech Mono',monospace",marginTop:3,letterSpacing:.5}}>{lbl}</div>
    </div>
  );
}
function Avatars({members=[],max=5,size=26}){
  const active=members.filter(m=>m.is_active);
  const shown=active.slice(0,max),extra=active.length-max;
  return(
    <div style={{display:'flex',alignItems:'center'}}>
      {shown.map((m,i)=>(
        <div key={m.id||i} style={{width:size,height:size,borderRadius:'50%',background:`linear-gradient(135deg,${C.purple}33,${C.cyan}22)`,border:`1.5px solid ${C.card}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:size*.34,fontWeight:900,color:C.purple,marginLeft:i===0?0:-size*.3,zIndex:shown.length-i,flexShrink:0,boxShadow:`0 0 5px rgba(168,85,247,.3)`,position:'relative'}}>
          {(m.users?.name||'?').slice(0,1).toUpperCase()}
          {m.role==='leader'&&<div style={{position:'absolute',bottom:-2,right:-2,width:8,height:8,borderRadius:'50%',background:C.gold,border:`1.5px solid ${C.card}`,fontSize:5,display:'flex',alignItems:'center',justifyContent:'center'}}>♔</div>}
        </div>
      ))}
      {extra>0&&<div style={{width:size,height:size,borderRadius:'50%',background:'rgba(255,255,255,0.04)',border:`1.5px solid ${C.card}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:C.muted,marginLeft:-size*.3}}>+{extra}</div>}
    </div>
  );
}

// ── LEFT PANEL ────────────────────────────────────────────────────────────────
function LeftPanel({mySquad,mySquadLoading,router}){
  const gc=GAME_COLOR[mySquad?.game]||C.cyan;
  const active=mySquad?.squad_members?.filter(m=>m.is_active)||[];
  const isLeader=mySquad?._isLeader;
  const [confirmLeave,setConfirmLeave]=useState(false);
  const [leaving,setLeaving]=useState(false);
  const doLeave=async()=>{
    setLeaving(true);
    try{const t=localStorage.getItem('token');const r=await fetch(`http://localhost:3001/api/squads/${mySquad.id}/leave`,{method:'POST',headers:{Authorization:`Bearer ${t}`}});if(r.ok)window.location.reload();else{const d=await r.json();alert(d.error||'Failed');}}
    catch{alert('Error');}finally{setLeaving(false);setConfirmLeave(false);}
  };
  const doDelete=async()=>{
    if(!confirm(`Delete "${mySquad.name}" permanently?`))return;
    try{const t=localStorage.getItem('token');await fetch(`http://localhost:3001/api/squads/${mySquad.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${t}`}});window.location.reload();}catch{alert('Error');}
  };
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12,position:'sticky',top:88}}>
      <div style={{padding:'14px 16px',background:C.card,border:`1px solid rgba(168,85,247,.2)`,borderRadius:14,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,#a855f7,#00ffff,transparent)'}}/>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% -20%,rgba(168,85,247,.06) 0%,transparent 65%)',pointerEvents:'none'}}/>
        <div style={{position:'relative'}}>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'rgba(168,85,247,.55)',letterSpacing:3,marginBottom:14}}>// CONTROL CENTER</div>
          {mySquadLoading?(
            <div style={{textAlign:'center',padding:'20px 0'}}><div style={{width:24,height:24,border:`2px solid rgba(0,255,255,.15)`,borderTopColor:C.cyan,borderRadius:'50%',animation:'spin .7s linear infinite',margin:'0 auto'}}/></div>
          ):mySquad?(
            <>
              <div style={{display:'flex',gap:11,alignItems:'center',marginBottom:14}}>
                <div style={{width:50,height:50,borderRadius:12,flexShrink:0,background:`linear-gradient(135deg,${gc}22,${gc}08)`,border:`2px solid ${gc}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:900,color:gc,boxShadow:`0 0 18px ${gc}22`,position:'relative'}}>
                  {(mySquad.tag||mySquad.name||'?').slice(0,3).toUpperCase()}
                  {isLeader&&<div style={{position:'absolute',top:-6,right:-6,fontSize:11,filter:'drop-shadow(0 0 4px gold)'}}>♔</div>}
                </div>
                <div>
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:900,color:'#fff',marginBottom:4}}>{mySquad.name}</div>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    <Badge color={gc}>{mySquad.game}</Badge>
                    {mySquad.region&&<Badge color={C.purple}>{mySquad.region}</Badge>}
                  </div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5,marginBottom:12}}>
                <StatBox val={mySquad.elo_rating||'—'} lbl="ELO" color={C.red}/>
                <StatBox val={mySquad.total_wins||0} lbl="WINS" color={C.green}/>
                <StatBox val={`${active.length}/7`} lbl="ROSTER" color={C.purple}/>
              </div>
              <div style={{marginBottom:12,padding:'9px 11px',background:'rgba(255,255,255,0.02)',borderRadius:10,border:`1px solid ${C.border}`}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <span style={{fontSize:9,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>ELO TREND</span>
                  <span style={{fontSize:9,color:C.green,fontFamily:"'Share Tech Mono',monospace"}}>▲ +2.4%</span>
                </div>
                <Sparkline data={[960,990,980,1030,1025,1060,1075,1070,1095,1120]} color={C.cyan} height={32}/>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:9,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1,marginBottom:7}}>ROSTER ({active.length})</div>
                <div style={{display:'flex',flexDirection:'column',gap:4}}>
                  {active.slice(0,4).map(m=>(
                    <div key={m.id} style={{display:'flex',alignItems:'center',gap:7,padding:'5px 8px',borderRadius:8,background:'rgba(255,255,255,0.02)',border:`1px solid rgba(255,255,255,.04)`}}>
                      <div style={{width:22,height:22,borderRadius:'50%',background:`${C.purple}22`,border:`1px solid ${C.purple}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:900,color:C.purple,flexShrink:0}}>
                        {(m.users?.name||'?').slice(0,1).toUpperCase()}
                      </div>
                      <span style={{fontSize:11,color:'#94a3b8',fontFamily:"'Rajdhani',sans-serif",flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.users?.name||'Unknown'}</span>
                      <GlowDot color={m.role==='leader'?C.gold:C.green} size={5} pulse={m.role==='leader'}/>
                    </div>
                  ))}
                  {active.length>4&&<div style={{fontSize:9,color:C.dim,fontFamily:"'Share Tech Mono',monospace",textAlign:'center',padding:'3px 0'}}>+{active.length-4} more</div>}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:5}}>
                <button onClick={()=>router.push(`/squads/${mySquad.id}`)} style={{padding:'8px 0',borderRadius:9,background:`rgba(${hexToRgb(gc)},.1)`,border:`1px solid rgba(${hexToRgb(gc)},.35)`,color:gc,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1,fontWeight:700}}>View Squad →</button>
                <button onClick={()=>router.push(`/squads/${mySquad.id}/edit`)} style={{padding:'8px 0',borderRadius:9,background:'rgba(0,255,255,.05)',border:'1px solid rgba(0,255,255,.18)',color:C.cyan,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1}}>Manage Squad</button>
                {!confirmLeave?(
                  <button onClick={()=>isLeader?doDelete():setConfirmLeave(true)} style={{padding:'8px 0',borderRadius:9,background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.2)',color:'rgba(239,68,68,.6)',fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1}}>
                    {isLeader?'Delete Squad':'Leave Squad'}
                  </button>
                ):(
                  <div style={{display:'flex',gap:5}}>
                    <button onClick={doLeave} disabled={leaving} style={{flex:1,padding:'7px 0',borderRadius:8,background:'rgba(239,68,68,.12)',border:'1px solid rgba(239,68,68,.35)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',opacity:leaving?.5:1}}>{leaving?'...':'Confirm'}</button>
                    <button onClick={()=>setConfirmLeave(false)} style={{flex:1,padding:'7px 0',borderRadius:8,background:'rgba(255,255,255,.03)',border:`1px solid ${C.border}`,color:C.muted,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer'}}>Cancel</button>
                  </div>
                )}
              </div>
            </>
          ):(
            <div style={{textAlign:'center',padding:'10px 0'}}>
              <div style={{fontSize:30,marginBottom:10,opacity:.1,animation:'float 3s ease-in-out infinite'}}>⬡</div>
              <div style={{fontSize:10,color:C.dim,fontFamily:"'Share Tech Mono',monospace",marginBottom:16,lineHeight:1.7}}>No squad yet.<br/>Create or join one.</div>
              <button onClick={()=>router.push('/squads/create')} style={{width:'100%',padding:'10px 0',borderRadius:10,background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.4)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:700,cursor:'pointer',letterSpacing:1}}>+ Create Squad</button>
            </div>
          )}
        </div>
      </div>
      <div style={{padding:'14px 16px',background:C.card,border:`1px solid rgba(251,191,36,.12)`,borderRadius:14,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:'linear-gradient(90deg,#fbbf24,#f97316,transparent)'}}/>
        <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'rgba(251,191,36,.5)',letterSpacing:3,marginBottom:11}}>// PLATFORM</div>
        {[{lbl:'Active Squads',val:'247',color:C.cyan},{lbl:'Players Online',val:'1,892',color:C.green},{lbl:'Live Tournaments',val:'12',color:C.red}].map(s=>(
          <div key={s.lbl} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:`1px solid ${C.border}`}}>
            <span style={{fontSize:11,color:C.muted,fontFamily:"'Rajdhani',sans-serif",fontWeight:500}}>{s.lbl}</span>
            <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:900,color:s.color}}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RIGHT PANEL ───────────────────────────────────────────────────────────────
function RightPanel({squads,selectedSquad,compareSquad,mode,onSelect,onCompareSet,onMode,mySquad,router}){
  if(mode==='leaderboard') return(
    <div style={{display:'flex',flexDirection:'column',gap:12,position:'sticky',top:88}}>
      <div style={{padding:'14px 16px',background:C.card,border:`1px solid rgba(251,191,36,.15)`,borderRadius:14,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,#fbbf24,#f97316,#ef4444,transparent)'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'rgba(251,191,36,.55)',letterSpacing:3}}>// LEADERBOARD</span>
          <Badge color={C.gold} size={9}>ELO RANKED</Badge>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {[...squads].sort((a,b)=>(b.elo_rating||0)-(a.elo_rating||0)).slice(0,9).map((sq,i)=>{
            const gc=GAME_COLOR[sq.game]||C.cyan;
            const isTop3=i<3;
            const rk=[C.gold,'#94a3b8','#cd7c3f'][i]||C.muted;
            return(
              <div key={sq.id} onClick={()=>{onSelect(sq);onMode('profile');}}
                style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:10,cursor:'pointer',background:isTop3?`rgba(${hexToRgb(rk)},.05)`:'rgba(255,255,255,.02)',border:`1px solid ${isTop3?`rgba(${hexToRgb(rk)},.18)`:C.border}`,transition:'all .15s',position:'relative',overflow:'hidden'}}>
                {isTop3&&<div style={{position:'absolute',top:0,left:0,bottom:0,width:'2px',background:rk}}/>}
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:900,color:rk,width:22,textAlign:'center',flexShrink:0}}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}</div>
                <div style={{width:26,height:26,borderRadius:7,background:`${gc}18`,border:`1px solid ${gc}33`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:9,fontWeight:900,color:gc,flexShrink:0}}>{(sq.tag||sq.name).slice(0,2).toUpperCase()}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{sq.name}</div>
                  <div style={{fontSize:9,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>{sq.game}</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:900,color:C.red}}>{sq.elo_rating||'—'}</div>
                  <div style={{fontSize:8,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>ELO</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:12,padding:'7px 10px',borderRadius:9,background:'rgba(251,191,36,.04)',border:'1px solid rgba(251,191,36,.1)',textAlign:'center'}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:'rgba(251,191,36,.4)',letterSpacing:2}}>SEASON 1 — Q3 2026</div>
        </div>
      </div>
    </div>
  );

  if(mode==='profile'&&selectedSquad){
    const sq=selectedSquad,gc=GAME_COLOR[sq.game]||C.cyan;
    const mem=sq.squad_members?.filter(m=>m.is_active)||[];
    const wr=sq.total_tournaments>0?Math.round((sq.total_wins/sq.total_tournaments)*100):0;
    const isMe=mySquad?.id===sq.id;
    return(
      <div style={{display:'flex',flexDirection:'column',gap:12,position:'sticky',top:88}}>
        <div style={{padding:'16px',background:C.card,border:`1px solid ${gc}25`,borderRadius:14,position:'relative',overflow:'hidden',animation:'fadeUp .28s ease'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:`linear-gradient(90deg,${gc},${C.purple},transparent)`}}/>
          <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% -20%,${gc}07 0%,transparent 70%)`,pointerEvents:'none'}}/>
          <div style={{position:'relative'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
              <button onClick={()=>{onSelect(null);onMode('leaderboard');}} style={{padding:'4px 10px',borderRadius:7,background:'rgba(255,255,255,.04)',border:`1px solid ${C.border}`,color:C.muted,fontFamily:"'Share Tech Mono',monospace",fontSize:10,cursor:'pointer'}}>← Back</button>
              <button onClick={()=>onMode('compare')} style={{padding:'4px 10px',borderRadius:7,background:`rgba(${hexToRgb(C.purple)},.1)`,border:`1px solid rgba(${hexToRgb(C.purple)},.3)`,color:C.purple,fontFamily:"'Share Tech Mono',monospace",fontSize:10,cursor:'pointer'}}>Compare ⇌</button>
            </div>
            <div style={{display:'flex',gap:11,alignItems:'center',marginBottom:14}}>
              <div style={{width:54,height:54,borderRadius:14,background:`${gc}18`,border:`2px solid ${gc}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:15,fontWeight:900,color:gc,boxShadow:`0 0 22px ${gc}22`,flexShrink:0}}>{(sq.tag||sq.name).slice(0,3).toUpperCase()}</div>
              <div>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:14,fontWeight:900,color:'#fff',marginBottom:5}}>{sq.name}</div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  <Badge color={gc}>{sq.game}</Badge>
                  {sq.region&&<Badge color={C.purple}>{sq.region}</Badge>}
                  {isMe&&<Badge color={C.gold}>My Squad</Badge>}
                </div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:5,marginBottom:12}}>
              <StatBox val={sq.elo_rating||'—'} lbl="ELO" color={C.red}/>
              <StatBox val={sq.total_wins||0} lbl="WINS" color={C.green}/>
              <StatBox val={`${wr}%`} lbl="W-RATE" color={C.gold}/>
            </div>
            <div style={{marginBottom:12,padding:'9px 11px',background:'rgba(255,255,255,.02)',borderRadius:10,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:9,color:C.muted,fontFamily:"'Share Tech Mono',monospace",marginBottom:6}}>ELO HISTORY (30d)</div>
              <Sparkline data={[900,930,910,970,1010,995,1040,1055,1040,sq.elo_rating||1080]} color={gc} height={38}/>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:9,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1,marginBottom:7}}>MEMBERS · {mem.length}/7</div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {mem.map(m=>{
                  const rc={leader:C.gold,co_leader:C.orange,member:C.purple}[m.role]||C.purple;
                  return(
                    <div key={m.id} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 9px',borderRadius:9,background:'rgba(255,255,255,.02)',border:`1px solid rgba(255,255,255,.04)`}}>
                      <div style={{width:26,height:26,borderRadius:'50%',background:`${rc}22`,border:`1px solid ${rc}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:900,color:rc,flexShrink:0}}>{(m.users?.name||'?').slice(0,1).toUpperCase()}</div>
                      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,fontFamily:"'Rajdhani',sans-serif",color:'#cbd5e1'}}>{m.users?.name||'Unknown'}</div><div style={{fontSize:9,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>{m.role||'member'}</div></div>
                      <GlowDot color={rc} size={6}/>
                    </div>
                  );
                })}
              </div>
            </div>
            {!isMe?(
              <Link href={`/squads/${sq.id}`} style={{display:'block',textDecoration:'none'}}>
                <button style={{width:'100%',padding:'11px 0',borderRadius:10,background:`rgba(${hexToRgb(gc)},.12)`,border:`1px solid rgba(${hexToRgb(gc)},.4)`,color:gc,fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,cursor:'pointer',letterSpacing:1.5}}>View &amp; Apply →</button>
              </Link>
            ):(
              <button onClick={()=>router.push(`/squads/${sq.id}/edit`)} style={{width:'100%',padding:'11px 0',borderRadius:10,background:'rgba(0,255,255,.07)',border:'1px solid rgba(0,255,255,.25)',color:C.cyan,fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:700,cursor:'pointer',letterSpacing:1.5}}>Manage My Squad →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if(mode==='compare'){
    const sq1=selectedSquad,sq2=compareSquad;
    const metrics=[{key:'elo_rating',lbl:'ELO',color:C.red},{key:'total_wins',lbl:'Wins',color:C.green},{key:'total_tournaments',lbl:'Events',color:C.cyan}];
    return(
      <div style={{display:'flex',flexDirection:'column',gap:12,position:'sticky',top:88}}>
        <div style={{padding:'16px',background:C.card,border:`1px solid rgba(168,85,247,.2)`,borderRadius:14,position:'relative',overflow:'hidden',animation:'fadeUp .28s ease'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,#a855f7,#00ffff,#ef4444,transparent)'}}/>
          <div style={{position:'relative'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:'rgba(168,85,247,.55)',letterSpacing:3}}>// COMPARE</span>
              <button onClick={()=>onMode(sq1?'profile':'leaderboard')} style={{padding:'4px 10px',borderRadius:7,background:'rgba(255,255,255,.04)',border:`1px solid ${C.border}`,color:C.muted,fontFamily:"'Share Tech Mono',monospace",fontSize:10,cursor:'pointer'}}>← Back</button>
            </div>
            {!sq1?(
              <div style={{textAlign:'center',padding:'20px 0',fontSize:11,color:C.dim,fontFamily:"'Share Tech Mono',monospace"}}>Click a squad card first,<br/>then enter compare mode.</div>
            ):(
              <>
                <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:8,alignItems:'center',marginBottom:14}}>
                  {[sq1,sq2].map((sq,i)=>{
                    const gc=sq?GAME_COLOR[sq.game]||C.cyan:C.border;
                    return(
                      <div key={i} style={{textAlign:i===0?'left':'right'}}>
                        {sq?(<><div style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:900,color:gc,marginBottom:3}}>{sq.name}</div><Badge color={gc} size={9}>{sq.game}</Badge></>)
                           :(<div style={{fontSize:10,color:C.dim,fontFamily:"'Share Tech Mono',monospace"}}>{i===1?'← Pick a card':''}</div>)}
                      </div>
                    );
                  })}
                  <div style={{textAlign:'center',fontFamily:"'Orbitron',sans-serif",fontSize:16,color:C.muted}}>⇌</div>
                </div>
                {metrics.map(m=>{
                  const v1=sq1?.[m.key]||0,v2=sq2?.[m.key]||0,mx=Math.max(v1,v2,1);
                  return(
                    <div key={m.key} style={{marginBottom:11}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:900,color:v1>v2?m.color:'#475569'}}>{v1}</span>
                        <span style={{fontSize:9,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>{m.lbl}</span>
                        <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:900,color:v2>v1?m.color:'#475569'}}>{sq2?v2:'—'}</span>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 4px 1fr',gap:3,alignItems:'center'}}>
                        <div style={{height:4,borderRadius:4,background:C.dim,overflow:'hidden',transform:'scaleX(-1)'}}><div style={{height:'100%',width:`${(v1/mx)*100}%`,background:m.color,borderRadius:4,transition:'width .4s ease'}}/></div>
                        <div style={{height:4,background:C.border}}/>
                        <div style={{height:4,borderRadius:4,background:C.dim,overflow:'hidden'}}><div style={{height:'100%',width:`${sq2?(v2/mx)*100:0}%`,background:`${m.color}88`,borderRadius:4,transition:'width .4s ease'}}/></div>
                      </div>
                    </div>
                  );
                })}
                <div style={{marginTop:6,padding:'8px 10px',borderRadius:9,background:'rgba(168,85,247,.04)',border:`1px solid rgba(168,85,247,.1)`,textAlign:'center',fontSize:10,color:C.dim,fontFamily:"'Share Tech Mono',monospace"}}>
                  {sq2?'Comparison active':'Click any squad card to compare →'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// ── SQUAD CARD ────────────────────────────────────────────────────────────────
function SquadCard({squad,mySquad,onSelect,onCompareSet,rightMode,selectedSquad,compareSquad}){
  const [hov,setHov]=useState(false);
  const active=squad.squad_members?.filter(m=>m.is_active)||[];
  const gc=GAME_COLOR[squad.game]||C.cyan;
  const wr=squad.total_tournaments>0?Math.round((squad.total_wins/squad.total_tournaments)*100):0;
  const isMe=mySquad?.id===squad.id;
  const isSel=selectedSquad?.id===squad.id;
  const isCmp=compareSquad?.id===squad.id;
  return(
    <div className="sq-card"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={()=>rightMode==='compare'?onCompareSet(squad):onSelect(squad)}
      style={{background:C.card,border:`1px solid ${isSel?`${gc}55`:isCmp?`${C.purple}44`:`rgba(0,255,255,${hov?.15:.06})`}`,borderRadius:16,padding:17,cursor:'pointer',position:'relative',overflow:'hidden',transform:hov?'translateY(-3px)':'translateY(0)',transition:'all .2s ease',height:'100%',boxShadow:isSel?`0 0 28px ${gc}18`:isCmp?`0 0 22px ${C.purple}14`:'none'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:`linear-gradient(90deg,${gc},transparent)`,opacity:hov||isSel?1:.4,transition:'opacity .2s'}}/>
      <div style={{position:'absolute',top:7,left:7,width:8,height:8,borderTop:`1.5px solid rgba(0,255,255,${hov?.38:.1})`,borderLeft:`1.5px solid rgba(0,255,255,${hov?.38:.1})`}}/>
      <div style={{position:'absolute',top:7,right:7,width:8,height:8,borderTop:`1.5px solid rgba(0,255,255,${hov?.38:.1})`,borderRight:`1.5px solid rgba(0,255,255,${hov?.38:.1})`}}/>
      {isMe&&<div style={{position:'absolute',top:7,right:20,fontSize:11,filter:'drop-shadow(0 0 4px gold)'}}>♔</div>}
      {isSel&&<div style={{position:'absolute',bottom:7,right:7,width:7,height:7,borderRadius:'50%',background:gc,boxShadow:`0 0 6px ${gc}`}}/>}
      <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:11}}>
        <div style={{width:46,height:46,borderRadius:12,flexShrink:0,background:`linear-gradient(135deg,${gc}22,${C.purple}11)`,border:`1.5px solid ${gc}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:900,color:gc,boxShadow:hov?`0 0 14px ${gc}33`:'none',transition:'box-shadow .2s'}}>
          {(squad.tag||squad.name||'?').slice(0,3).toUpperCase()}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:900,color:'#fff',marginBottom:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{squad.name}</div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            <Badge color={gc}>{squad.game}</Badge>
            {squad.region&&<Badge color={C.purple}>{squad.region}</Badge>}
            {isMe&&<Badge color={C.gold}>Mine</Badge>}
          </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:5,marginBottom:10}}>
        {[{val:squad.elo_rating||'—',lbl:'ELO',color:C.red},{val:squad.total_wins||0,lbl:'W',color:C.green},{val:`${wr}%`,lbl:'WR',color:C.gold}].map(s=>(
          <div key={s.lbl} style={{background:'rgba(255,255,255,.02)',borderRadius:8,padding:'6px 3px',textAlign:'center',border:`1px solid rgba(0,255,255,.04)`}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,fontWeight:900,color:s.color}}>{s.val}</div>
            <div style={{fontSize:8,color:C.muted,fontFamily:"'Share Tech Mono',monospace",marginTop:2}}>{s.lbl}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:9}}>
        <Sparkline data={[820,870,850,920,970,950,1010,1030,1015,squad.elo_rating||1060]} color={gc} height={22}/>
      </div>
      <div style={{borderTop:`1px solid rgba(0,255,255,.05)`,paddingTop:9,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Avatars members={squad.squad_members||[]} max={4} size={24}/>
        <span style={{fontSize:9,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>{active.length}/7</span>
      </div>
      {hov&&<div style={{position:'absolute',bottom:0,left:0,right:0,padding:'5px 10px',background:`linear-gradient(transparent,${gc}10)`,fontSize:9,color:gc,fontFamily:"'Share Tech Mono',monospace",textAlign:'center',letterSpacing:1,pointerEvents:'none'}}>{rightMode==='compare'?'Set as compare →':'View profile →'}</div>}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function SquadsPage(){
  const router=useRouter();
  const [squads,setSquads]=useState([]);
  const [loading,setLoading]=useState(true);
  const [mySquad,setMySquad]=useState(null);
  const [mySquadLoading,setMySquadLoading]=useState(true);
  const [filter,setFilter]=useState({game:'',region:''});
  const [search,setSearch]=useState('');
  const [selectedSquad,setSelectedSquad]=useState(null);
  const [compareSquad,setCompareSquad]=useState(null);
  const [rightMode,setRightMode]=useState('leaderboard');

  useEffect(()=>{fetchSquads();fetchMySquad();},[]);
  useEffect(()=>{fetchSquads();},[filter]);

  const fetchMySquad=async()=>{
    try{
      const token=localStorage.getItem('token'),userId=localStorage.getItem('userId');
      if(!token||!userId)return;
      const res=await fetch(`http://localhost:3001/api/squads/user/${userId}`,{headers:{Authorization:`Bearer ${token}`}});
      if(res.ok){const d=await res.json();if(d)d._isLeader=d.squad_members?.some(m=>m.user_id===userId&&m.role==='leader'&&m.is_active);setMySquad(d);}
    }catch{}finally{setMySquadLoading(false);}
  };
  const fetchSquads=async()=>{
    try{
      const token=localStorage.getItem('token');
      if(!token){router.push('/login');return;}
      const p=new URLSearchParams();
      if(filter.game)p.append('game',filter.game);
      if(filter.region)p.append('region',filter.region);
      const res=await fetch(`http://localhost:3001/api/squads?${p}`,{headers:{Authorization:`Bearer ${token}`}});
      if(res.ok)setSquads(await res.json());
    }catch(e){console.error(e);}finally{setLoading(false);}
  };

  const handleSelect=sq=>{setSelectedSquad(sq);setRightMode(sq?'profile':'leaderboard');};
  const filtered=squads.filter(s=>!search||s.name.toLowerCase().includes(search.toLowerCase())||s.tag?.toLowerCase().includes(search.toLowerCase()));

  if(loading)return(
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <style>{CSS}</style><RainbowBar/>
      <div style={{width:52,height:52,border:`2px solid rgba(239,68,68,.15)`,borderTopColor:C.red,borderRadius:'50%',animation:'spin .7s linear infinite'}}/>
      <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.muted,letterSpacing:3}}>LOADING SQUADS...</div>
    </div>
  );

  return(
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,paddingTop:88,paddingBottom:60,position:'relative',fontFamily:"'Rajdhani',sans-serif"}}>
      <style>{CSS}</style>
      <RainbowBar/>
      <StarField/>
      <HexBg/>
      <ScanLine/>

      {/* Ambient glows */}
      <div style={{position:'fixed',top:'8%',left:'4%',width:420,height:420,borderRadius:'50%',background:'radial-gradient(circle,rgba(168,85,247,.04) 0%,transparent 70%)',zIndex:0,pointerEvents:'none'}}/>
      <div style={{position:'fixed',bottom:'12%',right:'6%',width:360,height:360,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,255,255,.04) 0%,transparent 70%)',zIndex:0,pointerEvents:'none'}}/>

      <div style={{maxWidth:1400,margin:'0 auto',padding:'0 20px',position:'relative',zIndex:2}}>

        {/* ── HEADER ── */}
        <div style={{marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <div style={{height:'1px',width:24,background:`linear-gradient(90deg,transparent,${C.cyan})`}}/>
            <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.cyan,letterSpacing:4}}>// SQUADS</span>
            <span style={{fontSize:10,color:C.dim}}>// Build &amp; manage your team</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:14}}>
            <div>
              <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:34,fontWeight:900,margin:0,background:'linear-gradient(135deg,#fff 0%,rgba(0,255,255,.85) 45%,rgba(168,85,247,.75) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Squad Hub</h1>
              <div style={{fontSize:11,color:C.muted,fontFamily:"'Share Tech Mono',monospace",marginTop:4,letterSpacing:1}}>{filtered.length} squad{filtered.length!==1?'s':''} · Find your team</div>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
              {/* Mode toggles */}
              {[{id:'leaderboard',lbl:'🏆 Ranks'},{id:'profile',lbl:'👤 Profile'},{id:'compare',lbl:'⇌ Compare'}].map(m=>(
                <button key={m.id} onClick={()=>{setRightMode(m.id);if(m.id==='leaderboard')setSelectedSquad(null);}}
                  style={{padding:'8px 15px',borderRadius:10,background:rightMode===m.id?'rgba(0,255,255,.1)':'rgba(255,255,255,.03)',border:`1px solid ${rightMode===m.id?'rgba(0,255,255,.35)':C.border}`,color:rightMode===m.id?C.cyan:C.muted,fontFamily:"'Share Tech Mono',monospace",fontSize:10,cursor:'pointer',transition:'all .15s',letterSpacing:.5}}>
                  {m.lbl}
                </button>
              ))}
              <div style={{width:1,height:26,background:C.border}}/>
              {/* ── RAINBOW CREATE SQUAD BUTTON ── */}
              {mySquad?(
                <button onClick={()=>alert('Leave your current squad first.')}
                  style={{padding:'9px 22px',borderRadius:10,background:'rgba(255,255,255,.02)',border:`1px solid ${C.border}`,color:C.dim,fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:900,letterSpacing:1.5,cursor:'not-allowed'}}>
                  🔒 Locked
                </button>
              ):(
                <button className="rb-btn" onClick={()=>router.push('/squads/create')}
                  style={{padding:'9px 22px',borderRadius:10,fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:900,letterSpacing:1.5,cursor:'pointer',transition:'transform .15s'}}>
                  <span className="rb-text">+ Create Squad</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 3-COLUMN ── */}
        <div style={{display:'grid',gridTemplateColumns:'240px 1fr 260px',gap:20,alignItems:'start'}}>
          <LeftPanel mySquad={mySquad} mySquadLoading={mySquadLoading} router={router}/>

          {/* CENTER */}
          <div>
            <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap',alignItems:'center',padding:'11px 13px',background:C.card,borderRadius:12,border:`1px solid ${C.border}`}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or tag..."
                style={{flex:1,minWidth:130,padding:'7px 12px',borderRadius:8,background:'rgba(255,255,255,.03)',border:`1px solid rgba(0,255,255,.1)`,color:C.text,fontSize:12,outline:'none'}}/>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {['','Free Fire','BGMI','Valorant'].map(g=>{
                  const gc={'Free Fire':C.red,'BGMI':C.orange,'Valorant':C.purple,'':C.cyan}[g];
                  const on=filter.game===g;
                  return <button key={g||'all'} onClick={()=>setFilter({...filter,game:g})} style={{padding:'6px 12px',borderRadius:20,fontSize:10,fontFamily:"'Share Tech Mono',monospace",cursor:'pointer',background:on?`rgba(${hexToRgb(gc)},.14)`:'transparent',border:`1px solid ${on?`rgba(${hexToRgb(gc)},.45)`:C.border}`,color:on?gc:C.muted,transition:'all .15s'}}>{g||'All'}</button>;
                })}
              </div>
              <select value={filter.region} onChange={e=>setFilter({...filter,region:e.target.value})} style={{padding:'7px 10px',borderRadius:8,background:C.card2,border:`1px solid rgba(0,255,255,.1)`,color:C.text,fontSize:11,outline:'none',cursor:'pointer'}}>
                <option value="">All Regions</option>
                <option value="India">India</option>
                <option value="Global">Global</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Americas">Americas</option>
              </select>
            </div>
            {mySquad&&(
              <div style={{marginBottom:12,padding:'8px 14px',borderRadius:10,background:'rgba(251,191,36,.04)',border:'1px solid rgba(251,191,36,.14)',fontSize:11,color:'rgba(251,191,36,.55)',fontFamily:"'Share Tech Mono',monospace",display:'flex',alignItems:'center',gap:8}}>
                <span>⚠</span><span>In <strong style={{color:'rgba(251,191,36,.8)'}}>{mySquad.name}</strong> — leave to join another. Click cards to view profiles.</span>
              </div>
            )}
            {filtered.length===0?(
              <div style={{textAlign:'center',padding:'80px 0'}}>
                <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:52,color:'rgba(0,255,255,.05)',marginBottom:16,animation:'float 3s ease-in-out infinite'}}>⬡</div>
                <div style={{fontSize:12,color:C.dim,fontFamily:"'Share Tech Mono',monospace",marginBottom:8}}>No squads found</div>
                {!mySquad&&<button onClick={()=>router.push('/squads/create')} style={{padding:'10px 24px',borderRadius:10,background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.35)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:10,cursor:'pointer',letterSpacing:1}}>+ Create Squad</button>}
              </div>
            ):(
              <>
                <div style={{fontSize:10,color:C.dim,fontFamily:"'Share Tech Mono',monospace",marginBottom:12}}>
                  {filtered.length} squad{filtered.length!==1?'s':''} found
                  {rightMode==='compare'&&<span style={{color:C.purple,marginLeft:8}}>· Click a card to set compare target</span>}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(226px,1fr))',gap:14}}>
                  {filtered.map(s=>(
                    <SquadCard key={s.id} squad={s} mySquad={mySquad} onSelect={handleSelect}
                      onCompareSet={sq=>setCompareSquad(sq)} rightMode={rightMode}
                      selectedSquad={selectedSquad} compareSquad={compareSquad}/>
                  ))}
                </div>
              </>
            )}
          </div>

          <RightPanel squads={squads} selectedSquad={selectedSquad} compareSquad={compareSquad}
            mode={rightMode} onSelect={handleSelect} onCompareSet={setCompareSquad}
            onMode={setRightMode} mySquad={mySquad} router={router}/>
        </div>
      </div>
    </div>
  );
}