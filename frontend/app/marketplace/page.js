'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

/* ─── THEME — VINCI ARENA PRO PALETTE ─────────────────────────
   Psychology: Red = urgency/action, Cyan = trust/tech,
   Purple = prestige, Green = success, Amber = reward/premium
──────────────────────────────────────────────────────────────── */
const T = {
  bg:        '#050508',
  surface:   '#0a0a12',
  card:      '#0e0e18',
  cardHover: '#14141f',
  glass:     'rgba(255,255,255,0.025)',

  border:    'rgba(255,255,255,0.06)',
  borderHi:  'rgba(255,255,255,0.16)',

  red:       '#ff3b3b',
  redMid:    '#cc2e2e',
  redDim:    'rgba(255,59,59,0.12)',
  redGlow:   'rgba(255,59,59,0.4)',

  cyan:      '#00e5ff',
  cyanMid:   '#00b8cc',
  cyanDim:   'rgba(0,229,255,0.10)',
  cyanGlow:  'rgba(0,229,255,0.32)',

  purple:    '#b57aff',
  purpleMid: '#8c4fff',
  purpleDim: 'rgba(181,122,255,0.12)',
  purpleGlow:'rgba(181,122,255,0.32)',

  green:     '#00ff88',
  greenMid:  '#00cc6a',
  greenDim:  'rgba(0,255,136,0.10)',
  greenGlow: 'rgba(0,255,136,0.30)',

  amber:     '#ffb800',
  amberMid:  '#cc9200',
  amberDim:  'rgba(255,184,0,0.12)',
  amberGlow: 'rgba(255,184,0,0.30)',

  pink:      '#ff6eb4',
  pinkMid:   '#cc4d8a',
  pinkDim:   'rgba(255,110,180,0.12)',
  pinkGlow:  'rgba(255,110,180,0.30)',

  text:      '#f0f2fb',
  textMuted: '#6b7280',
  textDim:   '#374151',
};

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const GAMES = [
  { id: 'all',       label: 'All Games',  icon: '🎮' },
  { id: 'Free Fire', label: 'Free Fire',  icon: '🔥' },
  { id: 'BGMI',      label: 'BGMI',       icon: '🎯' },
  { id: 'Valorant',  label: 'Valorant',   icon: '⚡' },
];

const ROLES = [
  { id: 'all',             label: 'All Roles',       col: T.cyan   },
  { id: 'player',          label: 'Players Wanted',  col: T.red    },
  { id: 'squad',           label: 'Squad Recruit',   col: T.green  },
  { id: 'content_creator', label: 'Content Creator', col: T.pink   },
  { id: 'coach',           label: 'Coach Needed',    col: T.purple },
  { id: 'analyst',         label: 'Game Analyst',    col: T.amber  },
];

const QUICK_FILTERS = [
  { id: 'all',           label: 'All'           },
  { id: 'paid',          label: 'Paid'          },
  { id: 'revenue_share', label: 'Revenue Share' },
  { id: 'pro',           label: 'Pro'           },
  { id: 'amateur',       label: 'Amateur'       },
];

const ROLE_META = {
  player:          { icon: '◉', color: T.red,    dim: T.redDim,    glow: T.redGlow,    label: 'Player'          },
  squad:           { icon: '◈', color: T.green,  dim: T.greenDim,  glow: T.greenGlow,  label: 'Squad'           },
  content_creator: { icon: '◎', color: T.pink,   dim: T.pinkDim,   glow: T.pinkGlow,   label: 'Content Creator' },
  coach:           { icon: '◆', color: T.purple, dim: T.purpleDim, glow: T.purpleGlow, label: 'Coach'           },
  analyst:         { icon: '◇', color: T.amber,  dim: T.amberDim,  glow: T.amberGlow,  label: 'Analyst'         },
};

/* ─── HELPERS ────────────────────────────────────────────────── */
function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function getRoleMeta(type) {
  return ROLE_META[type] || { icon: '◈', color: T.cyan, dim: T.cyanDim, glow: T.cyanGlow, label: type || 'Unknown' };
}

/* ─── NEON TAG ───────────────────────────────────────────────── */
function NeonTag({ children, color, dim, glow }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: 20,
      fontSize: 10, fontWeight: 700, lineHeight: '18px',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: dim, color,
      border: `1px solid ${color}45`,
      whiteSpace: 'nowrap',
      textShadow: `0 0 10px ${color}90`,
      boxShadow: `inset 0 0 8px ${dim}, 0 0 6px ${color}15`,
      letterSpacing: '0.4px',
    }}>
      {children}
    </span>
  );
}

