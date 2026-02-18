'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ExportPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.id;

  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [view, setView] = useState('grid');

  const templates = [
    // Original 16
    { id:1,  name:'Ice Storm - Blue',     bg:'/templates/backgrounds/bg-1.jpg',  overlay:'rgba(0,20,60,0.78)',   accent:'#60a5fa', headerBg:'rgba(10,40,120,0.90)', rowEven:'rgba(5,25,80,0.82)',   rowOdd:'rgba(8,32,95,0.72)',   text:'#fff', sub:'#93c5fd', type:'image' },
    { id:2,  name:'Volcano - Red',        bg:'/templates/backgrounds/bg-2.jpg',  overlay:'rgba(90,0,0,0.78)',    accent:'#f87171', headerBg:'rgba(130,10,10,0.90)', rowEven:'rgba(70,5,5,0.82)',    rowOdd:'rgba(90,10,10,0.72)',  text:'#fff', sub:'#fca5a5', type:'image' },
    { id:3,  name:'Dragon - Purple',      bg:'/templates/backgrounds/bg-3.jpg',  overlay:'rgba(60,0,80,0.78)',   accent:'#e879f9', headerBg:'rgba(90,0,110,0.90)',  rowEven:'rgba(45,0,65,0.82)',   rowOdd:'rgba(58,0,80,0.72)',   text:'#fff', sub:'#f0abfc', type:'image' },
    { id:4,  name:'Jungle - Green',       bg:'/templates/backgrounds/bg-4.jpg',  overlay:'rgba(0,45,10,0.78)',   accent:'#4ade80', headerBg:'rgba(0,65,20,0.90)',   rowEven:'rgba(0,35,10,0.82)',   rowOdd:'rgba(0,45,15,0.72)',   text:'#fff', sub:'#86efac', type:'image' },
    { id:5,  name:'Ocean - Cyan',         bg:'/templates/backgrounds/bg-5.jpg',  overlay:'rgba(0,40,75,0.78)',   accent:'#22d3ee', headerBg:'rgba(0,65,95,0.90)',   rowEven:'rgba(0,32,60,0.82)',   rowOdd:'rgba(0,42,72,0.72)',   text:'#fff', sub:'#67e8f9', type:'image' },
    { id:6,  name:'Gold - Amber',         bg:'/templates/backgrounds/bg-6.jpg',  overlay:'rgba(45,25,0,0.78)',   accent:'#fbbf24', headerBg:'rgba(90,55,0,0.90)',   rowEven:'rgba(48,28,0,0.82)',   rowOdd:'rgba(62,36,0,0.72)',   text:'#fff', sub:'#fde68a', type:'image' },
    { id:7,  name:'Night City - Violet',  bg:'/templates/backgrounds/bg-7.jpg',  overlay:'rgba(5,0,20,0.80)',    accent:'#a78bfa', headerBg:'rgba(35,12,70,0.90)',  rowEven:'rgba(18,6,38,0.85)',   rowOdd:'rgba(25,9,50,0.75)',   text:'#fff', sub:'#c4b5fd', type:'image' },
    { id:8,  name:'Desert - Orange',      bg:'/templates/backgrounds/bg-8.jpg',  overlay:'rgba(55,28,0,0.78)',   accent:'#fb923c', headerBg:'rgba(90,42,0,0.90)',   rowEven:'rgba(55,26,0,0.82)',   rowOdd:'rgba(70,34,0,0.72)',   text:'#fff', sub:'#fdba74', type:'image' },
    { id:9,  name:'Arctic - Sky Blue',    bg:'/templates/backgrounds/bg-9.jpg',  overlay:'rgba(0,28,58,0.75)',   accent:'#38bdf8', headerBg:'rgba(0,50,90,0.88)',   rowEven:'rgba(0,22,52,0.78)',   rowOdd:'rgba(0,30,65,0.68)',   text:'#fff', sub:'#7dd3fc', type:'image' },
    { id:10, name:'Blood Moon - Crimson', bg:'/templates/backgrounds/bg-10.jpg', overlay:'rgba(75,0,0,0.78)',    accent:'#ff4444', headerBg:'rgba(110,0,0,0.90)',   rowEven:'rgba(60,0,0,0.82)',    rowOdd:'rgba(78,5,5,0.72)',    text:'#fff', sub:'#ff8080', type:'image' },
    { id:11, name:'Cyber - Neon Green',   bg:'/templates/backgrounds/bg-11.jpg', overlay:'rgba(0,5,20,0.80)',    accent:'#00ff88', headerBg:'rgba(0,35,20,0.90)',   rowEven:'rgba(0,12,22,0.85)',   rowOdd:'rgba(0,18,30,0.75)',   text:'#fff', sub:'#6ee7b7', type:'image' },
    { id:12, name:'Galaxy - Indigo',      bg:'/templates/backgrounds/bg-12.jpg', overlay:'rgba(18,0,45,0.78)',   accent:'#818cf8', headerBg:'rgba(32,10,75,0.90)',  rowEven:'rgba(16,5,42,0.82)',   rowOdd:'rgba(24,8,56,0.72)',   text:'#fff', sub:'#a5b4fc', type:'image' },
    { id:13, name:'Titanium - Silver',    bg:'/templates/backgrounds/bg-13.jpg', overlay:'rgba(8,8,8,0.82)',     accent:'#94a3b8', headerBg:'rgba(32,32,36,0.92)',  rowEven:'rgba(16,16,20,0.85)',  rowOdd:'rgba(24,24,28,0.75)',  text:'#fff', sub:'#cbd5e1', type:'image' },
    { id:14, name:'Royal - Magenta',      bg:'/templates/backgrounds/bg-14.jpg', overlay:'rgba(42,0,62,0.78)',   accent:'#d946ef', headerBg:'rgba(65,0,95,0.90)',   rowEven:'rgba(32,0,52,0.82)',   rowOdd:'rgba(45,0,68,0.72)',   text:'#fff', sub:'#f0abfc', type:'image' },
    { id:15, name:'Forest - Emerald',     bg:'/templates/backgrounds/bg-15.jpg', overlay:'rgba(0,32,12,0.78)',   accent:'#10b981', headerBg:'rgba(0,58,25,0.90)',   rowEven:'rgba(0,28,12,0.82)',   rowOdd:'rgba(0,38,18,0.72)',   text:'#fff', sub:'#6ee7b7', type:'image' },
    { id:16, name:'Diamond - Teal',       bg:'/templates/backgrounds/bg-16.jpg', overlay:'rgba(0,12,48,0.78)',   accent:'#06b6d4', headerBg:'rgba(0,32,72,0.90)',   rowEven:'rgba(0,14,42,0.82)',   rowOdd:'rgba(0,20,55,0.72)',   text:'#fff', sub:'#67e8f9', type:'image' },
    // New 16 - Color Variants
    { id:17, name:'Ice Storm - Navy',     bg:'/templates/backgrounds/bg-1.jpg',  overlay:'rgba(0,0,80,0.82)',    accent:'#1d4ed8', headerBg:'rgba(0,0,120,0.92)',   rowEven:'rgba(0,0,70,0.85)',    rowOdd:'rgba(0,0,90,0.75)',    text:'#fff', sub:'#93c5fd', type:'image' },
    { id:18, name:'Volcano - Gold',       bg:'/templates/backgrounds/bg-2.jpg',  overlay:'rgba(40,20,0,0.80)',   accent:'#f59e0b', headerBg:'rgba(80,50,0,0.92)',   rowEven:'rgba(45,22,0,0.85)',   rowOdd:'rgba(60,30,0,0.75)',   text:'#fff', sub:'#fde68a', type:'image' },
    { id:19, name:'Dragon - Teal',        bg:'/templates/backgrounds/bg-3.jpg',  overlay:'rgba(0,40,50,0.80)',   accent:'#14b8a6', headerBg:'rgba(0,70,70,0.92)',   rowEven:'rgba(0,38,45,0.85)',   rowOdd:'rgba(0,50,58,0.75)',   text:'#fff', sub:'#5eead4', type:'image' },
    { id:20, name:'Jungle - Orange',      bg:'/templates/backgrounds/bg-4.jpg',  overlay:'rgba(60,20,0,0.80)',   accent:'#f97316', headerBg:'rgba(100,38,0,0.92)',  rowEven:'rgba(55,18,0,0.85)',   rowOdd:'rgba(72,24,0,0.75)',   text:'#fff', sub:'#fdba74', type:'image' },
    { id:21, name:'Ocean - Purple',       bg:'/templates/backgrounds/bg-5.jpg',  overlay:'rgba(40,0,70,0.80)',   accent:'#9333ea', headerBg:'rgba(70,0,120,0.92)',  rowEven:'rgba(38,0,65,0.85)',   rowOdd:'rgba(50,0,85,0.75)',   text:'#fff', sub:'#d8b4fe', type:'image' },
    { id:22, name:'Gold - Crimson',       bg:'/templates/backgrounds/bg-6.jpg',  overlay:'rgba(80,0,0,0.80)',    accent:'#dc2626', headerBg:'rgba(130,0,0,0.92)',   rowEven:'rgba(65,0,0,0.85)',    rowOdd:'rgba(85,0,0,0.75)',    text:'#fff', sub:'#fca5a5', type:'image' },
    { id:23, name:'Night City - Pink',    bg:'/templates/backgrounds/bg-7.jpg',  overlay:'rgba(60,0,30,0.82)',   accent:'#f472b6', headerBg:'rgba(100,0,50,0.92)',  rowEven:'rgba(55,0,28,0.85)',   rowOdd:'rgba(72,0,38,0.75)',   text:'#fff', sub:'#fbcfe8', type:'image' },
    { id:24, name:'Desert - Yellow',      bg:'/templates/backgrounds/bg-8.jpg',  overlay:'rgba(50,40,0,0.80)',   accent:'#eab308', headerBg:'rgba(90,70,0,0.92)',   rowEven:'rgba(48,36,0,0.85)',   rowOdd:'rgba(62,48,0,0.75)',   text:'#fff', sub:'#fef08a', type:'image' },
    { id:25, name:'Arctic - Emerald',     bg:'/templates/backgrounds/bg-9.jpg',  overlay:'rgba(0,40,20,0.80)',   accent:'#22c55e', headerBg:'rgba(0,70,30,0.92)',   rowEven:'rgba(0,35,18,0.85)',   rowOdd:'rgba(0,48,24,0.75)',   text:'#fff', sub:'#86efac', type:'image' },
    { id:26, name:'Blood Moon - Orange',  bg:'/templates/backgrounds/bg-10.jpg', overlay:'rgba(70,25,0,0.80)',   accent:'#ea580c', headerBg:'rgba(120,40,0,0.92)',  rowEven:'rgba(65,22,0,0.85)',   rowOdd:'rgba(85,30,0,0.75)',   text:'#fff', sub:'#fdba74', type:'image' },
    { id:27, name:'Cyber - Blue',         bg:'/templates/backgrounds/bg-11.jpg', overlay:'rgba(0,10,60,0.82)',   accent:'#3b82f6', headerBg:'rgba(0,20,100,0.92)',  rowEven:'rgba(0,8,55,0.85)',    rowOdd:'rgba(0,12,72,0.75)',   text:'#fff', sub:'#93c5fd', type:'image' },
    { id:28, name:'Galaxy - Rose',        bg:'/templates/backgrounds/bg-12.jpg', overlay:'rgba(60,0,30,0.80)',   accent:'#fb7185', headerBg:'rgba(100,0,50,0.92)',  rowEven:'rgba(55,0,28,0.85)',   rowOdd:'rgba(72,0,38,0.75)',   text:'#fff', sub:'#fda4af', type:'image' },
    { id:29, name:'Titanium - Gold',      bg:'/templates/backgrounds/bg-13.jpg', overlay:'rgba(30,20,0,0.82)',   accent:'#ca8a04', headerBg:'rgba(60,40,0,0.92)',   rowEven:'rgba(28,18,0,0.85)',   rowOdd:'rgba(38,25,0,0.75)',   text:'#fff', sub:'#fde68a', type:'image' },
    { id:30, name:'Royal - Cyan',         bg:'/templates/backgrounds/bg-14.jpg', overlay:'rgba(0,35,45,0.80)',   accent:'#06b6d4', headerBg:'rgba(0,60,75,0.92)',   rowEven:'rgba(0,32,42,0.85)',   rowOdd:'rgba(0,44,56,0.75)',   text:'#fff', sub:'#67e8f9', type:'image' },
    { id:31, name:'Forest - Yellow',      bg:'/templates/backgrounds/bg-15.jpg', overlay:'rgba(35,30,0,0.80)',   accent:'#facc15', headerBg:'rgba(65,55,0,0.92)',   rowEven:'rgba(32,28,0,0.85)',   rowOdd:'rgba(44,38,0,0.75)',   text:'#fff', sub:'#fef08a', type:'image' },
    { id:32, name:'Diamond - Purple',     bg:'/templates/backgrounds/bg-16.jpg', overlay:'rgba(35,0,60,0.80)',   accent:'#7c3aed', headerBg:'rgba(60,0,100,0.92)',  rowEven:'rgba(32,0,55,0.85)',   rowOdd:'rgba(44,0,75,0.75)',   text:'#fff', sub:'#c4b5fd', type:'image' },
    // 8 Pro Custom
    { id:33, name:'⚡ Esports Pro',       bg:null, solidBg:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', accent:'#7c3aed', headerBg:'rgba(124,58,237,0.35)', rowEven:'rgba(124,58,237,0.10)', rowOdd:'rgba(80,30,180,0.06)', text:'#fff', sub:'#c4b5fd', type:'custom' },
    { id:34, name:'🔥 Fire League',       bg:null, solidBg:'linear-gradient(135deg,#1a0000,#3d0000,#1a0000)', accent:'#ef4444', headerBg:'rgba(239,68,68,0.30)',  rowEven:'rgba(239,68,68,0.10)',  rowOdd:'rgba(180,30,30,0.06)', text:'#fff', sub:'#fca5a5', type:'custom' },
    { id:35, name:'💎 Diamond Cup',       bg:null, solidBg:'linear-gradient(135deg,#000d1a,#001a33,#000d1a)', accent:'#06b6d4', headerBg:'rgba(6,182,212,0.28)',  rowEven:'rgba(6,182,212,0.10)',  rowOdd:'rgba(0,130,160,0.06)', text:'#fff', sub:'#67e8f9', type:'custom' },
    { id:36, name:'🏆 Gold Trophy',       bg:null, solidBg:'linear-gradient(135deg,#1a1000,#332200,#1a1000)', accent:'#f59e0b', headerBg:'rgba(245,158,11,0.28)', rowEven:'rgba(245,158,11,0.10)', rowOdd:'rgba(180,110,0,0.06)', text:'#fff', sub:'#fde68a', type:'custom' },
    { id:37, name:'🌿 Neon Jungle',       bg:null, solidBg:'linear-gradient(135deg,#001a00,#003300,#001a00)', accent:'#22c55e', headerBg:'rgba(34,197,94,0.28)',  rowEven:'rgba(34,197,94,0.10)',  rowOdd:'rgba(20,140,60,0.06)', text:'#fff', sub:'#86efac', type:'custom' },
    { id:38, name:'🌌 Cosmic Arena',      bg:null, solidBg:'linear-gradient(135deg,#050010,#0d0028,#050010)', accent:'#e879f9', headerBg:'rgba(232,121,249,0.25)',rowEven:'rgba(232,121,249,0.08)',rowOdd:'rgba(160,60,200,0.05)',text:'#fff', sub:'#f0abfc', type:'custom' },
    { id:39, name:'❄️ Ice Championship',  bg:null, solidBg:'linear-gradient(135deg,#001428,#002a50,#001428)', accent:'#38bdf8', headerBg:'rgba(56,189,248,0.25)', rowEven:'rgba(56,189,248,0.08)', rowOdd:'rgba(20,130,200,0.05)',text:'#fff', sub:'#7dd3fc', type:'custom' },
    { id:40, name:'⚔️ Battle Royale',     bg:null, solidBg:'linear-gradient(135deg,#1a0a00,#330a00,#1a0a00)', accent:'#f97316', headerBg:'rgba(249,115,22,0.28)', rowEven:'rgba(249,115,22,0.10)', rowOdd:'rgba(180,70,0,0.06)',  text:'#fff', sub:'#fdba74', type:'custom' },
  ];

  const POINTS = {
    'Free Fire': { placement:{1:12,2:9,3:8,4:7,5:6,6:5,7:4,8:3,9:2,10:1,11:0,12:0}, killPoints:1 },
    'BGMI':      { placement:{1:10,2:6,3:5,4:4,5:3,6:2,7:1,8:1},                     killPoints:1 },
    'Valorant':  { placement:{1:5,2:3,3:2,4:1},                                        killPoints:0 },
  };

  const getPlacementPts=(game,pos)=>POINTS[game]?.placement[parseInt(pos)]||0;
  const getKillPts=(game)=>POINTS[game]?.killPoints||1;
  const calcTotal=(game,pos,kills)=>getPlacementPts(game,pos)+(parseInt(kills||0)*getKillPts(game));

  useEffect(()=>{
    const token=localStorage.getItem('token');
    if(!token){router.push('/login');return;}
    fetchData();
  },[tournamentId]);

  const fetchData=async()=>{
    try{
      const token=localStorage.getItem('token');
      const [tRes,mRes]=await Promise.all([
        fetch(`http://localhost:3001/api/tournaments/${tournamentId}`,{headers:{'Authorization':`Bearer ${token}`}}),
        fetch(`http://localhost:3001/api/tournaments/${tournamentId}/matches`,{headers:{'Authorization':`Bearer ${token}`}}),
      ]);
      if(tRes.ok)setTournament(await tRes.json());
      if(mRes.ok)setMatches(await mRes.json());
    }catch(e){console.error(e);}
    finally{setLoading(false);}
  };

  const teamStandings=matches.reduce((acc,m)=>{
    if(!acc[m.team_name])acc[m.team_name]={
      team_name:m.team_name,total_points:0,kill_points:0,
      placement_points:0,booyah:0,matches_played:0,total_kills:0
    };
    const pp=getPlacementPts(tournament?.game,m.position);
    const kp=parseInt(m.kills||0)*getKillPts(tournament?.game);
    acc[m.team_name].total_points+=pp+kp;
    acc[m.team_name].kill_points+=kp;
    acc[m.team_name].placement_points+=pp;
    acc[m.team_name].total_kills+=parseInt(m.kills||0);
    acc[m.team_name].matches_played+=1;
    if(parseInt(m.position)===1)acc[m.team_name].booyah+=1;
    return acc;
  },{});
  const standings=Object.values(teamStandings).sort((a,b)=>b.total_points-a.total_points);
  const totalMatches=[...new Set(matches.map(m=>m.match_number))].length;

  const handleDownload=async()=>{
    if(!selectedTemplate)return;
    setDownloading(true);
    try{
      const html2canvas=(await import('html2canvas')).default;
      const el=document.getElementById('export-canvas');
      const canvas=await html2canvas(el,{scale:3,useCORS:true,allowTaint:true,logging:false,backgroundColor:null});
      const link=document.createElement('a');
      link.download=`${tournament?.name}-standings.png`;
      link.href=canvas.toDataURL('image/png');
      link.click();
    }catch(e){alert('Download failed!');}
    setDownloading(false);
  };

  if(loading)return(
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  );

  const t=selectedTemplate;

  if(view==='grid')return(
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={()=>router.push(`/tournaments/${tournamentId}`)}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition">
          ← Back
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black text-white">Choose Template</h1>
          <p className="text-gray-500 text-xs">{templates.length} Designs</p>
        </div>
        <div className="w-20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <Section title="Original Templates" count={16} templates={templates.filter(t=>t.type==='image'&&t.id<=16)} 
          onSelect={(tmpl)=>{setSelectedTemplate(tmpl);setView('preview');}}/>
        <Section title="Color Variants" count={16} templates={templates.filter(t=>t.type==='image'&&t.id>=17&&t.id<=32)}
          onSelect={(tmpl)=>{setSelectedTemplate(tmpl);setView('preview');}}/>
        <Section title="Pro Custom" count={8} templates={templates.filter(t=>t.type==='custom')}
          onSelect={(tmpl)=>{setSelectedTemplate(tmpl);setView('preview');}}/>

        <div className="grid grid-cols-3 gap-4">
          {[{l:'Teams',v:standings.length,c:'#60a5fa'},{l:'Matches',v:totalMatches,c:'#4ade80'},{l:'Top Score',v:standings[0]?.total_points||0,c:'#fbbf24'}].map(s=>(
            <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
              <p className="text-4xl font-black" style={{color:s.c}}>{s.v}</p>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-semibold">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return(
    <div className="min-h-screen text-white" style={{background:'#0a0a0f'}}>
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{background:'rgba(10,10,15,0.95)',backdropFilter:'blur(10px)'}}>
        <button onClick={()=>setView('grid')}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition">
          ← Templates
        </button>
        <div className="text-center">
          <p className="text-white font-bold text-sm">{t?.name}</p>
          <p className="text-gray-500 text-xs">{tournament?.name}</p>
        </div>
        <button onClick={handleDownload} disabled={downloading}
          className="px-6 py-2 rounded-lg font-black text-sm transition active:scale-95"
          style={{background:downloading?'#555':t?.accent,color:'#000'}}>
          {downloading?'⏳ Generating...':'⬇️ Download PNG'}
        </button>
      </div>

      <div className="flex flex-col items-center py-8 px-4">
        <div id="export-canvas" style={{width:'900px',maxWidth:'100vw',minHeight:'500px',position:'relative',overflow:'hidden',
          fontFamily:"'Arial Black',Arial,sans-serif",...(t?.type==='custom'?{background:t?.solidBg}:{})}}>
          {t?.type==='image'&&<img src={t.bg} alt="" crossOrigin="anonymous" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>}
          {t?.type==='image'&&<div style={{position:'absolute',inset:0,background:t.overlay}}></div>}

          <div style={{position:'relative',zIndex:1,padding:'44px 48px'}}>
            <div style={{textAlign:'center',marginBottom:'30px'}}>
              <h1 style={{color:'#fff',fontSize:'40px',fontWeight:'900',letterSpacing:'6px',margin:'0 0 6px',textTransform:'uppercase',
                textShadow:`0 0 40px ${t?.accent},0 2px 8px rgba(0,0,0,0.9)`}}>
                {tournament?.name?.toUpperCase()}
              </h1>
              <p style={{color:t?.accent,fontSize:'12px',fontWeight:'800',letterSpacing:'5px',margin:0,textTransform:'uppercase',
                textShadow:'0 1px 4px rgba(0,0,0,0.9)'}}>
                {tournament?.game?.toUpperCase()} — OVERALL STANDINGS
              </p>
              <div style={{margin:'16px auto 0',width:'60%',height:'2px',background:`linear-gradient(90deg,transparent,${t?.accent},transparent)`}}></div>
            </div>

            <table style={{width:'100%',borderCollapse:'collapse',tableLayout:'fixed'}}>
              <colgroup><col style={{width:'10%'}}/><col style={{width:'28%'}}/><col style={{width:'10%'}}/><col style={{width:'12%'}}/><col style={{width:'10%'}}/><col style={{width:'10%'}}/><col style={{width:'12%'}}/></colgroup>
              <thead>
                <tr style={{background:t?.headerBg,borderBottom:`2px solid ${t?.accent}`}}>
                  {['RANK','TEAM NAME','M','BOOYAH','P.P.','K.P.','TOTAL P.'].map((col,i)=>(
                    <th key={col} style={{color:t?.accent,fontSize:'10px',fontWeight:'900',letterSpacing:'1.5px',padding:'13px 10px',
                      textAlign:i<=1?'left':'center',textTransform:'uppercase'}}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {standings.length===0?(
                  <tr><td colSpan={7} style={{color:t?.sub,textAlign:'center',padding:'40px',fontSize:'14px'}}>No data</td></tr>
                ):standings.map((team,i)=>{
                  const rankBg=i===0?`linear-gradient(90deg,${t?.accent}22,${t?.rowEven})`:
                               i===1?`linear-gradient(90deg,rgba(192,192,192,0.12),${t?.rowOdd})`:
                               i===2?`linear-gradient(90deg,rgba(205,127,50,0.12),${t?.rowEven})`:
                               i%2===0?t?.rowEven:t?.rowOdd;
                  const barColor=i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':t?.accent;
                  const ptColor=i===0?'#FFD700':i===1?'#E0E0E0':i===2?'#CD7F32':t?.accent;
                  return(
                    <tr key={team.team_name} style={{background:rankBg,borderBottom:`1px solid ${t?.accent}25`}}>
                      <td style={{padding:'12px 10px',textAlign:'left'}}>
                        {i===0?<span style={{fontSize:'20px'}}>🥇</span>:i===1?<span style={{fontSize:'20px'}}>🥈</span>:i===2?<span style={{fontSize:'20px'}}>🥉</span>:
                        <span style={{color:t?.sub,fontSize:'14px',fontWeight:'900'}}>{`#${i+1}`}</span>}
                      </td>
                      <td style={{padding:'12px 10px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                          <div style={{width:'4px',height:'28px',borderRadius:'2px',flexShrink:0,background:barColor,
                            opacity:i>2?0.5:1,boxShadow:`0 0 ${i<3?'8':'6'}px ${barColor}`}}></div>
                          <span style={{color:'#fff',fontSize:'14px',fontWeight:'700',textShadow:'0 1px 3px rgba(0,0,0,0.8)'}}>
                            {team.team_name}
                          </span>
                        </div>
                      </td>
                      <td style={{padding:'12px 10px',textAlign:'center',color:t?.sub,fontSize:'13px',fontWeight:'700'}}>{team.matches_played}</td>
                      <td style={{padding:'12px 10px',textAlign:'center'}}>
                        <span style={{color:team.booyah>0?'#FFD700':`${t?.sub}88`,fontSize:'13px',fontWeight:'900',
                          textShadow:team.booyah>0?'0 0 8px #FFD70088':'none'}}>
                          {team.booyah>0?`🏆 ${team.booyah}`:'—'}
                        </span>
                      </td>
                      <td style={{padding:'12px 10px',textAlign:'center',color:t?.sub,fontSize:'13px',fontWeight:'700'}}>{team.placement_points}</td>
                      <td style={{padding:'12px 10px',textAlign:'center',color:t?.sub,fontSize:'13px',fontWeight:'700'}}>{team.kill_points}</td>
                      <td style={{padding:'12px 10px',textAlign:'center'}}>
                        <span style={{color:ptColor,fontSize:'22px',fontWeight:'900',textShadow:i===0?'0 0 15px #FFD70099':`0 0 10px ${t?.accent}88`}}>
                          {team.total_points}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{marginTop:'22px',paddingTop:'14px',borderTop:`1px solid ${t?.accent}30`,textAlign:'center'}}>
              <p style={{color:`${t?.sub}66`,fontSize:'9px',letterSpacing:'3px',margin:0,textTransform:'uppercase'}}>
                POWERED BY VINCI-ARENA • TRACK. CALCULATE. WIN.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button onClick={handleDownload} disabled={downloading}
            className="font-black px-10 py-4 rounded-xl text-base transition active:scale-95 shadow-xl"
            style={{background:downloading?'#666':t?.accent,color:'#000',boxShadow:`0 8px 30px ${t?.accent}55`}}>
            {downloading?'⏳ Generating...':'⬇️ Download PNG'}
          </button>
          <button onClick={()=>setView('grid')}
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold text-base transition active:scale-95">
            ← Back
          </button>
        </div>

        <div className="mt-6 flex gap-1.5 flex-wrap justify-center max-w-4xl">
          {templates.map(tmpl=>(
            <button key={tmpl.id} onClick={()=>setSelectedTemplate(tmpl)} title={tmpl.name}
              className={`relative rounded-lg overflow-hidden transition-all hover:scale-110 active:scale-95 ${
                selectedTemplate?.id===tmpl.id?'ring-2 ring-white scale-110':'ring-1 ring-gray-700 opacity-60 hover:opacity-100'}`}
              style={{width:'42px',height:'26px'}}>
              {tmpl.type==='image'?<><img src={tmpl.bg} alt="" className="w-full h-full object-cover"/>
              <div className="absolute inset-0" style={{background:tmpl.overlay}}></div></>:
              <div className="w-full h-full" style={{background:tmpl.solidBg}}></div>}
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{background:tmpl.accent}}></div>
            </button>
          ))}
        </div>
        <p className="text-gray-600 text-xs mt-2">40 templates • Click to switch</p>
      </div>
    </div>
  );
}

function Section({title,count,templates,onSelect}){
  return(
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-7 bg-blue-500 rounded-full"></div>
        <h2 className="text-xl font-black text-white">{title}</h2>
        <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded-full">{count}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {templates.map(tmpl=>(
          <button key={tmpl.id} onClick={()=>onSelect(tmpl)}
            className="relative rounded-2xl overflow-hidden h-36 group transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
            style={{boxShadow:`0 4px 20px ${tmpl.accent}33`}}>
            {tmpl.type==='image'?<><img src={tmpl.bg} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"/>
            <div className="absolute inset-0" style={{background:tmpl.overlay}}></div></>:
            <><div className="absolute inset-0" style={{background:tmpl.solidBg}}></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition" style={{background:`radial-gradient(ellipse at center,${tmpl.accent}30,transparent 65%)`}}></div></>}
            <div className="absolute top-0 left-0 right-0 h-1" style={{background:tmpl.accent}}></div>
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{background:tmpl.accent}}></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
              <span className="text-white text-xs font-black text-center leading-tight drop-shadow-lg"
                style={{textShadow:'0 2px 8px rgba(0,0,0,0.95)'}}>{tmpl.name}</span>
              <div className="mt-2 px-2 py-0.5 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                style={{background:tmpl.accent,color:'#000'}}>Preview →</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
