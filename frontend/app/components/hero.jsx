'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import FireParticles from './FireParticles'

function useCountUp(target, dur = 2200, on = false) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!on) return
    let t0 = null
    const tick = ts => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / dur, 1)
      setV(Math.floor((1 - Math.pow(1 - p, 4)) * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, dur, on])
  return v
}

function useInView(thr = 0.2) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); ob.disconnect() }
    }, { threshold: thr })
    if (ref.current) ob.observe(ref.current)
    return () => ob.disconnect()
  }, [thr])
  return [ref, vis]
}

function ThreeLeft() {
  const mountRef = useRef(null)
  useEffect(() => {
    let THREE, renderer, scene, camera, animId
    let points, rings = [], icosa
    let mouse = { x: 0, y: 0 }, lx = 0, ly = 0
    async function init() {
      THREE = await import('three')
      const el = mountRef.current
      if (!el) return
      const W = () => el.offsetWidth, H = () => el.offsetHeight
      scene  = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(55, W()/H(), 0.1, 1000)
      camera.position.set(0, 0, 5.5)
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(W(), H())
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setClearColor(0, 0)
      el.appendChild(renderer.domElement)
      const φ = 1.618033988749895
      const N = 500, pos = new Float32Array(N*3), col = new Float32Array(N*3)
      for (let i = 0; i < N; i++) {
        const θ = i * 2.399963, r = Math.sqrt(i/N) * 5
        pos[i*3] = Math.cos(θ)*r; pos[i*3+1] = (Math.random()-.5)*8; pos[i*3+2] = Math.sin(θ)*r
        const t = i/N
        if (t < 0.33)      { col[i*3]=0;   col[i*3+1]=0.9+t; col[i*3+2]=1 }
        else if (t < 0.66) { col[i*3]=1;   col[i*3+1]=0;     col[i*3+2]=0.8-(t-.33) }
        else               { col[i*3]=0.2; col[i*3+1]=1;     col[i*3+2]=0.1 }
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
      points = new THREE.Points(geo, new THREE.PointsMaterial({ size:.04, vertexColors:true, transparent:true, opacity:.9 }))
      scene.add(points)
      icosa = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.6, 1),
        new THREE.MeshBasicMaterial({ color:0x00ffff, wireframe:true, transparent:true, opacity:.22 })
      )
      scene.add(icosa)
      ;[1.2, 1.2*φ, 1.2*φ*φ].forEach((r, i) => {
        const m = new THREE.Mesh(
          new THREE.TorusGeometry(r, .007, 2, 6),
          new THREE.MeshBasicMaterial({ color:[0x00ffff,0xff00cc,0x39ff14][i], transparent:true, opacity:.55-i*.1 })
        )
        m.rotation.x = [.4,1.,.7][i]; m.rotation.y = [.2,.5,1.1][i]
        m.userData.spd = [.005,-.004,.003][i]
        rings.push(m); scene.add(m)
      })
      const pl1 = new THREE.PointLight(0x00ffff,3,8); pl1.position.set(-1,1,2); scene.add(pl1)
      const pl2 = new THREE.PointLight(0xff00cc,2,6); pl2.position.set(1,-1,1); scene.add(pl2)
      const pl3 = new THREE.PointLight(0x39ff14,1.5,5); pl3.position.set(0,2,-1); scene.add(pl3)
      const mv = e => { mouse.x=(e.clientX/window.innerWidth-.5)*2; mouse.y=-(e.clientY/window.innerHeight-.5)*2 }
      const rs = () => { camera.aspect=W()/H(); camera.updateProjectionMatrix(); renderer.setSize(W(),H()) }
      window.addEventListener('mousemove', mv)
      window.addEventListener('resize', rs)
      const animate = () => {
        animId = requestAnimationFrame(animate)
        lx += (mouse.x*.3-lx)*.04; ly += (mouse.y*.25-ly)*.04
        camera.position.x = lx; camera.position.y = ly
        points.rotation.y += .0008
        icosa.rotation.y += .004; icosa.rotation.x += .0015
        rings.forEach(r => { r.rotation.z += r.userData.spd; r.rotation.x += r.userData.spd*.4 })
        renderer.render(scene, camera)
      }
      animate()
      return () => { window.removeEventListener('mousemove',mv); window.removeEventListener('resize',rs) }
    }
    const cleanup = init()
    return () => {
      cleanup.then(fn => fn?.())
      cancelAnimationFrame(animId)
      renderer?.dispose()
      if (mountRef.current && renderer?.domElement) mountRef.current.removeChild(renderer.domElement)
    }
  }, [])
  return <div ref={mountRef} style={{position:'absolute',inset:0,zIndex:4,pointerEvents:'none'}}/>
}

function BlueprintLeft() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, t = 0
    const φ = 1.618033988749895
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const drawGoldenRect = (x, y, w, h, depth) => {
      if (depth <= 0 || w < 3) return
      ctx.strokeRect(x, y, w, h)
      if (w > h) { const sq=h; drawGoldenRect(x+sq,y,w-sq,h,depth-1); ctx.beginPath(); ctx.arc(x+sq,y+sq,sq,Math.PI,Math.PI*1.5); ctx.stroke() }
      else        { const sq=w; drawGoldenRect(x,y+sq,w,h-sq,depth-1); ctx.beginPath(); ctx.arc(x,y+sq,sq,Math.PI*1.5,0); ctx.stroke() }
    }
    const draw = () => {
      const W=canvas.width, H=canvas.height
      ctx.clearRect(0,0,W,H); t+=.003
      const alpha=.055+Math.sin(t)*.022
      ctx.strokeStyle=`rgba(0,255,255,${alpha})`; ctx.lineWidth=.7
      const cx=W/2, cy=H/2, baseW=Math.min(W,H)*.7
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(t*.035); ctx.translate(-baseW/2,-baseW/(2*φ))
      drawGoldenRect(0,0,baseW,baseW/φ,7)
      ctx.restore()
      ;[1,1,2,3,5,8,13].forEach((f,i) => {
        const r=f*Math.min(W,H)*.012, a=i*2.399963+t*.07
        ctx.beginPath(); ctx.arc(cx+Math.cos(a)*Math.min(W,H)*.17, cy+Math.sin(a)*Math.min(W,H)*.1, r, 0, Math.PI*2)
        ctx.strokeStyle=i%2===0?`rgba(255,0,204,${alpha*.9})`:`rgba(57,255,20,${alpha*.7})`; ctx.stroke()
      })
      ctx.strokeStyle=`rgba(57,255,20,${alpha*.4})`; ctx.setLineDash([4,14])
      ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,H); ctx.stroke()
      ctx.setLineDash([])
      ctx.strokeStyle=`rgba(0,255,255,${alpha*.55})`; ctx.lineWidth=.5
      for (let i=1;i<=8;i++) { const x=cx-baseW/2+(baseW/Math.pow(φ,i)); ctx.beginPath(); ctx.moveTo(x,cy-10); ctx.lineTo(x,cy+10); ctx.stroke() }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize',resize) }
  }, [])
  return <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:3,pointerEvents:'none'}}/>
}

