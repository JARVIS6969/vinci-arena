'use client';
import { useEffect, useState, useRef } from 'react';

const STAT_CONFIG = {
  kd_ratio:      { label: 'K/D RATIO',   icon: '⚔️', max: 10,  suffix: '',  type: 'globe', color: '#ff0044' },
  win_rate:      { label: 'WIN RATE',     icon: '🏆', max: 100, suffix: '%', type: 'globe', color: '#00ffff' },
  headshot:      { label: 'HEADSHOT',     icon: '🎯', max: 100, suffix: '%', type: 'globe', color: '#ff00ff' },
  total_kills:   { label: 'TOTAL KILLS',  icon: '💀', max: null, suffix: '', type: 'bar',   color: '#ff0044' },
  total_matches: { label: 'MATCHES',      icon: '🎮', max: null, suffix: '', type: 'bar',   color: '#00ff88' },
  wins:          { label: 'WINS',         icon: '🥇', max: null, suffix: '', type: 'bar',   color: '#00ffff' },
  damage:        { label: 'TOTAL DMG',    icon: '💥', max: null, suffix: '', type: 'bar',   color: '#ff00ff' },
  avg_damage:    { label: 'AVG DAMAGE',   icon: '📊', max: null, suffix: '', type: 'bar',   color: '#ffff00' },
  rank:          { label: 'RANK',         icon: '👑', max: null, suffix: '', type: 'badge', color: '#ff6600' },
  combat_score:  { label: 'COMBAT SCORE', icon: '⚡', max: 300, suffix: '',  type: 'globe', color: '#00ff88' },
};

// Animated counter
function useCounter(target, duration=1500, started) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started || !target) return;
    const num = parseFloat(target);
    if (isNaN(num)) { setCount(target); return; }
    let start = 0;
    const inc = num / (duration / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= num) { setCount(num%1!==0 ? num.toFixed(2) : Math.floor(num)); clearInterval(timer); }
      else setCount(num%1!==0 ? start.toFixed(2) : Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, started]);
  return count;
}