/* ─── SIDEBAR BUTTON ─────────────────────────────────────────── */
function SideBtn({ active, onClick, icon, label, count, color }) {
  const accent = color || T.red;
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', padding: '7px 10px',
        borderRadius: 8,
        border: active ? `1px solid ${accent}50` : hovered ? `1px solid ${T.borderHi}` : '1px solid transparent',
        cursor: 'pointer', textAlign: 'left',
        fontSize: 12, fontWeight: active ? 700 : 400,
        fontFamily: "'Inter', system-ui, sans-serif",
        background: active ? `${accent}15` : hovered ? T.glass : 'transparent',
        color: active ? accent : hovered ? T.text : T.textMuted,
        transition: 'all 0.15s',
        boxShadow: active ? `0 0 16px ${accent}22` : 'none',
        textShadow: active ? `0 0 12px ${accent}70` : 'none',
      }}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {count != null && (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '1px 7px',
          borderRadius: 10, minWidth: 22, textAlign: 'center',
          background: active ? `${accent}28` : T.border,
          color: active ? accent : T.textDim,
          border: active ? `1px solid ${accent}45` : 'none',
          boxShadow: active ? `0 0 8px ${accent}35` : 'none',
        }}>{count}</span>
      )}
    </button>
  );
}

/* ─── PROFILE LINK — reusable clickable name ─────────────────── */
function ProfileLink({ userId, name }) {
  return (
    <Link href={`/profile/${userId}`} className="profile-link">
      {name || 'Anonymous'}
    </Link>
  );
}