/* ── Feature Card — FIXED: useRouter inside component ── */
function FeatureCard({ icon, title, desc, tag, tagColor, delay, accentColor, route }) {
  const router = useRouter()
  const [h, setH] = useState(false)
  const ac = accentColor || '#00ffff'
  const tc = tagColor || ac
  return (
    <div className={`fc ${h?'hov':''}`} style={{'--fca':ac, animationDelay:`${delay}ms`, cursor:'pointer'}}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      onClick={()=>window.location.href=route}>
      <div className="fc-glow"/>
      <div className="fc-top">
        <div className="fc-icon-wrap">
          <div className="fc-ring"/><div className="fc-ring2"/>
          <div className="fc-icon">{icon}</div>
        </div>
        {tag && <span className="fc-tag" style={{color:tc,borderColor:`${tc}50`,background:`${tc}12`}}>{tag}</span>}
      </div>
      <h3 className="fc-title">{title}</h3>
      <div className="fc-line" style={{background:`linear-gradient(90deg,${ac},transparent)`}}/>
      <p className="fc-desc">{desc}</p>
      <div style={{color:ac, fontFamily:'Orbitron,monospace', fontSize:'9px', letterSpacing:'2px', marginTop:'16px'}}>EXPLORE →</div>
      <span className="c tl"/><span className="c tr"/>
      <span className="c bl"/><span className="c br"/>
    </div>
  )
}

