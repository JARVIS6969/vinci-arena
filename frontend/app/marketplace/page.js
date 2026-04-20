'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/* ─── THEME (matches profile page dark palette) ──────────────── */
const T = {
  bg:        '#0a0a0f',
  surface:   '#111118',
  card:      '#16161f',
  cardHover: '#1c1c28',
  border:    'rgba(255,255,255,0.07)',
  borderHi:  'rgba(255,255,255,0.14)',
  red:       '#ef4444',
  redDim:    'rgba(239,68,68,0.15)',
  redGlow:   'rgba(239,68,68,0.25)',
  cyan:      '#22d3ee',
  cyanDim:   'rgba(34,211,238,0.12)',
  purple:    '#a78bfa',
  purpleDim: 'rgba(167,139,250,0.12)',
  green:     '#4ade80',
  greenDim:  'rgba(74,222,128,0.12)',
  amber:     '#fbbf24',
  amberDim:  'rgba(251,191,36,0.12)',
  pink:      '#f472b6',
  pinkDim:   'rgba(244,114,182,0.12)',
  text:      '#f1f5f9',
  textMuted: '#64748b',
  textDim:   '#334155',
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
  player:          { icon: '◉', color: T.red,    dim: T.redDim,    label: 'Player'          },
  squad:           { icon: '◈', color: T.green,  dim: T.greenDim,  label: 'Squad'           },
  content_creator: { icon: '◎', color: T.pink,   dim: T.pinkDim,   label: 'Content Creator' },
  coach:           { icon: '◆', color: T.purple, dim: T.purpleDim, label: 'Coach'           },
  analyst:         { icon: '◇', color: T.amber,  dim: T.amberDim,  label: 'Analyst'         },
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
  return ROLE_META[type] || { icon: '◈', color: T.cyan, dim: T.cyanDim, label: type || 'Unknown' };
}

/* ─── NEON TAG ───────────────────────────────────────────────── */
function NeonTag({ children, color, dim }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 9px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, lineHeight: '18px',
      background: dim, color, border: `1px solid ${color}40`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/* ─── SIDEBAR BUTTON ─────────────────────────────────────────── */
function SideBtn({ active, onClick, icon, label, count, color }) {
  const accentColor = color || T.red;
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      width: '100%', padding: '7px 10px',
      borderRadius: 8,
      border: active ? `1px solid ${accentColor}30` : '1px solid transparent',
      cursor: 'pointer', textAlign: 'left',
      fontSize: 12, fontWeight: active ? 700 : 400,
      background: active ? `${accentColor}10` : 'transparent',
      color: active ? accentColor : T.textMuted,
      transition: 'all 0.15s',
    }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {count != null && (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '1px 6px',
          borderRadius: 10, minWidth: 20, textAlign: 'center',
          background: active ? `${accentColor}20` : T.border,
          color: active ? accentColor : T.textDim,
        }}>{count}</span>
      )}
    </button>
  );
}