/* ─── JOB CARD ───────────────────────────────────────────────── */
function JobCard({ job, selected, onClick }) {
  const m = getRoleMeta(job.job_type);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected
          ? `linear-gradient(135deg, ${m.color}12 0%, ${T.cardHover} 60%, ${T.card} 100%)`
          : hovered ? T.cardHover : T.card,
        border: selected
          ? `1px solid ${m.color}60`
          : hovered ? `1px solid ${T.borderHi}` : `1px solid ${T.border}`,
        borderRadius: 14, padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: selected
          ? `0 0 32px ${m.color}22, 0 0 0 1px ${m.color}15 inset`
          : hovered ? `0 6px 24px rgba(0,0,0,0.5)` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Animated shimmer on selected */}
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: '-100%', right: 0,
          height: '100%', width: '60%',
          background: `linear-gradient(90deg, transparent, ${m.color}06, transparent)`,
          animation: 'shimmerSweep 3s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Top scan line */}
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${m.color}, ${T.purple}, transparent)`,
          animation: 'scanSlide 2.5s ease-in-out infinite',
        }} />
      )}

      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: '12%', bottom: '12%',
        width: selected ? 3 : hovered ? 2 : 0,
        background: `linear-gradient(180deg, ${m.color}, ${T.purple})`,
        borderRadius: '0 3px 3px 0',
        transition: 'width 0.2s',
        boxShadow: selected ? `0 0 10px ${m.color}` : 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        {/* Role icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `radial-gradient(circle at 30% 30%, ${m.color}35, ${m.dim})`,
          border: `1px solid ${m.color}45`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 19, color: m.color,
          boxShadow: selected ? `0 0 18px ${m.color}50` : `0 0 8px ${m.color}25`,
          transition: 'box-shadow 0.2s',
        }}>
          {m.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 13, fontWeight: 700, color: T.text,
            marginBottom: 3, lineHeight: 1.3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {job.title}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted }}>
            by{' '}
            <ProfileLink userId={job.posted_by} name={job.users?.name} />
            {' · '}{job.game}
          </div>
        </div>

        <span style={{
          fontSize: 10, color: T.textDim, flexShrink: 0, marginTop: 2,
          background: 'rgba(255,255,255,0.04)', padding: '2px 7px', borderRadius: 6,
          border: `1px solid ${T.border}`,
        }}>
          {timeAgo(job.created_at)}
        </span>
      </div>

      <p style={{
        fontSize: 12, color: T.textMuted, lineHeight: 1.7,
        margin: '0 0 10px 0',
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {job.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <NeonTag color={T.cyan} dim={T.cyanDim} glow={T.cyanGlow}>{job.game}</NeonTag>
        <NeonTag color={m.color} dim={m.dim} glow={m.glow}>{m.icon} {m.label}</NeonTag>
        {job.budget_type && (
          <NeonTag color={T.green} dim={T.greenDim} glow={T.greenGlow}>
            {job.budget_type.replace('_', ' ')}
          </NeonTag>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: T.textDim }}>
          <span style={{ color: m.color, fontWeight: 700 }}>{job.applications_count || 0}</span> applicants
        </span>
      </div>

      {selected && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
          <Link href={`/marketplace/jobs/${job.id}`}>
            <button style={{
              width: '100%',
              background: `linear-gradient(135deg, ${m.color} 0%, ${m.color}aa 100%)`,
              border: `1px solid ${m.color}55`,
              borderRadius: 10, color: '#fff',
              padding: '10px 0', fontSize: 12, fontWeight: 700,
              fontFamily: "'Inter', system-ui, sans-serif",
              cursor: 'pointer', letterSpacing: '0.6px',
              boxShadow: `0 0 24px ${m.glow}, 0 4px 12px rgba(0,0,0,0.3)`,
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              transition: 'all 0.2s',
            }}>
              ⚡ View &amp; Apply
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─── DETAIL PANEL ───────────────────────────────────────────── */
function DetailPanel({ job }) {
  const m = getRoleMeta(job.job_type);
  const infoRows = [
    { label: 'Game',         value: job.game },
    { label: 'Role',         value: m.label },
    { label: 'Compensation', value: job.budget_type?.replace('_', ' ') || '—' },
    { label: 'Experience',   value: job.experience_level || '—' },
    { label: 'Applicants',   value: `${job.applications_count || 0} players` },
    { label: 'Posted',       value: new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
  ];

  return (
    <div style={{
      width: 290, flexShrink: 0,
      background: T.surface,
      borderLeft: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
      position: 'relative',
    }}>
      {/* Animated color stripe */}
      <div className="panel-stripe" style={{
        height: 3, flexShrink: 0,
        backgroundImage: `linear-gradient(90deg, ${m.color}, ${T.purple}, ${T.cyan}, ${m.color})`,
        backgroundSize: '200% 100%',
      }} />

      {/* Background glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 240, height: 240,
        background: `radial-gradient(circle at 80% 0%, ${m.color}10 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ padding: '20px 18px 16px', borderBottom: `1px solid ${T.border}`, position: 'relative' }}>
        <div style={{
          width: 58, height: 58, borderRadius: 15, marginBottom: 16,
          background: `radial-gradient(circle at 30% 30%, ${m.color}40, ${m.dim})`,
          border: `1px solid ${m.color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, color: m.color,
          boxShadow: `0 0 32px ${m.color}40, inset 0 0 14px ${m.color}18`,
          animation: 'iconPulse 3s ease-in-out infinite',
        }}>
          {m.icon}
        </div>

        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 15, fontWeight: 700, color: T.text,
          marginBottom: 6, lineHeight: 1.4,
        }}>
          {job.title}
        </div>

        <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 14 }}>
          posted by{' '}
          <ProfileLink userId={job.posted_by} name={job.users?.name} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          <NeonTag color={T.cyan} dim={T.cyanDim} glow={T.cyanGlow}>{job.game}</NeonTag>
          <NeonTag color={m.color} dim={m.dim} glow={m.glow}>{m.icon} {m.label}</NeonTag>
        </div>

        <Link href={`/marketplace/jobs/${job.id}`}>
          <button
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${m.color} 0%, ${m.color}bb 100%)`,
              border: `1px solid ${m.color}70`,
              borderRadius: 12, color: '#fff',
              padding: '13px 0', fontSize: 13, fontWeight: 700,
              fontFamily: "'Inter', system-ui, sans-serif",
              cursor: 'pointer', letterSpacing: '0.4px',
              boxShadow: `0 0 32px ${m.glow}, 0 4px 18px rgba(0,0,0,0.35)`,
              textShadow: '0 1px 6px rgba(0,0,0,0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 0 44px ${m.glow}, 0 8px 24px rgba(0,0,0,0.45)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 0 32px ${m.glow}, 0 4px 18px rgba(0,0,0,0.35)`;
            }}
          >
            ⚡ Apply Now
          </button>
        </Link>

        <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: 11, color: T.textDim }}>
          <span style={{ color: m.color, fontWeight: 700 }}>{job.applications_count || 0}</span> players already applied
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <SectionLabel>// Description</SectionLabel>
          <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.8, margin: 0 }}>
            {job.description}
          </p>
        </div>

        {job.requirements && (
          <div>
            <SectionLabel>// Requirements</SectionLabel>
            <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.8, margin: 0 }}>
              {job.requirements}
            </p>
          </div>
        )}

        <div>
          <SectionLabel>// Details</SectionLabel>
          <div style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 11, overflow: 'hidden',
          }}>
            {infoRows.map(({ label, value }, i) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '9px 13px',
                borderBottom: i < infoRows.length - 1 ? `1px solid ${T.border}` : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.018)',
              }}>
                <span style={{ fontSize: 11, color: T.textDim }}>{label}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: T.text,
                  textTransform: 'capitalize',
                }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION LABEL ──────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 10, fontWeight: 700,
      color: T.textDim,
      letterSpacing: '2.5px', marginBottom: 9,
      textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{ width: 14, height: 1, background: T.textDim, display: 'inline-block' }} />
      {children}
      <span style={{ flex: 1, height: 1, background: T.border, display: 'inline-block' }} />
    </div>
  );
}