// ── 3D GLOBE STAT ──
function GlobeStat({ statKey, value, config, index, started }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const animatedValue = useCounter(value, 1500 + index * 200, started);
  const [hovered, setHovered] = useState(false);

  const numVal = parseFloat(value) || 0;
  const max = config.max || 100;
  const pct = Math.min(numVal / max, 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 140;
    const H = canvas.height = 140;
    const cx = W / 2, cy = H / 2, R = 54;

    let frame = 0;
    const color = config.color;

    // Parse hex to rgb
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      return {r,g,b};
    };
    const {r,g,b} = hexToRgb(color);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      frame++;
      ctx.clearRect(0,0,W,H);

      const speed = hovered ? 0.008 : 0.004;
      const t = frame * speed;
      const fillPct = started ? pct : 0;

      // ── OUTER GLOW ──
      const outerGlow = ctx.createRadialGradient(cx,cy,R*0.7,cx,cy,R*1.4);
      outerGlow.addColorStop(0, `rgba(${r},${g},${b},0.15)`);
      outerGlow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath(); ctx.arc(cx,cy,R*1.4,0,Math.PI*2);
      ctx.fillStyle = outerGlow; ctx.fill();

      // ── DARK SPHERE BASE ──
      const sphereGrad = ctx.createRadialGradient(cx-R*0.3,cy-R*0.3,R*0.1,cx,cy,R);
      sphereGrad.addColorStop(0, '#1a1a2e');
      sphereGrad.addColorStop(0.5, '#0d0d1a');
      sphereGrad.addColorStop(1, '#050508');
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.fillStyle = sphereGrad; ctx.fill();

      // ── LATITUDE LINES (grid) ──
      ctx.save();
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.clip();
      for (let lat = -80; lat <= 80; lat += 20) {
        const y = cy + R * Math.sin(lat * Math.PI/180);
        const rr = R * Math.cos(lat * Math.PI/180);
        ctx.beginPath();
        ctx.ellipse(cx, y, rr, rr*0.25, 0, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.12)`;
        ctx.lineWidth = 0.5; ctx.stroke();
      }
      // Longitude lines
      for (let lon = 0; lon < 180; lon += 30) {
        const angle = (lon * Math.PI/180) + t;
        ctx.beginPath();
        ctx.ellipse(cx, cy, R*Math.abs(Math.cos(angle)), R, 0, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.10)`;
        ctx.lineWidth = 0.5; ctx.stroke();
      }
      ctx.restore();

      // ── LIQUID FILL (wave) ──
      if (fillPct > 0) {
        ctx.save();
        ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.clip();

        // Fill level from bottom
        const fillY = cy + R - fillPct * 2 * R;
        const waveAmp = 4 + fillPct * 3;
        const waveFreq = 0.06;

        ctx.beginPath();
        ctx.moveTo(cx - R, H + 10);
        // Wave top
        for (let x = cx - R; x <= cx + R; x++) {
          const wave1 = Math.sin((x * waveFreq) + t * 3) * waveAmp;
          const wave2 = Math.sin((x * waveFreq * 1.7) + t * 2.1 + 1) * waveAmp * 0.5;
          ctx.lineTo(x, fillY + wave1 + wave2);
        }
        ctx.lineTo(cx + R, H + 10);
        ctx.closePath();

        // Liquid gradient
        const liquidGrad = ctx.createLinearGradient(cx, fillY - waveAmp, cx, cy + R);
        liquidGrad.addColorStop(0, `rgba(${r},${g},${b},0.85)`);
        liquidGrad.addColorStop(0.5, `rgba(${r},${g},${b},0.65)`);
        liquidGrad.addColorStop(1, `rgba(${Math.min(r+40,255)},${Math.min(g+20,255)},${Math.min(b+40,255)},0.9)`);
        ctx.fillStyle = liquidGrad;
        ctx.fill();

        // Foam/shine on wave top
        ctx.beginPath();
        for (let x = cx - R; x <= cx + R; x++) {
          const wave1 = Math.sin((x * waveFreq) + t * 3) * waveAmp;
          const wave2 = Math.sin((x * waveFreq * 1.7) + t * 2.1 + 1) * waveAmp * 0.5;
          if (x === cx - R) ctx.moveTo(x, fillY + wave1 + wave2 - 2);
          else ctx.lineTo(x, fillY + wave1 + wave2 - 2);
        }
        ctx.strokeStyle = `rgba(255,255,255,0.3)`;
        ctx.lineWidth = 1.5; ctx.stroke();

        ctx.restore();
      }

      // ── SPHERE SHINE (glass effect) ──
      const shineGrad = ctx.createRadialGradient(cx-R*0.35, cy-R*0.35, 2, cx-R*0.1, cy-R*0.1, R*0.8);
      shineGrad.addColorStop(0, 'rgba(255,255,255,0.18)');
      shineGrad.addColorStop(0.4, 'rgba(255,255,255,0.04)');
      shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.fillStyle = shineGrad; ctx.fill();

      // ── SPHERE BORDER ──
      const borderGrad = ctx.createLinearGradient(cx-R,cy-R,cx+R,cy+R);
      borderGrad.addColorStop(0, `rgba(${r},${g},${b},0.8)`);
      borderGrad.addColorStop(0.5, `rgba(${r},${g},${b},0.3)`);
      borderGrad.addColorStop(1, `rgba(${r},${g},${b},0.6)`);
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = hovered ? 2 : 1.5; ctx.stroke();

      // ── ROTATING ORBIT RING ──
      ctx.save();
      ctx.translate(cx,cy);
      ctx.rotate(t * 0.5);
      ctx.beginPath();
      ctx.ellipse(0, 0, R+8, (R+8)*0.3, 0, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(${r},${g},${b},${hovered?0.6:0.3})`;
      ctx.lineWidth = hovered ? 1.5 : 1;
      ctx.setLineDash([4, 6]); ctx.stroke(); ctx.setLineDash([]);

      // Orbit dot
      const dotAngle = t * 2;
      const dotX = (R+8) * Math.cos(dotAngle);
      const dotY = (R+8) * 0.3 * Math.sin(dotAngle);
      const dotGlow = ctx.createRadialGradient(dotX,dotY,0,dotX,dotY,5);
      dotGlow.addColorStop(0,`rgba(${r},${g},${b},1)`);
      dotGlow.addColorStop(1,`rgba(${r},${g},${b},0)`);
      ctx.beginPath(); ctx.arc(dotX,dotY,5,0,Math.PI*2);
      ctx.fillStyle=dotGlow; ctx.fill();
      ctx.restore();

      // ── PERCENTAGE ARC (outer) ──
      ctx.beginPath();
      ctx.arc(cx, cy, R+14, -Math.PI/2, -Math.PI/2 + (started?pct:0)*Math.PI*2);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.5)`;
      ctx.lineWidth = 2; ctx.stroke();

      // Arc end dot
      if (started && pct > 0) {
        const endAngle = -Math.PI/2 + pct*Math.PI*2;
        const ex = cx + (R+14)*Math.cos(endAngle);
        const ey = cy + (R+14)*Math.sin(endAngle);
        ctx.beginPath(); ctx.arc(ex,ey,4,0,Math.PI*2);
        ctx.fillStyle = `rgba(${r},${g},${b},1)`;
        ctx.shadowColor = color; ctx.shadowBlur = 10;
        ctx.fill(); ctx.shadowBlur = 0;
      }
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [started, pct, hovered]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '16px 12px', borderRadius: '16px',
        background: hovered ? `${config.color}10` : 'linear-gradient(145deg,#0d0d0d,#080808)',
        border: `1px solid ${hovered ? config.color : config.color+'25'}`,
        boxShadow: hovered ? `0 0 30px ${config.color}30, inset 0 0 20px ${config.color}08` : `0 0 15px ${config.color}08`,
        transition: 'all 0.3s cubic-bezier(.16,1,.3,1)',
        transform: hovered ? 'translateY(-4px) scale(1.03)' : 'none',
        cursor: 'default', flex: 1,
      }}>
      {/* Globe canvas */}
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <canvas ref={canvasRef} width={140} height={140} style={{ display: 'block' }}/>
        {/* Center value overlay */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: "'Orbitron',monospace", fontWeight: 900,
            fontSize: pct < 0.1 ? '16px' : '18px',
            color: '#fff',
            textShadow: `0 0 15px ${config.color}, 0 0 30px ${config.color}80`,
            lineHeight: 1,
          }}>
            {animatedValue}{config.suffix}
          </span>
        </div>
      </div>

      {/* Label */}
      <div style={{
        fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: '9px',
        color: config.color, letterSpacing: '2px', marginBottom: '4px',
        textShadow: hovered ? `0 0 8px ${config.color}` : 'none',
        transition: 'text-shadow .3s',
      }}>{config.label}</div>
      <div style={{ fontSize: '18px' }}>{config.icon}</div>

      {/* Pct bar below */}
      <div style={{ width: '100%', height: '3px', borderRadius: '99px', background: `${config.color}20`, marginTop: '8px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '99px',
          width: started ? `${pct*100}%` : '0%',
          background: `linear-gradient(90deg,${config.color}80,${config.color})`,
          boxShadow: `0 0 6px ${config.color}`,
          transition: 'width 1.5s cubic-bezier(.16,1,.3,1)',
        }}/>
      </div>
    </div>
  );
}

