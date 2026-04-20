'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

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

function CyberInput({label,value,onChange,placeholder,multiline=false,color=C.cyan}){
  const [foc,setFoc]=useState(false);
  const s={width:'100%',background:foc?'#080812':'#050508',border:`1px solid ${foc?color:color+'25'}`,borderRadius:8,color:'#e2e8f0',fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:14,padding:'10px 14px',outline:'none',transition:'all .2s',boxSizing:'border-box',boxShadow:foc?`0 0 14px ${color}15`:'none'};
  return(
    <div>
      {label&&<label style={{display:'block',fontSize:10,fontWeight:900,color:'rgba(255,255,255,0.25)',letterSpacing:3,marginBottom:6,fontFamily:"'Orbitron',sans-serif"}}>{label}</label>}
      {multiline
        ?<textarea rows={3} placeholder={placeholder} value={value} onChange={onChange} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} style={{...s,resize:'vertical'}}/>
        :<input placeholder={placeholder} value={value} onChange={onChange} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} style={s}/>
      }
    </div>
  );
}

function CyberSelect({label,value,onChange,options,color=C.cyan}){
  return(
    <div>
      {label&&<label style={{display:'block',fontSize:10,fontWeight:900,color:'rgba(255,255,255,0.25)',letterSpacing:3,marginBottom:6,fontFamily:"'Orbitron',sans-serif"}}>{label}</label>}
      <select value={value} onChange={onChange} style={{width:'100%',background:'#050508',border:`1px solid ${color}25`,borderRadius:8,color:'#e2e8f0',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,padding:'10px 14px',outline:'none',boxSizing:'border-box',cursor:'pointer'}}>
        {options.map(o=><option key={o.val||o} value={o.val||o} style={{background:'#050510'}}>{o.label||o}</option>)}
      </select>
    </div>
  );
}