function GameCard({ icon, name, desc, color, delay }) {
  return (
    <div className="gc" style={{'--cc':color, animationDelay:`${delay}ms`}}>
      <div className="gc-bar"/>
      <div className="gc-icon-big">{icon}</div>
      <div className="gc-name">{name}</div>
      <div className="gc-desc">{desc}</div>
      <div className="gc-prog"><div className="gc-prog-fill"/></div>
    </div>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open?'open':''}`} onClick={()=>setOpen(!open)}>
      <div className="faq-q">
        <span className="faq-badge">Q</span>
        <span className="faq-qtext">{q}</span>
        <span className="faq-chevron">{open?'−':'+'}</span>
      </div>
      {open && <div className="faq-a">→ {a}</div>}
    </div>
  )
}

function WhoCard({ icon, title, color, points, delay }) {
  return (
    <div className="who-card" style={{'--wc':color, animationDelay:`${delay}ms`}}>
      <div className="who-icon">{icon}</div>
      <h3 className="who-title">{title}</h3>
      <div className="who-line"/>
      <ul className="who-list">
        {points.map((p,i) => (
          <li key={i} className="who-li">
            <span className="who-dot" style={{background:color,boxShadow:`0 0 6px ${color}`}}/>
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Hero() {
  const router = useRouter()
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const mouse   = useRef({x:0,y:0})
  const ring    = useRef({x:0,y:0})
  const [userName, setUserName] = useState(null)
  const [statsRef, statsVis] = useInView()
  const [featRef]  = useInView(0.1)
  const [gamesRef] = useInView(0.15)
  const [whyRef]   = useInView(0.1)
  const [whoRef]   = useInView(0.1)
  const c40 = useCountUp(40,   2200, statsVis)
  const c3  = useCountUp(3,    2200, statsVis)
  const c5k = useCountUp(5000, 2200, statsVis)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name  = localStorage.getItem('userName')
    if (token) setUserName(name)
  }, [])

  const createRipple = (e) => {
    const btn = e.currentTarget
    const rip = document.createElement('span')
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    rip.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;position:absolute;border-radius:50%;background:rgba(0,255,255,0.4);transform:scale(0);animation:ripple .6s ease-out;pointer-events:none;`
    btn.appendChild(rip)
    setTimeout(()=>rip.remove(), 600)
  }

  useEffect(()=>{
    const mv=e=>{
      mouse.current={x:e.clientX,y:e.clientY}
      if(dotRef.current){dotRef.current.style.left=e.clientX+'px';dotRef.current.style.top=e.clientY+'px'}
    }
    window.addEventListener('mousemove',mv)
    return()=>window.removeEventListener('mousemove',mv)
  },[])

  useEffect(()=>{
    let id
    const loop=()=>{
      ring.current.x+=(mouse.current.x-ring.current.x)*.1
      ring.current.y+=(mouse.current.y-ring.current.y)*.1
      if(ringRef.current){ringRef.current.style.left=ring.current.x+'px';ringRef.current.style.top=ring.current.y+'px'}
      id=requestAnimationFrame(loop)
    }
    id=requestAnimationFrame(loop)
    return()=>cancelAnimationFrame(id)
  },[])

  const FEATURES = [
    { icon:'📊', title:'Point Table Generator',  desc:'Auto-calculate standings for Free Fire, BGMI, Valorant. Export stunning PNG with 40 pro templates.', tag:'FREE', tagColor:'#ef4444', accentColor:'#00ffff', delay:0,   route:'/tournaments/create' },
    { icon:'🏆', title:'Certificate Generator',  desc:'Instantly create Winner, MVP & Participation certificates. Professional quality in one click.',      tag:'FREE', tagColor:'#f59e0b', accentColor:'#ff00cc', delay:80,  route:'/studio/certificate' },
    { icon:'🛒', title:'Marketplace',            desc:"Find players, coaches & analysts. Post openings. India's biggest esports hiring platform.",          tag:'LIVE', tagColor:'#10b981', accentColor:'#39ff14', delay:160, route:'/marketplace' },
    { icon:'💬', title:'Chat System',            desc:'Real-time DMs and group chats. Built-in team communication with WebSocket technology.',               tag:'LIVE', tagColor:'#6366f1', accentColor:'#ffe000', delay:240, route:'/chat' },
    { icon:'👤', title:'Gaming Profile',         desc:'Build your esports portfolio. Showcase stats, tournaments and achievements to recruiters.',           tag:'LIVE', tagColor:'#a855f7', accentColor:'#ff00cc', delay:320, route:'/profile' },
    { icon:'🎨', title:'Vinci Studio',           desc:'All-in-one esports graphic studio. Point tables, certificates, banners — create like a pro.',        tag:'NEW',  tagColor:'#DC143C', accentColor:'#00ffff', delay:400, route:'/studio' },
  ]

  const GAMES = [
    { icon:'🔥', name:'Free Fire',  desc:'12 position scoring + kills', color:'#ff2200', delay:0   },
    { icon:'🎯', name:'BGMI',       desc:'8 position scoring + kills',  color:'#00ffff', delay:100 },
    { icon:'⚔️', name:'Valorant',   desc:'4 position scoring + kills',  color:'#ff00cc', delay:200 },
  ]

  const WHY = [
    { icon:'🆓', title:'COMPLETELY FREE',  desc:'No subscription. No hidden charges. All core features free forever.',    color:'#39ff14' },
    { icon:'🇮🇳', title:'MADE FOR INDIA', desc:'Built for Free Fire, BGMI and Valorant communities across India.',        color:'#ff2200' },
    { icon:'⚡', title:'NO DESIGN SKILLS', desc:'Anyone can create professional tournament graphics. No Photoshop needed.', color:'#ffe000' },
    { icon:'📱', title:'SHARE ANYWHERE',   desc:'Download PNG and share on WhatsApp, Instagram, YouTube instantly.',       color:'#ff00cc' },
  ]

  const WHO = [
    { icon:'🎮', title:'TOURNAMENT ORGANIZERS', color:'#00ffff', delay:0,   points:['Manage multiple tournaments','Auto calculate point tables','Export professional graphics','Share results instantly'] },
    { icon:'👥', title:'ESPORTS TEAMS',         color:'#ff00cc', delay:100, points:['Create squad profiles','Find players via marketplace','Build team portfolio','Track tournament history'] },
    { icon:'🏆', title:'PLAYERS',               color:'#ffe000', delay:200, points:['Build gaming portfolio','Find job opportunities','Get winner certificates','Join group chats'] },
  ]

  const FAQS = [
    { q:'Is VINCI-ARENA completely free?',      a:'Yes! All core features including tournament calculator, point tables, certificates, marketplace and chat are completely free.' },
    { q:'Which games are supported?',           a:'Free Fire, BGMI and Valorant with game-specific scoring. More games coming soon.' },
    { q:'Can I export point tables as images?', a:'Yes! 40 professional templates available. Export beautiful PNG to share on social media or WhatsApp.' },
    { q:'How do I find players or jobs?',       a:'Visit Marketplace to post jobs, find coaches, analysts or players. Apply directly through the platform.' },
    { q:'Is there a mobile app?',               a:'Currently a web platform optimized for desktop and mobile browsers. Native app coming soon.' },
  ]

  const TICKER = [
    {t:'🏆 FREE FIRE NATIONALS — FINALS LIVE',   v:'12 TEAMS'},
    {t:'⚡ BGMI PRO LEAGUE — REGISTRATION OPEN', v:'500+ SLOTS'},
    {t:'🎯 VALORANT OPEN — QUALIFIERS 20 MAR',   v:'SIGN UP'},
    {t:'🎨 VINCI STUDIO — 5K+ CREATIONS MADE',  v:'TRY NOW'},
    {t:'📊 40 EXPORT TEMPLATES AVAILABLE',       v:'FREE'},
  ]

  const CSS = `
    :root{
      --c:#00ffff; --m:#ff00cc; --g:#39ff14; --r:#ff2200; --y:#ffe000;
      --bg:#000; --tm:rgba(255,255,255,.45);
      --expo:cubic-bezier(0.16,1,0.3,1);
      --gc:0 0 20px rgba(0,255,255,.6),0 0 60px rgba(0,255,255,.25);
      --gm:0 0 20px rgba(255,0,204,.6),0 0 60px rgba(255,0,204,.2);
      --gg:0 0 20px rgba(57,255,20,.6),0 0 60px rgba(57,255,20,.2);
      --font-hud:'Orbitron',monospace; --font-body:'Rajdhani',sans-serif; --font-mono:'Share Tech Mono',monospace;
    }
   .page{display:flex;flex-direction:column;min-height:100vh;background:var(--bg);}
    .va-cursor{pointer-events:none !important;}
    .va-cursor-ring{pointer-events:none !important;}
    @keyframes ripple{to{transform:scale(4);opacity:0;}}
    @keyframes glitch{0%,89%,100%{clip-path:none;transform:none;}90%{clip-path:polygon(0 8%,100% 8%,100% 28%,0 28%);transform:translateX(-5px);}92%{clip-path:polygon(0 55%,100% 55%,100% 72%,0 72%);transform:translateX(5px);}94%{clip-path:none;transform:none;}}
    @keyframes flicker{0%,93%,95%,100%{opacity:1;}94%{opacity:.2;}96%{opacity:.7;}}
    @keyframes firePulse{0%,100%{transform:scale(1);opacity:.4;}50%{transform:scale(1.55);opacity:.85;}}
    @keyframes sparksFloat{0%{transform:translateY(0);opacity:.9;}100%{transform:translateY(-900px);opacity:0;}}
    @keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
    @keyframes scanline{0%,100%{top:-4px;opacity:0;}10%{opacity:.08;}90%{opacity:.05;}99%{top:110%;}}
    @keyframes cardIn{from{opacity:0;transform:translateY(28px) rotateX(6deg);}to{opacity:1;transform:none;}}
    @keyframes pulseRing{0%{transform:scale(.7);opacity:1;}100%{transform:scale(2.2);opacity:0;}}
    @keyframes rotateCW{to{transform:rotate(360deg);}}
    @keyframes rotateCCW{to{transform:rotate(-360deg);}}
    @keyframes barGrow{from{transform:scaleX(0);}to{transform:scaleX(1);}}
    @keyframes vcgflow{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}

    .ticker{position:relative;z-index:100;height:32px;display:flex;align-items:center;overflow:hidden;background:linear-gradient(90deg,rgba(0,255,255,.03),rgba(255,0,204,.05),rgba(0,255,255,.03));border-bottom:1px solid rgba(0,255,255,.12);border-top:1px solid rgba(0,255,255,.12);flex-shrink:0;}
    .ticker-lbl{flex-shrink:0;padding:0 18px;font-family:var(--font-hud);font-size:8px;letter-spacing:3px;color:var(--g);border-right:1px solid rgba(57,255,20,.2);height:100%;display:flex;align-items:center;background:rgba(57,255,20,.06);}
    .ticker-track{display:flex;overflow:hidden;flex:1;}
    .ticker-inner{display:flex;white-space:nowrap;animation:marquee 28s linear infinite;}
    .ticker-item{font-family:var(--font-mono);font-size:9px;letter-spacing:1px;color:rgba(255,255,255,.4);padding:0 36px;}
    .ticker-item em{color:var(--c);font-style:normal;margin-right:8px;}

    .va-hero{position:relative;height:calc(100vh - 96px);min-height:600px;display:flex;overflow:hidden;}
    .hero-left{position:relative;width:45%;flex-shrink:0;border-right:1px solid rgba(0,255,255,.12);overflow:hidden;}
    .hero-left::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 50% 50%,rgba(0,255,255,.06) 0%,rgba(255,0,204,.04) 50%,transparent 75%);z-index:1;pointer-events:none;}
    .hero-left-grid{position:absolute;inset:0;z-index:2;pointer-events:none;background-image:linear-gradient(rgba(0,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,.04) 1px,transparent 1px);background-size:48px 48px;}
    .hero-left-label{position:absolute;bottom:28px;left:28px;z-index:10;font-family:var(--font-mono);font-size:8px;letter-spacing:3px;color:rgba(0,255,255,.5);display:flex;flex-direction:column;gap:4px;}
    .hll-line{width:40px;height:1px;background:linear-gradient(90deg,var(--c),transparent);}
    .hero-right{flex:1;display:flex;align-items:center;justify-content:flex-start;padding:0 60px 0 52px;position:relative;z-index:10;}
    .hero-bg-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.12;z-index:0;}
    .hero-radial{position:absolute;inset:0;z-index:1;background:radial-gradient(ellipse 110% 80% at 80% 55%,rgba(255,0,204,.1),transparent 60%),radial-gradient(ellipse 60% 50% at 20% 50%,rgba(0,255,255,.08),transparent 65%),linear-gradient(to bottom,rgba(0,0,0,.5) 0%,transparent 40%,rgba(0,0,0,.8) 95%);}
    .sparks{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:2;}
    .sparks::before{content:'';position:absolute;width:200%;height:200%;background-image:radial-gradient(2px 2px at 6% 93%,#00ffff,transparent),radial-gradient(1px 1px at 22% 88%,#ff00cc,transparent),radial-gradient(2px 2px at 38% 92%,#39ff14,transparent),radial-gradient(2px 2px at 74% 87%,#00ffff,transparent),radial-gradient(3px 3px at 46% 94%,#ff00cc,transparent);animation:sparksFloat 11s linear infinite;opacity:.7;}
    .sparks::after{content:'';position:absolute;width:200%;height:200%;background-image:radial-gradient(3px 3px at 14% 90%,#39ff14,transparent),radial-gradient(2px 2px at 36% 87%,#00ffff,transparent),radial-gradient(3px 3px at 77% 89%,#ff00cc,transparent);animation:sparksFloat 17s linear infinite 4s;opacity:.6;}
    .scan{position:absolute;left:0;right:0;height:1px;z-index:5;background:linear-gradient(90deg,transparent,rgba(0,255,255,.4),rgba(255,0,204,.3),transparent);animation:scanline 9s linear infinite;pointer-events:none;}

    .hero-content{display:flex;flex-direction:column;align-items:flex-start;gap:20px;max-width:560px;width:100%;}
    .va-badge{display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(57,255,20,.5);background:rgba(57,255,20,.07);padding:6px 20px;font-family:var(--font-hud);font-size:9px;letter-spacing:3.5px;color:var(--g);clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);}
    .va-h1{font-family:var(--font-hud);font-size:clamp(36px,5vw,74px);font-weight:900;line-height:.93;letter-spacing:-2px;text-align:left;}
    .h1-top{display:block;background:linear-gradient(45deg,#00ffff,#ffffff,#39ff14,#ffffff,#00ffff,#ffe000,#ffffff,#00ffff,#ff00cc,#ffffff,#00ffff);background-size:600% 600%;animation:vcgflow 8s ease infinite;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 18px rgba(0,255,255,.6));}
    .h1-brand{display:block;background:linear-gradient(45deg,#ff00cc,#00ffff,#39ff14,#ffe000,#ffffff,#00ffff,#ff00cc,#ffe000,#39ff14,#ffffff,#ff00cc,#00ffff,#ffe000,#39ff14,#ffffff,#00ffff);background-size:600% 600%;animation:vcgflow 6s ease infinite,glitch 11s infinite 3s;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 40px rgba(0,255,255,.8)) drop-shadow(0 0 80px rgba(255,0,204,.5));}
    .va-sub{font-family:var(--font-body);font-weight:600;font-size:clamp(15px,2vw,22px);letter-spacing:1.5px;background:linear-gradient(90deg,#00ffff,#ff00cc,#39ff14,#ffe000,#00ffff,#ff00cc,#ffe000,#39ff14,#00ffff);background-size:400% auto;animation:vcgflow 5s linear infinite;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;text-align:left;filter:drop-shadow(0 0 12px rgba(0,255,255,.5));}
    .va-desc{font-family:var(--font-body);font-size:14px;line-height:1.9;color:rgba(255,255,255,.55);max-width:480px;text-align:left;}
    .va-pills{display:flex;gap:7px;flex-wrap:wrap;}
    .pill{font-family:var(--font-mono);font-size:8px;letter-spacing:2px;padding:5px 13px;border:1px solid rgba(0,255,255,.15);background:rgba(0,255,255,.04);color:rgba(255,255,255,.45);transition:all .3s var(--expo);clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);cursor:default;}
    .pill:hover{border-color:var(--c);color:var(--c);background:rgba(0,255,255,.08);}
    .va-cta{display:flex;gap:12px;flex-wrap:wrap;}
    .btn-p{position:relative;overflow:hidden;font-family:var(--font-hud);font-size:9.5px;letter-spacing:3px;color:#000;background:var(--c);border:none;padding:14px 38px;cursor:pointer;clip-path:polygon(14px 0%,100% 0%,calc(100% - 14px) 100%,0% 100%);transition:all .3s;text-decoration:none;display:inline-block;font-weight:700;box-shadow:var(--gc);}
    .btn-p::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);transform:translateX(-100%);transition:transform .5s;}
    .btn-p:hover::before{transform:translateX(100%);} .btn-p:hover{background:var(--g);box-shadow:var(--gg);}
    .btn-s{font-family:var(--font-hud);font-size:9.5px;letter-spacing:3px;color:var(--m);background:transparent;border:1.5px solid var(--m);padding:13px 34px;cursor:pointer;clip-path:polygon(14px 0%,100% 0%,calc(100% - 14px) 100%,0% 100%);transition:all .3s;text-decoration:none;display:inline-block;}
    .btn-s:hover{background:rgba(255,0,204,.12);box-shadow:var(--gm);}
    .scroll-cue{display:flex;flex-direction:column;align-items:center;gap:7px;opacity:.4;margin-top:4px;}
    .scroll-rail{width:1px;height:48px;background:linear-gradient(to bottom,var(--c),transparent);animation:firePulse 2.5s ease-in-out infinite;}
    .scroll-txt{font-family:var(--font-mono);font-size:8px;letter-spacing:5px;color:var(--c);}

    .va-stats{position:relative;z-index:10;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(0,255,255,.08);}
    .stat-card{position:relative;overflow:hidden;background:var(--bg);padding:44px 24px;text-align:center;transition:background .3s;border-top:2px solid transparent;}
    .stat-card:nth-child(1){border-color:var(--c);} .stat-card:nth-child(2){border-color:var(--m);}
    .stat-card:nth-child(3){border-color:var(--g);} .stat-card:nth-child(4){border-color:var(--y);}
    .stat-card:hover{background:rgba(0,255,255,.03);}
    .stat-glow{position:absolute;inset:0;opacity:0;transition:opacity .4s;}
    .stat-card:nth-child(1) .stat-glow{background:radial-gradient(circle at 50% 0%,rgba(0,255,255,.1),transparent 65%);}
    .stat-card:nth-child(2) .stat-glow{background:radial-gradient(circle at 50% 0%,rgba(255,0,204,.1),transparent 65%);}
    .stat-card:nth-child(3) .stat-glow{background:radial-gradient(circle at 50% 0%,rgba(57,255,20,.1),transparent 65%);}
    .stat-card:nth-child(4) .stat-glow{background:radial-gradient(circle at 50% 0%,rgba(255,224,0,.1),transparent 65%);}
    .stat-card:hover .stat-glow{opacity:1;}
    .stat-val{font-family:var(--font-hud);font-size:clamp(38px,4vw,54px);font-weight:900;line-height:1;}
    .stat-card:nth-child(1) .stat-val{color:var(--c);filter:drop-shadow(0 0 14px rgba(0,255,255,.6));}
    .stat-card:nth-child(2) .stat-val{color:var(--m);filter:drop-shadow(0 0 14px rgba(255,0,204,.6));}
    .stat-card:nth-child(3) .stat-val{color:var(--g);filter:drop-shadow(0 0 14px rgba(57,255,20,.6));}
    .stat-card:nth-child(4) .stat-val{color:var(--y);filter:drop-shadow(0 0 14px rgba(255,224,0,.6));}
    .stat-suf{font-size:.5em;}
    .stat-lbl{font-family:var(--font-mono);font-size:9px;letter-spacing:2.5px;color:var(--tm);}
    .stat-sub{font-family:var(--font-body);font-size:11px;color:rgba(255,255,255,.22);margin-top:4px;}
    .stat-bar{width:32px;height:2px;margin:16px auto 0;transform-origin:left;animation:barGrow .8s var(--expo) both;}
    .stat-card:nth-child(1) .stat-bar{background:var(--c);box-shadow:0 0 10px var(--c);}
    .stat-card:nth-child(2) .stat-bar{background:var(--m);box-shadow:0 0 10px var(--m);}
    .stat-card:nth-child(3) .stat-bar{background:var(--g);box-shadow:0 0 10px var(--g);}
    .stat-card:nth-child(4) .stat-bar{background:var(--y);box-shadow:0 0 10px var(--y);}

    .sec-wrap{position:relative;z-index:10;padding:90px 80px;}
    .sec-eye{font-family:var(--font-mono);font-size:9px;letter-spacing:5px;color:var(--c);text-align:center;margin-bottom:12px;}
    .sec-title{font-family:var(--font-hud);font-size:clamp(26px,3.8vw,46px);font-weight:700;text-align:center;margin-bottom:8px;color:#fff;}
    .sec-sub{font-family:var(--font-body);font-size:15px;color:rgba(255,255,255,.4);text-align:center;margin-bottom:48px;}

    .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
    .fc{position:relative;background:rgba(255,255,255,.015);border:1px solid rgba(0,255,255,.1);padding:32px 26px 28px;animation:cardIn .7s var(--expo) both;transition:all .4s var(--expo);}
    .fc.hov{border-color:var(--fca,var(--c));background:rgba(0,255,255,.04);transform:translateY(-8px);box-shadow:0 20px 50px rgba(0,255,255,.12),0 0 0 1px var(--fca,var(--c));}
    .fc-glow{position:absolute;inset:0;opacity:0;transition:opacity .4s;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(0,255,255,.08),transparent);pointer-events:none;}
    .fc.hov .fc-glow{opacity:1;}
    .fc-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;}
    .fc-icon-wrap{position:relative;width:50px;height:50px;display:flex;align-items:center;justify-content:center;}
    .fc-ring,.fc-ring2{position:absolute;inset:0;border-radius:50%;border:1px solid var(--fca,var(--c));opacity:0;transition:opacity .3s;pointer-events:none;}
    .fc-ring{animation:pulseRing 2.2s ease-out infinite;} .fc-ring2{animation:pulseRing 2.2s ease-out infinite .8s;}
    .fc.hov .fc-ring,.fc.hov .fc-ring2{opacity:1;}
    .fc-icon{font-size:22px;z-index:1;position:relative;background:rgba(0,255,255,.08);border:1px solid rgba(0,255,255,.2);border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;transition:box-shadow .3s;}
    .fc.hov .fc-icon{box-shadow:0 0 20px rgba(0,255,255,.35);}
    .fc-tag{font-family:var(--font-mono);font-size:8px;letter-spacing:1.5px;padding:3px 10px;border:1px solid;font-weight:700;}
    .fc-title{font-family:var(--font-hud);font-size:12px;letter-spacing:1px;font-weight:700;margin-bottom:6px;color:#fff;transition:color .3s;}
    .fc.hov .fc-title{color:var(--fca,var(--c));text-shadow:0 0 16px var(--fca,var(--c));}
    .fc-line{height:2px;width:36px;margin-bottom:10px;border-radius:2px;transition:width .3s var(--expo);}
    .fc.hov .fc-line{width:64px;}
    .fc-desc{font-family:var(--font-body);font-size:13px;line-height:1.75;color:rgba(255,255,255,.45);}
    .c{position:absolute;width:10px;height:10px;border-color:var(--fca,var(--c));border-style:solid;opacity:.4;transition:all .35s;pointer-events:none;}
    .fc.hov .c{opacity:1;width:15px;height:15px;}
    .c.tl{top:7px;left:7px;border-width:2px 0 0 2px;} .c.tr{top:7px;right:7px;border-width:2px 2px 0 0;}
    .c.bl{bottom:7px;left:7px;border-width:0 0 2px 2px;} .c.br{bottom:7px;right:7px;border-width:0 2px 2px 0;}

    .mq-wrap{overflow:hidden;border-top:1px solid rgba(0,255,255,.1);border-bottom:1px solid rgba(0,255,255,.1);background:rgba(0,255,255,.02);padding:14px 0;position:relative;z-index:10;}
    .mq-inner{display:flex;white-space:nowrap;animation:marquee 22s linear infinite;}
    .mq-item{font-family:var(--font-hud);font-size:10px;letter-spacing:4px;color:rgba(255,255,255,.15);padding:0 36px;display:flex;align-items:center;gap:14px;}
    .mq-item span{color:var(--c);font-size:7px;}

    .games-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
    .gc{position:relative;overflow:hidden;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.07);padding:40px 28px 36px;cursor:pointer;transition:all .35s var(--expo);text-align:center;animation:cardIn .6s var(--expo) both;}
    .gc-bar{position:absolute;top:0;left:0;right:0;height:3px;background:var(--cc,var(--c));transform:scaleX(0);transform-origin:left;transition:transform .35s var(--expo);box-shadow:0 0 12px var(--cc,var(--c));}
    .gc:hover{border-color:var(--cc,var(--c));background:rgba(0,255,255,.04);transform:translateY(-6px);box-shadow:0 20px 48px rgba(0,255,255,.12);}
    .gc:hover .gc-bar{transform:scaleX(1);}
    .gc-icon-big{font-size:56px;margin-bottom:16px;display:block;}
    .gc-name{font-family:var(--font-hud);font-size:16px;letter-spacing:2px;font-weight:700;margin-bottom:8px;color:#fff;}
    .gc-desc{font-family:var(--font-body);font-size:13px;color:rgba(255,255,255,.45);letter-spacing:1px;}
    .gc-prog{position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,.04);}
    .gc-prog-fill{height:100%;width:0;background:linear-gradient(90deg,var(--cc,var(--c)),transparent);transition:width .6s var(--expo);}
    .gc:hover .gc-prog-fill{width:100%;}

    .why-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
    .why-card{padding:28px 22px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.01);text-align:center;transition:all .3s var(--expo);cursor:default;}
    .why-card:hover{transform:translateY(-5px);border-color:rgba(0,255,255,.3);background:rgba(0,255,255,.04);}
    .why-icon{font-size:36px;margin-bottom:14px;display:block;}
    .why-title{font-family:var(--font-hud);font-size:10px;letter-spacing:2px;font-weight:700;margin-bottom:10px;color:#fff;}
    .why-line{width:28px;height:2px;margin:0 auto 12px;border-radius:2px;}
    .why-desc{font-family:var(--font-body);font-size:13px;color:rgba(255,255,255,.4);line-height:1.7;}

    .who-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
    .who-card{padding:32px 26px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.01);transition:all .35s var(--expo);animation:cardIn .6s var(--expo) both;border-top:2px solid var(--wc,var(--c));}
    .who-card:hover{transform:translateY(-5px);background:rgba(0,255,255,.03);}
    .who-icon{font-size:40px;margin-bottom:14px;display:block;}
    .who-title{font-family:var(--font-hud);font-size:11px;letter-spacing:2px;font-weight:700;margin-bottom:8px;color:#fff;text-shadow:0 0 15px var(--wc,var(--c));}
    .who-line{height:2px;width:40px;margin-bottom:16px;background:linear-gradient(90deg,var(--wc,var(--c)),transparent);}
    .who-list{list-style:none;padding:0;display:flex;flex-direction:column;gap:10px;}
    .who-li{display:flex;align-items:center;gap:10px;font-family:var(--font-body);font-size:13px;font-weight:600;color:rgba(255,255,255,.5);}
    .who-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}

    .studio-banner{position:relative;overflow:hidden;margin:0 80px;border:1px solid rgba(239,68,68,.3);background:linear-gradient(135deg,#1a0000 0%,#0a0010 50%,#000a1a 100%);box-shadow:0 0 60px rgba(239,68,68,.1);}
    .studio-grid-bg{position:absolute;inset:0;opacity:.3;background-image:linear-gradient(rgba(239,68,68,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(239,68,68,.05) 1px,transparent 1px);background-size:40px 40px;}
    .studio-glow1{position:absolute;top:-80px;right:-80px;width:256px;height:256px;border-radius:50%;opacity:.1;background:radial-gradient(circle,#ef4444,transparent);filter:blur(40px);}
    .studio-glow2{position:absolute;bottom:-80px;left:-80px;width:256px;height:256px;border-radius:50%;opacity:.1;background:radial-gradient(circle,#8b5cf6,transparent);filter:blur(40px);}
    .studio-inner{position:relative;z-index:2;display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:32px;padding:48px;}
    .studio-left{flex:1;}
    .studio-new-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:50px;padding:6px 16px;margin-bottom:16px;}
    .studio-new-dot{width:6px;height:6px;background:#ef4444;border-radius:50%;animation:flicker 2s infinite;}
    .studio-new-text{font-family:var(--font-hud);font-size:8px;letter-spacing:3px;color:#f87171;}
    .studio-h2{font-family:var(--font-hud);font-size:clamp(22px,3vw,36px);font-weight:900;color:#fff;margin-bottom:12px;line-height:1.1;}
    .studio-h2 span{background:linear-gradient(90deg,#ef4444,#f97316);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
    .studio-desc{font-family:var(--font-body);font-size:14px;color:rgba(255,255,255,.5);margin-bottom:16px;max-width:480px;line-height:1.7;}
    .studio-tags{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px;}
    .studio-tag{font-family:var(--font-body);font-size:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);padding:4px 14px;border-radius:50px;font-weight:700;}
    .studio-actions{display:flex;align-items:center;gap:20px;}
    .studio-btn{display:flex;align-items:center;gap:8px;background:#dc2626;color:#fff;padding:12px 28px;font-family:var(--font-hud);font-size:10px;letter-spacing:2px;font-weight:700;border:none;cursor:pointer;transition:all .3s;clip-path:polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%);box-shadow:0 0 25px rgba(239,68,68,.5);}
    .studio-btn:hover{background:#ef4444;box-shadow:0 0 40px rgba(239,68,68,.7);}
    .studio-stat{text-align:center;}
    .studio-stat-val{font-family:var(--font-hud);font-size:13px;font-weight:900;color:#f87171;}
    .studio-stat-lbl{font-family:var(--font-mono);font-size:9px;color:rgba(255,255,255,.3);letter-spacing:2px;}
    .studio-right{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;flex-shrink:0;}
    .studio-tool{width:112px;height:112px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;transition:all .3s;background:#0a0a0a;}
    .studio-tool:hover{transform:scale(1.06);}
    .studio-tool-icon{font-size:28px;}
    .studio-tool-lbl{font-family:var(--font-hud);font-size:9px;letter-spacing:1px;font-weight:700;}

    .faq-list{display:flex;flex-direction:column;gap:8px;max-width:800px;margin:0 auto;}
    .faq-item{padding:18px 20px;border:1px solid rgba(239,68,68,.15);background:rgba(5,5,5,.95);cursor:pointer;transition:all .3s;}
    .faq-item:hover{border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.04);}
    .faq-item.open{border-color:rgba(0,255,255,.4);background:rgba(0,255,255,.03);}
    .faq-q{display:flex;align-items:flex-start;gap:12px;}
    .faq-badge{font-family:var(--font-hud);font-size:9px;font-weight:900;padding:3px 8px;background:rgba(239,68,68,.1);color:#ef4444;border:1px solid rgba(239,68,68,.2);flex-shrink:0;margin-top:1px;}
    .faq-qtext{font-family:var(--font-hud);font-size:11px;font-weight:700;color:#fff;flex:1;}
    .faq-chevron{font-family:var(--font-hud);font-size:16px;color:var(--c);flex-shrink:0;}
    .faq-a{font-family:var(--font-body);font-size:13px;color:rgba(255,255,255,.5);line-height:1.7;padding:12px 0 0 44px;font-weight:600;}

    .cta-final{position:relative;z-index:10;padding:100px 80px;text-align:center;overflow:hidden;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(0,255,255,.05),rgba(255,0,204,.04),transparent);border-top:1px solid rgba(0,255,255,.1);}
    .cta-ring1,.cta-ring2,.cta-ring3{position:absolute;top:50%;left:50%;border-style:solid;clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);transform:translate(-50%,-50%);}
    .cta-ring1{width:680px;height:680px;border-color:rgba(0,255,255,.05);border-width:1px;animation:rotateCW 50s linear infinite;}
    .cta-ring2{width:460px;height:460px;border-color:rgba(255,0,204,.07);border-width:1px;animation:rotateCCW 34s linear infinite;}
    .cta-ring3{width:260px;height:260px;border-color:rgba(57,255,20,.1);border-width:1px;animation:rotateCW 19s linear infinite;}
    .cta-inner{position:relative;z-index:2;}
    .cta-h2{font-family:var(--font-hud);font-size:clamp(28px,4.5vw,60px);font-weight:900;color:#fff;margin-bottom:14px;}
    .cta-p{font-family:var(--font-body);font-size:16px;color:rgba(255,255,255,.45);max-width:480px;margin:0 auto 36px;line-height:1.8;}

    .va-footer{position:relative;z-index:10;padding:48px 80px;border-top:1px solid rgba(255,255,255,.06);text-align:center;}
    .footer-logo{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px;}
    .footer-logo-img{width:40px;height:40px;object-fit:contain;}
    .footer-brand{font-family:var(--font-hud);font-size:16px;font-weight:700;color:#fff;}
    .footer-desc{font-family:var(--font-body);font-size:14px;color:rgba(255,255,255,.4);margin-bottom:8px;}
    .footer-copy{font-family:var(--font-mono);font-size:10px;color:rgba(255,255,255,.2);}

    @media(max-width:960px){
      .va-hero{flex-direction:column;} .hero-left{width:100%;height:280px;border-right:none;border-bottom:1px solid rgba(0,255,255,.1);}
      .hero-right{padding:32px 24px;}
      .va-stats,.why-grid,.who-grid{grid-template-columns:repeat(2,1fr);}
      .feat-grid,.games-grid{grid-template-columns:1fr;}
      .sec-wrap,.cta-final,.va-footer{padding:56px 22px;}
      .studio-banner{margin:0 22px;} .studio-inner{flex-direction:column;padding:28px;}
      .studio-right{grid-template-columns:repeat(4,1fr);}
    }
  `

  return (
    <>
      <div ref={dotRef} className="va-cursor"/>
      <div ref={ringRef} className="va-cursor-ring"/>
      <style>{CSS}</style>
      <div className="page">

        <div style={{height:'44px'}}/>

        <div className="ticker">
          <div className="ticker-lbl">LIVE FEED</div>
          <div className="ticker-track">
            <div className="ticker-inner">
              {[...TICKER,...TICKER].map((item,i)=>(
                <span key={i} className="ticker-item"><em>◆</em>{item.t}&nbsp;·&nbsp;<span style={{color:'rgba(255,255,255,.3)'}}>{item.v}</span></span>
              ))}
            </div>
          </div>
        </div>

        <section className="va-hero">
          <img src="/dashboard-bg.png" className="hero-bg-img" alt="" aria-hidden="true"/>
          <div className="hero-radial"/>
          <div className="sparks"/>
          <div className="scan"/>
          <div className="hero-left">
            <div className="hero-left-grid"/>
            <ThreeLeft/>
            <BlueprintLeft/>
            <FireParticles/>
            <div className="hero-left-label">
              <div className="hll-line"/>
              <span>φ = 1.618</span>
              <span>GOLDEN RATIO</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-content">
              <div className="va-badge">
                <img src="/vinci-symbol.jpg" alt="" style={{width:14,height:14,objectFit:'contain'}}/>
                INTRODUCING ▸ VINCI-ARENA
              </div>
              <h1 className="va-h1">
                <span className="h1-top">Welcome to</span>
                <span className="h1-brand">VINCI-ARENA</span>
              </h1>
              <p className="va-sub">Manage Esports Like a Pro</p>
              <p className="va-desc">Make your own gaming portfolio. Track matches, calculate points automatically, and export professional standings for Free Fire, BGMI, and Valorant tournaments.</p>
              <div className="va-pills">
                {['🔥 FREE FIRE','🎯 BGMI','⚔️ VALORANT','🏆 TOURNAMENTS','📊 ANALYTICS','🎨 STUDIO'].map(p=>(
                  <span key={p} className="pill">{p}</span>
                ))}
              </div>
              <div className="va-cta">
                {userName ? (
                  <button className="btn-p" onClick={(e)=>{createRipple(e);router.push('/dashboard')}} style={{position:'relative',overflow:'hidden'}}>GO TO DASHBOARD ▸</button>
                ) : (
                  <>
                    <button className="btn-p" onClick={(e)=>{createRipple(e);router.push('/register')}} style={{position:'relative',overflow:'hidden'}}>GET STARTED ▸</button>
                    <button className="btn-s" onClick={(e)=>{createRipple(e);router.push('/login')}} style={{position:'relative',overflow:'hidden'}}>SIGN IN</button>
                  </>
                )}
              </div>
              <div className="scroll-cue">
                <div className="scroll-rail"/>
                <span className="scroll-txt">SCROLL</span>
              </div>
            </div>
          </div>
        </section>

        <div className="va-stats" ref={statsRef}>
          {[
            {v:c40,  s:'',  l:'EXPORT TEMPLATES', sub:'pro designs'},
            {v:c3,   s:'',  l:'GAMES SUPPORTED',  sub:'Free Fire, BGMI, Valorant'},
            {v:'∞',  s:'',  l:'TOURNAMENTS',      sub:'no limits'},
            {v:c5k,  s:'+', l:'CREATIONS MADE',   sub:'on Vinci Studio'},
          ].map((s,i)=>(
            <div key={i} className="stat-card">
              <div className="stat-glow"/>
              <div className="stat-val">{s.v}<span className="stat-suf">{s.s}</span></div>
              <div className="stat-lbl">{s.l}</div>
              <div className="stat-sub">{s.sub}</div>
              <div className="stat-bar"/>
            </div>
          ))}
        </div>

        <section className="sec-wrap" ref={featRef}>
          <p className="sec-eye">// PLATFORM FEATURES</p>
          <h2 className="sec-title">Everything You Need</h2>
          <p className="sec-sub">One platform. Every esports tool you need.</p>
          <div className="feat-grid">
            {FEATURES.map(f=><FeatureCard key={f.title} {...f}/>)}
          </div>
        </section>

        <div className="mq-wrap">
          <div className="mq-inner">
            {Array(8).fill(['TRACK','CALCULATE','WIN','ESPORTS','VINCI-ARENA','FREE FIRE','BGMI','VALORANT']).flat().map((w,i)=>(
              <span key={i} className="mq-item">{w}<span>◆</span></span>
            ))}
          </div>
        </div>

        <section className="sec-wrap" style={{background:'rgba(0,0,0,.3)',borderTop:'1px solid rgba(220,20,60,.2)',borderBottom:'1px solid rgba(220,20,60,.2)'}} ref={gamesRef}>
          <p className="sec-eye">// SUPPORTED TITLES</p>
          <h2 className="sec-title">Supported Games</h2>
          <div className="games-grid">
            {GAMES.map(g=><GameCard key={g.name} {...g}/>)}
          </div>
        </section>

        <section className="sec-wrap" ref={whyRef}>
          <p className="sec-eye">// WHY CHOOSE US</p>
          <h2 className="sec-title">Why VINCI-ARENA?</h2>
          <p className="sec-sub">India's first platform built for grassroots esports organizers and players</p>
          <div className="why-grid">
            {WHY.map((w,i)=>(
              <div key={i} className="why-card" style={{'--wc':w.color}}>
                <span className="why-icon" style={{filter:`drop-shadow(0 0 8px ${w.color})`}}>{w.icon}</span>
                <div className="why-title" style={{textShadow:`0 0 15px ${w.color}80`}}>{w.title}</div>
                <div className="why-line" style={{background:`linear-gradient(90deg,transparent,${w.color},transparent)`}}/>
                <div className="why-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="sec-wrap" ref={whoRef}>
          <p className="sec-eye">// FOR EVERYONE</p>
          <h2 className="sec-title">Who Is This For?</h2>
          <div className="who-grid">
            {WHO.map(w=><WhoCard key={w.title} {...w}/>)}
          </div>
        </section>

        <div style={{padding:'0 0 80px'}}>
          <div className="studio-banner">
            <div className="studio-grid-bg"/>
            <div className="studio-glow1"/><div className="studio-glow2"/>
            <div className="studio-inner">
              <div className="studio-left">
                <div className="studio-new-badge">
                  <div className="studio-new-dot"/>
                  <span className="studio-new-text">NEW FEATURE</span>
                </div>
                <h2 className="studio-h2">INTRODUCING<br/><span>VINCI STUDIO</span></h2>
                <p className="studio-desc">Create professional esports graphics in seconds. Point tables, winner certificates, tournament banners, MVP cards — all in one place.</p>
                <div className="studio-tags">
                  {['📊 Point Tables','🏆 Certificates','🎨 Banners','⚡ MVP Cards'].map(f=>(
                    <span key={f} className="studio-tag">{f}</span>
                  ))}
                </div>
                <div className="studio-actions">
                  <button className="studio-btn" onClick={()=>router.push('/studio')}>🎨 OPEN VINCI STUDIO →</button>
                  {[['FREE','TO USE'],['5K+','CREATIONS']].map(([val,lbl])=>(
                    <div key={lbl} className="studio-stat">
                      <div className="studio-stat-val">{val}</div>
                      <div className="studio-stat-lbl">{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="studio-right">
                {[
                  {icon:'📊',label:'POINT TABLE',color:'#ef4444'},
                  {icon:'🏆',label:'CERTIFICATE',color:'#eab308'},
                  {icon:'🎨',label:'BANNER',color:'#8b5cf6'},
                  {icon:'⚡',label:'MVP CARD',color:'#06b6d4'},
                ].map(tool=>(
                  <div key={tool.label} className="studio-tool" style={{border:`1px solid ${tool.color}30`,boxShadow:`0 0 15px ${tool.color}15`}} onClick={()=>router.push('/studio')}>
                    <span className="studio-tool-icon">{tool.icon}</span>
                    <span className="studio-tool-lbl" style={{color:tool.color}}>{tool.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="sec-wrap" style={{paddingTop:'20px'}}>
          <p className="sec-eye">// FAQ</p>
          <h2 className="sec-title">Frequently Asked</h2>
          <div className="faq-list">
            {FAQS.map((f,i)=><FaqItem key={i} q={f.q} a={f.a}/>)}
          </div>
        </section>

        {!userName && (
          <section className="cta-final">
            <div className="cta-ring1"/><div className="cta-ring2"/><div className="cta-ring3"/>
            <div className="cta-inner">
              <h2 className="cta-h2">Ready to Get Started?</h2>
              <p className="cta-p">Join now and start managing your tournaments like a pro. Completely free, forever.</p>
              <button className="btn-p" onClick={(e)=>{createRipple(e);router.push('/register')}} style={{position:'relative',overflow:'hidden',fontSize:'11px',padding:'16px 48px'}}>
                CREATE FREE ACCOUNT ▸
              </button>
            </div>
          </section>
        )}

        <footer className="va-footer">
          <div className="footer-logo">
            <img src="/vinci-symbol.jpg" alt="Vinci-Arena" className="footer-logo-img"/>
            <span className="footer-brand">VINCI-ARENA</span>
          </div>
          <p className="footer-desc">The ultimate tournament calculator for esports</p>
          <p className="footer-copy">© 2026 Vinci-Arena. Built with Next.js & Supabase.</p>
        </footer>

      </div>
    </>
  )
}