/* ─── SKELETON ───────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="sk-pulse" style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: T.surface }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 13, background: T.surface, borderRadius: 4, marginBottom: 7, width: '62%' }} />
              <div style={{ height: 11, background: T.surface, borderRadius: 4, width: '38%' }} />
            </div>
          </div>
          <div style={{ height: 11, background: T.surface, borderRadius: 4, marginBottom: 5 }} />
          <div style={{ height: 11, background: T.surface, borderRadius: 4, width: '72%', marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ height: 20, width: 60, background: T.surface, borderRadius: 20 }} />
            <div style={{ height: 20, width: 72, background: T.surface, borderRadius: 20 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── LIVE BADGE ─────────────────────────────────────────────── */
function LiveBadge({ count }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      background: T.greenDim,
      border: `1px solid ${T.green}30`,
      borderRadius: 20, padding: '4px 12px',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: T.green,
        boxShadow: `0 0 0 3px ${T.greenDim}, 0 0 12px ${T.green}`,
        display: 'inline-block',
        animation: 'ping 2s ease-in-out infinite',
      }} />
      <span style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 12, fontWeight: 700, color: T.green,
        textShadow: `0 0 10px ${T.green}80`,
      }}>{count} live</span>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function MarketplacePage() {
  const [jobs, setJobs]               = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [activeGame, setActiveGame]   = useState('all');
  const [activeRole, setActiveRole]   = useState('all');
  const [quickFilter, setQuickFilter] = useState('all');
  const [search, setSearch]           = useState('');
  const [userName, setUserName]       = useState('Player');

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Player');
  }, []);

  useEffect(() => { fetchJobs(); }, [activeGame, activeRole]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeGame !== 'all') params.append('game', activeGame);
      if (activeRole !== 'all') params.append('job_type', activeRole);
      const res = await fetch(`http://localhost:3001/api/marketplace/jobs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
        setSelectedJob(data[0] || null);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = jobs.filter(job => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      job.title?.toLowerCase().includes(q) ||
      job.description?.toLowerCase().includes(q);
    const matchQuick = quickFilter === 'all' ||
      job.budget_type === quickFilter ||
      job.experience_level?.toLowerCase() === quickFilter;
    return matchSearch && matchQuick;
  });

  const gameCount = (id) => id === 'all' ? jobs.length : jobs.filter(j => j.game === id).length;
  const roleCount = (id) => id === 'all' ? jobs.length : jobs.filter(j => j.job_type === id).length;

  return (
    <div style={{
      height: 'calc(100vh - 104px)',
      marginTop: '104px',
      background: T.bg,
      color: T.text,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap');

        * { box-sizing: border-box; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

        input { outline: none; }
        input:focus { border-color: ${T.cyan}80 !important; box-shadow: 0 0 0 2px ${T.cyan}18 !important; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
        .fade-card { animation: fadeUp 0.22s ease both; }

        @keyframes shimmer {
          0%   { opacity: 0.3; }
          50%  { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        .sk-pulse { animation: shimmer 1.6s ease-in-out infinite; }

        @keyframes ping {
          0%, 100% { box-shadow: 0 0 0 3px ${T.greenDim}, 0 0 10px ${T.green}; }
          50%       { box-shadow: 0 0 0 7px ${T.greenDim}, 0 0 20px ${T.green}80; }
        }

        @keyframes panelStripe {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        .panel-stripe { animation: panelStripe 4s linear infinite; }

        @keyframes iconPulse {
          0%, 100% { box-shadow: 0 0 22px rgba(255,59,59,0.32), inset 0 0 10px rgba(255,59,59,0.12); }
          50%       { box-shadow: 0 0 38px rgba(255,59,59,0.52), inset 0 0 18px rgba(255,59,59,0.22); }
        }

        @keyframes scanSlide {
          0%   { opacity: 0.6; transform: scaleX(0.3) translateX(-100%); }
          50%  { opacity: 1;   transform: scaleX(1) translateX(0); }
          100% { opacity: 0.6; transform: scaleX(0.3) translateX(100%); }
        }

        @keyframes shimmerSweep {
          0%   { left: -100%; }
          100% { left: 200%; }
        }

        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 18px ${T.redGlow}; }
          50%       { box-shadow: 0 0 32px ${T.redGlow}, 0 0 50px ${T.redDim}; }
        }
        .post-btn { animation: btnPulse 3s ease-in-out infinite; }
        .post-btn:hover { animation: none !important; opacity: 0.88; transform: translateY(-1px); }

        input::placeholder { color: ${T.textDim}; }
        .qf-btn:hover { filter: brightness(1.18); }

        .profile-link {
          color: ${T.cyan};
          font-weight: 700;
          text-decoration: none;
          text-shadow: 0 0 10px ${T.cyan}70;
          transition: opacity 0.15s;
        }
        .profile-link:hover {
          text-decoration: underline;
          text-decoration-color: ${T.cyan};
          opacity: 0.85;
        }
      `}</style>

      {/* ══════════════════ TOP BAR ══════════════════ */}
      <div style={{
        background: `linear-gradient(180deg, ${T.surface} 0%, ${T.bg} 100%)`,
        borderBottom: `1px solid ${T.border}`,
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        flexShrink: 0,
        boxShadow: `0 1px 0 ${T.border}, 0 6px 28px rgba(0,0,0,0.7)`,
      }}>
        {/* Brand */}
        <div style={{ marginRight: 4 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 17, fontWeight: 800, letterSpacing: '3px',
            color: T.red, textTransform: 'uppercase',
            textShadow: `0 0 16px ${T.red}90, 0 0 32px ${T.redDim}`,
          }}>
            VINCI MARKET
          </div>
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 10, fontWeight: 500, color: T.textMuted, letterSpacing: '0.5px',
          }}>
            Find jobs &amp; opportunities
          </div>
        </div>

        <div style={{ width: 1, height: 30, background: T.border }} />

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: T.textDim, fontSize: 15, pointerEvents: 'none',
          }}>⌕</span>
          <input
            type="text"
            placeholder="Search opportunities…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 34px',
              border: `1px solid ${T.border}`, borderRadius: 10,
              fontSize: 13, color: T.text, background: T.card,
              fontFamily: "'Inter', system-ui, sans-serif",
              transition: 'all 0.2s',
            }}
          />
        </div>

        <LiveBadge count={jobs.length} />

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Link href="/marketplace/my-applications">
            <button style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 9, color: T.textMuted,
              padding: '8px 18px', fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 600, fontSize: 12, cursor: 'pointer',
              transition: 'all 0.2s', letterSpacing: '0.3px',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;   e.currentTarget.style.color = T.textMuted; }}>
              My Activity
            </button>
          </Link>
          <Link href="/marketplace/post">
            <button className="post-btn" style={{
              background: `linear-gradient(135deg, ${T.red}, ${T.redMid})`,
              border: `1px solid ${T.red}65`,
              borderRadius: 9, color: '#fff',
              padding: '8px 20px', fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 700, fontSize: 12, cursor: 'pointer',
              letterSpacing: '0.8px',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}>
              + Post Job
            </button>
          </Link>
        </div>
      </div>

      {/* ══════════════════ BODY ══════════════════ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{
          width: 204, flexShrink: 0,
          background: T.surface,
          borderRight: `1px solid ${T.border}`,
          padding: '14px 9px',
          display: 'flex', flexDirection: 'column', gap: 2,
          overflowY: 'auto',
        }}>
          <SectionLabel>// Games</SectionLabel>
          {GAMES.map(g => (
            <SideBtn
              key={g.id}
              active={activeGame === g.id}
              onClick={() => setActiveGame(g.id)}
              icon={g.icon}
              label={g.label}
              count={gameCount(g.id)}
              color={T.cyan}
            />
          ))}

          <div style={{ height: 1, background: T.border, margin: '12px 2px 10px' }} />

          <SectionLabel>// Roles</SectionLabel>
          {ROLES.map(r => (
            <SideBtn
              key={r.id}
              active={activeRole === r.id}
              onClick={() => setActiveRole(r.id)}
              icon={r.id === 'all' ? '◈' : (ROLE_META[r.id]?.icon || '◈')}
              label={r.label}
              count={roleCount(r.id)}
              color={r.col}
            />
          ))}

          <div style={{ flex: 1 }} />
          <div style={{ height: 1, background: T.border, margin: '8px 2px' }} />

          {/* User chip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px',
            background: T.card, borderRadius: 11,
            border: `1px solid ${T.border}`,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: `linear-gradient(135deg, ${T.red}, ${T.purple})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: '#fff',
              boxShadow: `0 0 14px ${T.redGlow}`,
            }}>
              {userName[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text, fontFamily: "'Inter', system-ui, sans-serif" }}>{userName}</div>
              <div style={{
                fontSize: 10, color: T.green, fontWeight: 600,
                textShadow: `0 0 8px ${T.green}80`,
              }}>● Online</div>
            </div>
          </div>
        </div>

        {/* ── CENTER FEED ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Quick filter strip */}
          <div style={{
            padding: '10px 14px',
            background: `linear-gradient(180deg, ${T.surface} 0%, ${T.bg} 100%)`,
            borderBottom: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 6,
            flexShrink: 0, flexWrap: 'wrap',
          }}>
            {QUICK_FILTERS.map(f => {
              const active = quickFilter === f.id;
              return (
                <button
                  key={f.id}
                  className="qf-btn"
                  onClick={() => setQuickFilter(f.id)}
                  style={{
                    padding: '5px 18px', borderRadius: 20,
                    fontSize: 12, fontWeight: active ? 700 : 500,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    cursor: 'pointer', transition: 'all 0.15s',
                    border: active ? `1px solid ${T.red}65` : `1px solid ${T.border}`,
                    background: active
                      ? `linear-gradient(135deg, ${T.red}cc, ${T.redMid}aa)`
                      : T.card,
                    color: active ? '#fff' : T.textMuted,
                    boxShadow: active ? `0 0 16px ${T.redGlow}` : 'none',
                    letterSpacing: active ? '0.5px' : '0',
                    textShadow: active ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: T.textDim, fontWeight: 600 }}>
              <span style={{ color: T.cyan, fontWeight: 700 }}>{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Card list */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {loading ? (
              <Skeleton />
            ) : filtered.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                flex: 1, gap: 14, paddingTop: 70,
              }}>
                <div style={{ fontSize: 54, filter: `drop-shadow(0 0 18px ${T.red}60)` }}>💀</div>
                <div style={{
                  fontSize: 18, fontWeight: 800, color: T.red,
                  letterSpacing: '3px',
                  textShadow: `0 0 20px ${T.red}80`,
                }}>NO RESULTS</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>Try changing your filters or search term</div>
                <Link href="/marketplace/post">
                  <button className="post-btn" style={{
                    marginTop: 8,
                    background: `linear-gradient(135deg, ${T.red}, ${T.redMid})`,
                    color: '#fff', border: `1px solid ${T.red}60`,
                    borderRadius: 10, padding: '11px 26px',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    letterSpacing: '0.8px',
                  }}>
                    + Post a Job
                  </button>
                </Link>
              </div>
            ) : (
              filtered.map((job, i) => (
                <div key={job.id} className="fade-card" style={{ animationDelay: `${i * 0.04}s` }}>
                  <JobCard
                    job={job}
                    selected={selectedJob?.id === job.id}
                    onClick={() => setSelectedJob(job)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT DETAIL PANEL ── */}
        {selectedJob && <DetailPanel job={selectedJob} />}
      </div>
    </div>
  );
}