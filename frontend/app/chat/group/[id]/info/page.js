'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { API_URL, getToken } from '@/app/utils/chat';
import '@/app/chat/chat.css';

export default function GroupInfoPage() {
  const router = useRouter();
  const params = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchGroupInfo();
    fetchMembers();
  }, []);

  const fetchGroupInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat/groups/${params.id}/info`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) setGroup(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat/groups/${params.id}/members`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) setMembers(await res.json());
    } catch (err) { console.error(err); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(group?.group_code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div style={{minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'}}>
        <div style={{width: '40px', height: '40px', border: '2px solid rgba(168,85,247,0.1)', borderTop: '2px solid #a855f7', borderRadius: '50%', animation: 'spin 1s linear infinite'}}/>
        <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: 'rgba(168,85,247,0.5)', letterSpacing: '3px'}}>LOADING...</p>
      </div>
    </div>
  );

  const adminMember = members.find(m => m.role === 'admin');
  const gradients = ['#dc2626,#9333ea','#2563eb,#9333ea','#16a34a,#2563eb','#ca8a04,#ea580c','#db2777,#dc2626'];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050510',
      color: '#e2e8f0',
      fontFamily: "'Rajdhani', sans-serif",
      paddingTop: '44px'
    }}>
      <style>{`
       
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 20px rgba(168,85,247,0.3); }
          50% { box-shadow: 0 0 40px rgba(168,85,247,0.6); }
        }
        .cyber-grid {
          background-image:
            linear-gradient(rgba(168,85,247,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .member-row:hover { background: rgba(168,85,247,0.08) !important; cursor: pointer; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #a855f7; }
      `}</style>

      {/* HERO BANNER */}
      <div style={{
        height: '180px',
        background: 'linear-gradient(135deg, #0a0014 0%, #050510 50%, #00040a 100%)',
        borderBottom: '1px solid rgba(168,85,247,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Grid */}
        <div className="cyber-grid" style={{position: 'absolute', inset: 0, opacity: 0.6}}/>

        {/* Glow orbs */}
        <div style={{position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent)'}}/>
        <div style={{position: 'absolute', bottom: '-30px', left: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,255,0.08), transparent)'}}/>

        {/* Scan line */}
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168,85,247,0.01) 2px, rgba(168,85,247,0.01) 4px)'}}/>

        {/* Gradient overlay */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050510, transparent)'}}/>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          style={{
            position: 'absolute', top: '16px', left: '16px',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(0,255,255,0.2)',
            borderRadius: '6px',
            color: '#00ffff',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '2px',
            padding: '6px 14px',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)'
          }}>← BACK</button>

        {/* Open chat button */}
        <button
          onClick={() => router.push(`/chat/group/${params.id}`)}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '6px',
            color: '#ef4444',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '2px',
            padding: '6px 14px',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(239,68,68,0.2)'
          }}>💬 OPEN CHAT</button>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth: '680px', margin: '0 auto', padding: '0 24px 40px'}}>

        {/* GROUP AVATAR + NAME */}
        <div style={{display: 'flex', alignItems: 'flex-end', gap: '20px', marginTop: '-50px', marginBottom: '24px'}}>
          <div style={{
            width: '100px', height: '100px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: '16px',
            border: '3px solid #050510',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: '900',
            fontSize: '36px',
            color: 'white',
            flexShrink: 0,
            animation: 'pulseGlow 3s infinite'
          }}>
            {group?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{paddingBottom: '8px', flex: 1}}>
            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '22px',
              fontWeight: '900',
              color: '#e2e8f0',
              letterSpacing: '2px',
              textShadow: '0 0 20px rgba(168,85,247,0.4)',
              margin: '0 0 4px'
            }}>{group?.name?.toUpperCase() || 'GROUP'}</h1>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <span style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: 'rgba(168,85,247,0.6)'}}>
                👥 {members.length} MEMBERS
              </span>
              {adminMember && (
                <span style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)'}}>
                  · BY {adminMember.users?.name?.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* GROUP CODE CARD */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0a1a, #0d0520)',
          border: '1px solid rgba(168,85,247,0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 0 30px rgba(168,85,247,0.08)'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: 'rgba(168,85,247,0.6)', letterSpacing: '3px', margin: 0}}>
              ⚡ GROUP CODE
            </p>
            <button
              onClick={copyCode}
              style={{
                padding: '6px 16px',
                background: copied ? 'rgba(0,255,136,0.1)' : 'rgba(168,85,247,0.1)',
                border: `1px solid ${copied ? 'rgba(0,255,136,0.4)' : 'rgba(168,85,247,0.4)'}`,
                borderRadius: '6px',
                color: copied ? '#00ff88' : '#a855f7',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: '700',
                fontSize: '10px',
                letterSpacing: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
              {copied ? '✅ COPIED!' : '📋 COPY'}
            </button>
          </div>

          {/* Code chars */}
          <div style={{display: 'flex', justifyContent: 'center', gap: '6px', padding: '8px 0'}}>
            {(group?.group_code || 'XXXXXX').split('').map((char, i) => (
              <div key={i} style={{
                width: '44px', height: '52px',
                background: '#080818',
                border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: '900',
                fontSize: '20px',
                color: '#a855f7',
                textShadow: '0 0 10px rgba(168,85,247,0.6)',
                boxShadow: '0 0 10px rgba(168,85,247,0.1)'
              }}>{char}</div>
            ))}
          </div>
          <p style={{textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.2)', margin: '12px 0 0'}}>
            // share this code to invite players
          </p>
        </div>

        {/* DESCRIPTION */}
        <div style={{
          background: '#080818',
          border: '1px solid rgba(0,255,255,0.1)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '16px'
        }}>
          <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: 'rgba(0,255,255,0.4)', letterSpacing: '3px', marginBottom: '8px'}}>// ABOUT</p>
          <p style={{fontFamily: "'Rajdhani', sans-serif", fontSize: '14px', color: group?.description ? '#e2e8f0' : 'rgba(255,255,255,0.2)', margin: 0}}>
            {group?.description || '// no description added'}
          </p>
        </div>

        {/* STATS ROW */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px'}}>
          {[
            {label: 'MEMBERS', value: members.length, color: '#a855f7'},
            {label: 'ADMINS', value: members.filter(m => m.role === 'admin').length, color: '#ef4444'},
            {label: 'TYPE', value: group?.chat_type?.toUpperCase() || 'PUBLIC', color: '#00ffff'},
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#080818',
              border: `1px solid rgba(${i===0?'168,85,247':i===1?'239,68,68':'0,255,255'},0.15)`,
              borderRadius: '10px',
              padding: '14px',
              textAlign: 'center'
            }}>
              <div style={{fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '22px', color: stat.color, textShadow: `0 0 10px ${stat.color}60`}}>{stat.value}</div>
              <div style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', marginTop: '4px'}}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* MEMBERS LIST */}
        <div style={{
          background: '#080818',
          border: '1px solid rgba(168,85,247,0.15)',
          borderRadius: '12px',
          padding: '16px 20px'
        }}>
          <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: 'rgba(168,85,247,0.5)', letterSpacing: '3px', marginBottom: '14px'}}>
            // SQUAD MEMBERS ({members.length})
          </p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
            {members.map((member, i) => (
              <Link href={`/profile/${member.user_id}`} key={i}>
                <div className="member-row" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(168,85,247,0.03)',
                  border: '1px solid rgba(168,85,247,0.06)',
                  transition: 'all 0.2s'
                }}>
                  <div style={{
                    width: '36px', height: '36px',
                    background: `linear-gradient(135deg, ${gradients[i % 5]})`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: '900',
                    fontSize: '13px',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    {member.users?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{flex: 1}}>
                    <p style={{fontFamily: "'Orbitron', sans-serif", fontWeight: '700', fontSize: '12px', color: '#e2e8f0', margin: 0, letterSpacing: '1px'}}>
                      {member.users?.name?.toUpperCase()}
                    </p>
                    <p style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.25)', margin: 0}}>
                      {member.users?.email}
                    </p>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    {member.role === 'admin' && (
                      <span style={{
                        padding: '2px 8px',
                        background: 'rgba(245,158,11,0.1)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: '4px',
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: '9px',
                        color: '#f59e0b',
                        letterSpacing: '1px'
                      }}>👑 ADMIN</span>
                    )}
                    <span style={{color: 'rgba(168,85,247,0.3)', fontSize: '12px'}}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