// Bar card
function BarCard({ statKey, value, config, allStats, index, started }) {
  const animatedValue = useCounter(value, 1500 + index * 100, started);
  const [hov, setHov] = useState(false);

  const numVal = parseFloat(value?.toString().replace(',','')) || 0;
  const allNums = Object.entries(allStats).filter(([k])=>STAT_CONFIG[k]?.type==='bar').map(([,v])=>parseFloat(v?.toString().replace(',',''))||0);
  const maxVal = Math.max(...allNums, 1);
  const barPct = Math.min((numVal/maxVal)*100, 100);

  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        borderRadius: '12px', padding: '14px',
        background: hov ? `${config.color}08` : '#0d0d0d',
        border: `1px solid ${hov ? config.color+'50' : config.color+'20'}`,
        boxShadow: hov ? `0 0 20px ${config.color}15` : 'none',
        transition: 'all .3s',
      }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontSize:'16px' }}>{config.icon}</span>
          <span style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'9px', color:config.color, letterSpacing:'1px' }}>{config.label}</span>
        </div>
        <span style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, color:'#fff', fontSize:'14px', textShadow:`0 0 10px ${config.color}60` }}>{animatedValue}</span>
      </div>
      <div style={{ height:'4px', borderRadius:'99px', background:`${config.color}15`, overflow:'hidden', position:'relative' }}>
        <div style={{
          height:'100%', borderRadius:'99px',
          width: started?`${barPct}%`:'0%',
          background: `linear-gradient(90deg,${config.color}70,${config.color})`,
          boxShadow: `0 0 8px ${config.color}`,
          transition: 'width 1.5s cubic-bezier(.16,1,.3,1)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', animation:'shimmer 2s infinite' }}/>
        </div>
      </div>
    </div>
  );
}