/* ─── JOB CARD ───────────────────────────────────────────────── */
function JobCard({ job, selected, onClick }) {
  const m = getRoleMeta(job.job_type);
  return (
    <div onClick={onClick} style={{
      background: selected ? T.cardHover : T.card,
      border: selected ? `1px solid ${m.color}40` : `1px solid ${T.border}`,
      borderRadius: 12, padding: '14px 16px',
      cursor: 'pointer', transition: 'all 0.15s',
      boxShadow: selected ? `0 0 20px ${m.color}15` : 'none',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Selected top accent */}
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${m.color}, transparent)`,
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: m.dim, border: `1px solid ${m.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, color: m.color,
        }}>
          {m.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: T.text,
            marginBottom: 2, lineHeight: 1.3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {job.title}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted }}>
            by <span style={{ color: T.cyan, fontWeight: 600 }}>{job.users?.name || 'Anonymous'}</span>
            {' · '}{job.game}
          </div>
        </div>
        <span style={{ fontSize: 10, color: T.textDim, flexShrink: 0, marginTop: 2 }}>
          {timeAgo(job.created_at)}
        </span>
      </div>

      <p style={{
        fontSize: 12, color: T.textMuted, lineHeight: 1.6,
        margin: '0 0 10px 0',
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {job.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <NeonTag color={T.cyan} dim={T.cyanDim}>{job.game}</NeonTag>
        <NeonTag color={m.color} dim={m.dim}>{m.icon} {m.label}</NeonTag>
        {job.budget_type && (
          <NeonTag color={T.green} dim={T.greenDim}>{job.budget_type.replace('_', ' ')}</NeonTag>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: T.textDim }}>
          {job.applications_count || 0} applicants
        </span>
      </div>

      {selected && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
          <Link href={`/marketplace/jobs/${job.id}`}>
            <button style={{
              width: '100%',
              background: `linear-gradient(135deg, ${m.color}cc, ${m.color}88)`,
              border: `1px solid ${m.color}50`,
              borderRadius: 8, color: '#fff',
              padding: '9px 0', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.5px',
              boxShadow: `0 0 16px ${m.color}30`,
            }}>
              View & Apply →
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
      width: 276, flexShrink: 0,
      background: T.surface,
      borderLeft: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Color stripe at top */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${m.color}, ${T.purple}, transparent)`, flexShrink: 0 }} />

      {/* Header block — icon, title, by, tags, APPLY BUTTON */}
      <div style={{ padding: '16px 16px 14px', borderBottom: `1px solid ${T.border}` }}>
        {/* Role icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 12, marginBottom: 12,
          background: m.dim, border: `1px solid ${m.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, color: m.color,
          boxShadow: `0 0 20px ${m.color}20`,
        }}>
          {m.icon}
        </div>

        {/* Title */}
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4, lineHeight: 1.3 }}>
          {job.title}
        </div>

        {/* By poster */}
        <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 12 }}>
          by{' '}
          <Link href={`/profile/${job.posted_by}`} style={{ color: T.cyan, fontWeight: 700, textDecoration: 'none' }}>
            {job.users?.name || 'Anonymous'}
          </Link>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          <NeonTag color={T.cyan} dim={T.cyanDim}>{job.game}</NeonTag>
          <NeonTag color={m.color} dim={m.dim}>{m.icon} {m.label}</NeonTag>
        </div>

        {/* ── APPLY BUTTON — right here, visible immediately ── */}
        <Link href={`/marketplace/jobs/${job.id}`}>
          <button
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${m.color}, ${m.color}aa)`,
              border: `1px solid ${m.color}60`,
              borderRadius: 10, color: '#fff',
              padding: '11px 0', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.5px',
              boxShadow: `0 0 24px ${m.color}30`,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            ⚡ Apply Now
          </button>
        </Link>

        <p style={{ margin: '8px 0 0', textAlign: 'center', fontSize: 11, color: T.textDim }}>
          {job.applications_count || 0} players already applied
        </p>
      </div>

      {/* Body: description, requirements, details */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textDim, letterSpacing: '1.5px', marginBottom: 6, textTransform: 'uppercase' }}>
            // Description
          </div>
          <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.7, margin: 0 }}>
            {job.description}
          </p>
        </div>

        {job.requirements && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: T.textDim, letterSpacing: '1.5px', marginBottom: 6, textTransform: 'uppercase' }}>
              // Requirements
            </div>
            <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.7, margin: 0 }}>
              {job.requirements}
            </p>
          </div>
        )}

        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textDim, letterSpacing: '1.5px', marginBottom: 8, textTransform: 'uppercase' }}>
            // Details
          </div>
          {infoRows.map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '7px 0', borderBottom: `1px solid ${T.border}`,
            }}>
              <span style={{ fontSize: 11, color: T.textDim }}>{label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.text, textTransform: 'capitalize' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SKELETON ───────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton-pulse" style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: T.surface }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 13, background: T.surface, borderRadius: 4, marginBottom: 6, width: '65%' }} />
              <div style={{ height: 11, background: T.surface, borderRadius: 4, width: '35%' }} />
            </div>
          </div>
          <div style={{ height: 11, background: T.surface, borderRadius: 4, marginBottom: 4 }} />
          <div style={{ height: 11, background: T.surface, borderRadius: 4, width: '75%', marginBottom: 10 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ height: 20, width: 58, background: T.surface, borderRadius: 20 }} />
            <div style={{ height: 20, width: 70, background: T.surface, borderRadius: 20 }} />
          </div>
        </div>
      ))}
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
      fontFamily: "'Rajdhani', 'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
        input { outline: none; }
        input:focus { border-color: ${T.cyan}60 !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        .fade-card { animation: fadeUp 0.2s ease both; }
        @keyframes shimmer { 0%,100%{opacity:.4} 50%{opacity:.8} }
        .skeleton-pulse { animation: shimmer 1.5s ease-in-out infinite; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        flexShrink: 0,
      }}>
        <div style={{ marginRight: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.red, letterSpacing: '1px' }}>
            VINCI MARKET
          </div>
          <div style={{ fontSize: 10, color: T.textMuted }}>
            Find jobs &amp; opportunities
          </div>
        </div>

        <div style={{ width: 1, height: 28, background: T.border }} />

        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.textDim, fontSize: 14 }}>⌕</span>
          <input
            type="text"
            placeholder="Search opportunities…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '7px 10px 7px 30px',
              border: `1px solid ${T.border}`, borderRadius: 8,
              fontSize: 12, color: T.text, background: T.card,
              fontFamily: 'inherit', transition: 'border-color 0.15s',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 7, height: 7, background: T.green, borderRadius: '50%',
            display: 'inline-block', boxShadow: `0 0 8px ${T.green}`,
          }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: T.green }}>{jobs.length} live</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Link href="/marketplace/my-applications">
            <button style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 8, color: T.textMuted,
              padding: '7px 14px', fontFamily: 'inherit',
              fontWeight: 600, fontSize: 12, cursor: 'pointer',
              transition: 'all 0.15s', letterSpacing: '0.3px',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;   e.currentTarget.style.color = T.textMuted; }}>
              My Activity
            </button>
          </Link>
          <Link href="/marketplace/post">
            <button style={{
              background: T.red, border: 'none',
              borderRadius: 8, color: '#fff',
              padding: '7px 16px', fontFamily: 'inherit',
              fontWeight: 700, fontSize: 12, cursor: 'pointer',
              boxShadow: `0 0 16px ${T.redGlow}`,
              transition: 'opacity 0.15s', letterSpacing: '0.5px',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              + Post Job
            </button>
          </Link>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{
          width: 196, flexShrink: 0,
          background: T.surface,
          borderRight: `1px solid ${T.border}`,
          padding: '12px 8px',
          display: 'flex', flexDirection: 'column', gap: 2,
          overflowY: 'auto',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textDim, letterSpacing: '1.5px', padding: '4px 10px 6px', textTransform: 'uppercase' }}>
            // Games
          </div>
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

          <div style={{ height: 1, background: T.border, margin: '10px 0 8px' }} />

          <div style={{ fontSize: 9, fontWeight: 700, color: T.textDim, letterSpacing: '1.5px', padding: '4px 10px 6px', textTransform: 'uppercase' }}>
            // Roles
          </div>
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
          <div style={{ height: 1, background: T.border, margin: '8px 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: `linear-gradient(135deg, ${T.red}, ${T.purple})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff',
              boxShadow: `0 0 10px ${T.redGlow}`,
            }}>
              {userName[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.text }}>{userName}</div>
              <div style={{ fontSize: 10, color: T.green, fontWeight: 600 }}>● Online</div>
            </div>
          </div>
        </div>

        {/* ── CENTER FEED ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Quick filter bar */}
          <div style={{
            padding: '10px 14px',
            background: T.bg,
            borderBottom: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 6,
            flexShrink: 0, flexWrap: 'wrap',
          }}>
            {QUICK_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setQuickFilter(f.id)}
                style={{
                  padding: '4px 14px', borderRadius: 20,
                  fontSize: 12, fontWeight: quickFilter === f.id ? 700 : 500,
                  cursor: 'pointer', transition: 'all 0.15s', border: 'none',
                  background: quickFilter === f.id ? T.red : T.card,
                  color: quickFilter === f.id ? '#fff' : T.textMuted,
                  boxShadow: quickFilter === f.id ? `0 0 12px ${T.redGlow}` : `0 0 0 1px ${T.border}`,
                  letterSpacing: '0.3px',
                }}
              >
                {f.label}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: T.textDim, fontWeight: 600 }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Card list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {loading ? (
              <Skeleton />
            ) : filtered.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 14, paddingTop: 40 }}>
                <div style={{ fontSize: 44 }}>💀</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.red, letterSpacing: '1px' }}>NO RESULTS</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>Try changing your filters or search term</div>
                <Link href="/marketplace/post">
                  <button style={{
                    marginTop: 4, background: T.red, color: '#fff',
                    border: 'none', borderRadius: 8, padding: '9px 22px',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    boxShadow: `0 0 16px ${T.redGlow}`, letterSpacing: '0.5px',
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