// ── Pending Join Requests ────────────────────────────────────────────────────
function JoinRequests({squadId}){
  const [requests,setRequests]=useState([]);
  const [loading,setLoading]=useState(true);
  const [acting,setActing]=useState({});

  useEffect(()=>{ fetchRequests(); },[squadId]);

  const fetchRequests=async()=>{
    try{
      const token=localStorage.getItem('token');
      const res=await fetch(`http://localhost:3001/api/squads/${squadId}/requests`,{headers:{Authorization:`Bearer ${token}`}});
      if(res.ok) setRequests(await res.json());
    }catch{}
    finally{setLoading(false);}
  };

  const handleAction=async(reqId,status)=>{
    setActing(p=>({...p,[reqId]:true}));
    try{
      const token=localStorage.getItem('token');
      const res=await fetch(`http://localhost:3001/api/squads/${squadId}/requests/${reqId}`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
        body:JSON.stringify({status}),
      });
      if(res.ok){
        setRequests(p=>p.filter(r=>r.id!==reqId));
      }else{
        const d=await res.json();
        alert(d.error||'Failed');
      }
    }catch{ alert('Error'); }
    finally{setActing(p=>({...p,[reqId]:false}));}
  };

  if(loading) return(
    <div style={{background:C.card,border:'1px solid rgba(0,255,255,0.07)',borderRadius:14,padding:20,marginBottom:16,textAlign:'center'}}>
      <div style={{fontSize:10,color:'#334155',fontFamily:"'Share Tech Mono',monospace"}}>Loading requests...</div>
    </div>
  );

  return(
    <div style={{background:C.card,border:`1px solid ${requests.length>0?'rgba(239,68,68,0.3)':'rgba(0,255,255,0.07)'}`,borderRadius:14,padding:20,marginBottom:16,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,${requests.length>0?C.red:'rgba(0,255,255,0.3)'},transparent)`}}/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:requests.length>0?'rgba(239,68,68,0.7)':'rgba(0,255,255,0.5)',letterSpacing:3,margin:0}}>// JOIN REQUESTS</p>
        {requests.length>0&&<span style={{fontSize:10,fontWeight:600,padding:'2px 8px',borderRadius:20,background:'rgba(239,68,68,0.15)',color:C.red,border:'1px solid rgba(239,68,68,0.3)',fontFamily:"'Share Tech Mono',monospace"}}>{requests.length} pending</span>}
      </div>

      {requests.length===0?(
        <div style={{textAlign:'center',padding:'16px 0'}}>
          <div style={{fontSize:20,marginBottom:8,opacity:.3}}>📭</div>
          <div style={{fontSize:11,color:'#334155',fontFamily:"'Share Tech Mono',monospace"}}>No pending join requests</div>
        </div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {requests.map(req=>(
            <div key={req.id} style={{background:C.card2,border:'1px solid rgba(239,68,68,0.12)',borderRadius:12,padding:14,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',left:0,top:0,bottom:0,width:2,background:'rgba(239,68,68,0.4)'}}/>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(168,85,247,0.2)',border:'1px solid rgba(168,85,247,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:900,color:C.purple}}>
                    {(req.users?.name||'?').slice(0,1).toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:'#e2e8f0',fontFamily:"'Rajdhani',sans-serif"}}>{req.users?.name||'Unknown'}</div>
                    <div style={{fontSize:10,color:'#475569',fontFamily:"'Share Tech Mono',monospace"}}>{new Date(req.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>handleAction(req.id,'accepted')} disabled={acting[req.id]} style={{padding:'6px 14px',borderRadius:8,background:'rgba(0,255,136,0.1)',border:'1px solid rgba(0,255,136,0.35)',color:C.green,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1,opacity:acting[req.id]?.5:1}}>
                    {acting[req.id]?'...':'✓ Accept'}
                  </button>
                  <button onClick={()=>handleAction(req.id,'rejected')} disabled={acting[req.id]} style={{padding:'6px 14px',borderRadius:8,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:C.red,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1,opacity:acting[req.id]?.5:1}}>
                    {acting[req.id]?'...':'✕ Reject'}
                  </button>
                </div>
              </div>
              {req.message&&(
                <div style={{marginTop:10,padding:'8px 12px',borderRadius:8,background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.06)',fontSize:12,color:'#64748b',fontFamily:"'Rajdhani',sans-serif",fontStyle:'italic'}}>
                  "{req.message}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Member Manager ───────────────────────────────────────────────────────────
function MemberManager({squadId, members, onRefresh}){
  const [acting,setActing]=useState({});
  const ROLES=['member','igl','fragger','sniper','support','sub'];

  const kickMember=async(userId,name)=>{
    if(!confirm(`Kick ${name} from the squad?`)) return;
    setActing(p=>({...p,[userId]:'kicking'}));
    try{
      const token=localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/squads/${squadId}/members/${userId}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
      onRefresh();
    }catch{ alert('Failed to kick'); }
    finally{setActing(p=>({...p,[userId]:undefined}));}
  };

  const changeRole=async(userId,role)=>{
    setActing(p=>({...p,[userId]:'role'}));
    try{
      const token=localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/squads/${squadId}/members/${userId}/role`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
        body:JSON.stringify({role}),
      });
      onRefresh();
    }catch{ alert('Failed to change role'); }
    finally{setActing(p=>({...p,[userId]:undefined}));}
  };

  const roleColors={leader:C.gold,igl:C.purple,fragger:C.red,sniper:C.orange,support:C.cyan,sub:C.green,member:'#64748b'};

  return(
    <div style={{background:C.card,border:'1px solid rgba(0,255,255,0.07)',borderRadius:14,padding:20,marginBottom:16,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1.5,background:'linear-gradient(90deg,rgba(0,255,255,0.3),transparent)'}}/>
      <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:'rgba(0,255,255,0.55)',letterSpacing:3,marginBottom:14}}>// MANAGE MEMBERS</p>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {members.filter(m=>m.is_active).map(m=>{
          const name=m.users?.name||m.in_game_name||'Player';
          const rc=roleColors[m.role?.toLowerCase()]||'#64748b';
          const isLeaderMember=m.role==='leader';
          return(
            <div key={m.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:C.card2,border:`1px solid ${isLeaderMember?'rgba(251,191,36,0.2)':'rgba(0,255,255,0.06)'}`,borderRadius:10,flexWrap:'wrap'}}>
              <div style={{width:34,height:34,borderRadius:'50%',background:rc+'22',border:`1px solid ${rc}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Orbitron',sans-serif",fontSize:11,fontWeight:900,color:rc,flexShrink:0}}>
                {name.slice(0,1).toUpperCase()}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'#e2e8f0',fontFamily:"'Rajdhani',sans-serif"}}>{name} {isLeaderMember&&'♔'}</div>
                <div style={{fontSize:10,color:'#475569',fontFamily:"'Share Tech Mono',monospace"}}>{m.in_game_name||'—'}</div>
              </div>
              {!isLeaderMember&&(
                <div style={{display:'flex',gap:6,alignItems:'center'}}>
                  <select value={m.role||'member'} onChange={e=>changeRole(m.user_id,e.target.value)} disabled={!!acting[m.user_id]} style={{background:'#080812',border:'1px solid rgba(0,255,255,0.15)',borderRadius:6,color:'#e2e8f0',fontFamily:"'Share Tech Mono',monospace",fontSize:10,padding:'4px 8px',outline:'none',cursor:'pointer'}}>
                    {ROLES.map(r=><option key={r} value={r} style={{background:'#050510'}}>{r}</option>)}
                  </select>
                  <button onClick={()=>kickMember(m.user_id,name)} disabled={!!acting[m.user_id]} style={{padding:'4px 10px',borderRadius:6,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.22)',color:C.red,fontFamily:"'Share Tech Mono',monospace",fontSize:10,cursor:'pointer',opacity:acting[m.user_id]?.5:1}}>
                    {acting[m.user_id]==='kicking'?'...':'Kick'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EditSquadPage(){
  const router=useRouter();
  const params=useParams();
  const squadId=params.id;

  const [squad,setSquad]=useState(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [isLeader,setIsLeader]=useState(false);
  const [form,setForm]=useState({name:'',tag:'',bio:'',game:'Free Fire',region:'India',logo_url:'',banner_url:''});

  useEffect(()=>{ fetchSquad(); },[squadId]);

  const fetchSquad=async()=>{
    try{
      const token=localStorage.getItem('token');
      if(!token){router.push('/login');return;}
      const res=await fetch(`http://localhost:3001/api/squads/${squadId}`,{headers:{Authorization:`Bearer ${token}`}});
      if(!res.ok){router.push('/squads');return;}
      const data=await res.json();
      setSquad(data);
      setForm({name:data.name||'',tag:data.tag||'',bio:data.bio||'',game:data.game||'Free Fire',region:data.region||'India',logo_url:data.logo_url||'',banner_url:data.banner_url||''});
      const userId=localStorage.getItem('userId');
      const leader=data.squad_members?.find(m=>m.role==='leader'&&m.user_id===userId);
      if(!leader){router.push(`/squads/${squadId}`);return;}
      setIsLeader(true);
    }catch{router.push('/squads');}
    finally{setLoading(false);}
  };

  const handleSave=async()=>{
    if(!form.name.trim()){alert('Squad name is required');return;}
    setSaving(true);
    try{
      const token=localStorage.getItem('token');
      const res=await fetch(`http://localhost:3001/api/squads/${squadId}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
        body:JSON.stringify(form),
      });
      if(res.ok){
        alert('Squad updated!');
        router.push(`/squads/${squadId}`);
      }else{
        const d=await res.json();
        alert(d.error||'Failed to update');
      }
    }catch{alert('Error saving');}
    finally{setSaving(false);}
  };

  if(loading) return(
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',paddingTop:104}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:48,height:48,border:`3px solid rgba(239,68,68,0.2)`,borderTopColor:C.red,borderRadius:'50%',animation:'spin .8s linear infinite'}}/>
    </div>
  );

  const activeMembers=squad?.squad_members?.filter(m=>m.is_active)||[];

  return(
    <div style={{minHeight:'100vh',background:C.bg,color:'#e2e8f0',paddingTop:104,paddingBottom:60,position:'relative',fontFamily:"'Rajdhani',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;600&family=Share+Tech+Mono&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box}
        textarea::placeholder,input::placeholder{color:#1e293b}
        select option{background:#050510}
      `}</style>

      <ScanLine/>
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',backgroundImage:'linear-gradient(rgba(0,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.025) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>

      <div style={{maxWidth:700,margin:'0 auto',padding:'0 20px',position:'relative',zIndex:2}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28,flexWrap:'wrap',gap:12}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <div style={{height:1,width:24,background:`linear-gradient(90deg,transparent,${C.cyan})`}}/>
              <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:C.cyan,letterSpacing:3}}>// EDIT SQUAD</span>
            </div>
            <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:900,color:'#fff',margin:0,textShadow:'0 0 24px rgba(239,68,68,0.25)'}}>{squad?.name}</h1>
          </div>
          <button onClick={()=>router.push(`/squads/${squadId}`)} style={{padding:'8px 18px',borderRadius:10,background:'transparent',border:'1px solid rgba(0,255,255,0.2)',color:C.cyan,fontFamily:"'Orbitron',sans-serif",fontSize:9,cursor:'pointer',letterSpacing:1}}>
            ← Back to Squad
          </button>
        </div>

        {/* ── JOIN REQUESTS (top — most important for leader) ── */}
        <JoinRequests squadId={squadId}/>

        {/* ── MEMBER MANAGER ── */}
        <MemberManager squadId={squadId} members={activeMembers} onRefresh={fetchSquad}/>

        {/* ── SQUAD DETAILS FORM ── */}
        <div style={{background:C.card,border:'1px solid rgba(239,68,68,0.15)',borderRadius:14,padding:24,marginBottom:16,position:'relative',overflow:'hidden',animation:'fadeUp .4s ease'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:1.5,background:'linear-gradient(90deg,#ef4444,transparent)'}}/>
          <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:'rgba(239,68,68,0.6)',letterSpacing:3,marginBottom:18}}>// SQUAD DETAILS</p>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <CyberInput label="SQUAD NAME *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. VORTEX XTREME" color={C.red}/>
            <CyberInput label="TAG (MAX 5 CHARS)" value={form.tag} onChange={e=>setForm(p=>({...p,tag:e.target.value.slice(0,5).toUpperCase()}))} placeholder="e.g. VXRT" color={C.red}/>
          </div>
          <div style={{marginBottom:16}}>
            <CyberInput label="BIO" value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} placeholder="Tell the world about your squad..." multiline color={C.red}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <CyberSelect label="GAME" value={form.game} onChange={e=>setForm(p=>({...p,game:e.target.value}))} options={['Free Fire','BGMI','Valorant']} color={C.red}/>
            <CyberSelect label="REGION" value={form.region} onChange={e=>setForm(p=>({...p,region:e.target.value}))} options={['India','Global','Asia','Europe','Americas']} color={C.red}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <CyberInput label="LOGO URL" value={form.logo_url} onChange={e=>setForm(p=>({...p,logo_url:e.target.value}))} placeholder="https://..." color={C.purple}/>
            <CyberInput label="BANNER URL" value={form.banner_url} onChange={e=>setForm(p=>({...p,banner_url:e.target.value}))} placeholder="https://..." color={C.purple}/>
          </div>
        </div>

        {/* Save + Delete */}
        <div style={{display:'flex',gap:12}}>
          <button onClick={handleSave} disabled={saving||!form.name.trim()} style={{flex:1,padding:'13px 0',borderRadius:10,background:form.name.trim()?'linear-gradient(135deg,#ef4444,#dc2626)':'rgba(255,255,255,0.03)',border:`1px solid ${form.name.trim()?C.red:'rgba(255,255,255,0.06)'}`,color:form.name.trim()?'#fff':'#334155',fontFamily:"'Orbitron',sans-serif",fontWeight:900,fontSize:11,letterSpacing:2,cursor:form.name.trim()?'pointer':'not-allowed',boxShadow:form.name.trim()?'0 0 25px rgba(239,68,68,0.3)':'none',transition:'all .2s'}}>
            {saving?'⟳ Saving...':'💾 Save Changes'}
          </button>
          <button onClick={async()=>{
            if(!confirm('Delete this squad? Cannot be undone.'))return;
            const token=localStorage.getItem('token');
            await fetch(`http://localhost:3001/api/squads/${squadId}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
            router.push('/squads');
          }} style={{padding:'13px 20px',borderRadius:10,background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',color:'rgba(239,68,68,0.5)',fontFamily:"'Orbitron',sans-serif",fontSize:10,cursor:'pointer',letterSpacing:1}}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}