// Badge card
function BadgeCard({ value, config, index, started }) {
  const [vis, setVis] = useState(false);
  useEffect(()=>{ if(started) setTimeout(()=>setVis(true), index*150+600); },[started]);
  return (
    <div style={{
      borderRadius:'12px', padding:'16px', textAlign:'center',
      background:`linear-gradient(135deg,${config.color}15,${config.color}05)`,
      border:`1px solid ${config.color}30`,
      boxShadow:`0 0 20px ${config.color}10`,
      opacity: vis?1:0, transform: vis?'none':'scale(0.8)',
      transition:'all .5s cubic-bezier(.16,1,.3,1)',
    }}>
      <div style={{fontSize:'24px',marginBottom:'6px'}}>{config.icon}</div>
      <div style={{fontFamily:"'Orbitron',monospace",fontWeight:900,color:'#fff',fontSize:'14px',marginBottom:'4px',textShadow:`0 0 15px ${config.color}`}}>{value}</div>
      <div style={{fontFamily:"'Orbitron',monospace",fontSize:'8px',color:config.color,letterSpacing:'2px'}}>{config.label}</div>
    </div>
  );
}

export default function GameStatsDisplay({ stats, accentColor, gameName }) {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){setStarted(false);setTimeout(()=>setStarted(true),100);}
    },{threshold:0.2});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);

  useEffect(()=>{setStarted(false);setTimeout(()=>setStarted(true),200);},[gameName]);

  const globeStats = Object.entries(stats).filter(([k,v])=>v&&STAT_CONFIG[k]?.type==='globe');
  const barStats   = Object.entries(stats).filter(([k,v])=>v&&STAT_CONFIG[k]?.type==='bar');
  const badgeStats = Object.entries(stats).filter(([k,v])=>v&&STAT_CONFIG[k]?.type==='badge');

  if(Object.keys(stats).length===0) return null;

  return (
    <div ref={ref}>
      <style>{`
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes pulse-glow{0%,100%{opacity:.6}50%{opacity:1}}
      `}</style>

      {/* ── 3D GLOBE STATS ── */}
      {globeStats.length > 0 && (
        <div style={{ marginBottom:'20px' }}>
          <p style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', fontWeight:900, color:accentColor, letterSpacing:'3px', marginBottom:'14px', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ flex:1, height:'1px', background:`linear-gradient(90deg,${accentColor}60,transparent)` }}/>
            🌐 KEY METRICS
            <span style={{ flex:1, height:'1px', background:`linear-gradient(90deg,transparent,${accentColor}60)` }}/>
          </p>
          <div style={{ display:'flex', gap:'10px' }}>
            {globeStats.map(([key,value],i)=>(
              <GlobeStat key={key} statKey={key} value={value} config={STAT_CONFIG[key]} index={i} started={started}/>
            ))}
          </div>
        </div>
      )}

      {/* ── BAR STATS ── */}
      {barStats.length > 0 && (
        <div style={{ marginBottom:'20px' }}>
          <p style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', fontWeight:900, color:accentColor, letterSpacing:'3px', marginBottom:'14px', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ flex:1, height:'1px', background:`linear-gradient(90deg,${accentColor}60,transparent)` }}/>
            📊 PERFORMANCE
            <span style={{ flex:1, height:'1px', background:`linear-gradient(90deg,transparent,${accentColor}60)` }}/>
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {barStats.map(([key,value],i)=>(
              <BarCard key={key} statKey={key} value={value} config={STAT_CONFIG[key]} allStats={stats} index={i} started={started}/>
            ))}
          </div>
        </div>
      )}

      {/* ── BADGE STATS ── */}
      {badgeStats.length > 0 && (
        <div>
          <p style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', fontWeight:900, color:accentColor, letterSpacing:'3px', marginBottom:'14px', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ flex:1, height:'1px', background:`linear-gradient(90deg,${accentColor}60,transparent)` }}/>
            👑 RANK & TITLES
            <span style={{ flex:1, height:'1px', background:`linear-gradient(90deg,transparent,${accentColor}60)` }}/>
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
            {badgeStats.map(([key,value],i)=>(
              <BadgeCard key={key} value={value} config={STAT_CONFIG[key]} index={i} started={started}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}