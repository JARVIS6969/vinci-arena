'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

/* ─── THEME — VINCI ARENA PRO PALETTE ─────────────────────────
   Psychology: Red = urgency/action, Cyan = trust/tech,
   Purple = prestige, Green = success, Amber = reward/premium
   Matches profile page's vivid neon-on-dark aesthetic
──────────────────────────────────────────────────────────────── */
const T = {
  /* Backgrounds */
  bg:        '#07070d',
  surface:   '#0d0d17',
  card:      '#10101a',
  cardHover: '#181826',

  /* Borders */
  border:    'rgba(255,255,255,0.06)',
  borderHi:  'rgba(255,255,255,0.14)',

  /* Brand Red — urgency, CTA, action */
  red:       '#ff3b3b',
  redMid:    '#cc2e2e',
  redDim:    'rgba(255,59,59,0.12)',
  redGlow:   'rgba(255,59,59,0.35)',

  /* Cyan — tech, info, trust */
  cyan:      '#00e5ff',
  cyanMid:   '#00b8cc',
  cyanDim:   'rgba(0,229,255,0.10)',
  cyanGlow:  'rgba(0,229,255,0.30)',

  /* Purple — prestige, ranked, premium */
  purple:    '#b57aff',
  purpleMid: '#8c4fff',
  purpleDim: 'rgba(181,122,255,0.12)',
  purpleGlow:'rgba(181,122,255,0.30)',

  /* Green — success, live, online */
  green:     '#00ff88',
  greenMid:  '#00cc6a',
  greenDim:  'rgba(0,255,136,0.10)',
  greenGlow: 'rgba(0,255,136,0.28)',

  /* Amber — gold, reward, pro tier */
  amber:     '#ffb800',
  amberMid:  '#cc9200',
  amberDim:  'rgba(255,184,0,0.12)',
  amberGlow: 'rgba(255,184,0,0.28)',

  /* Pink — creator, social */
  pink:      '#ff6eb4',
  pinkMid:   '#cc4d8a',
  pinkDim:   'rgba(255,110,180,0.12)',
  pinkGlow:  'rgba(255,110,180,0.28)',

  /* Text */
  text:      '#eef0f8',
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
      fontSize: 11, fontWeight: 600, lineHeight: '18px',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: dim, color,
      border: `1px solid ${color}50`,
      whiteSpace: 'nowrap',
      textShadow: `0 0 8px ${color}80`,
      boxShadow: `inset 0 0 6px ${dim}`,
    }}>
      {children}
    </span>
  );
}

/* ─── SIDEBAR BUTTON ─────────────────────────────────────────── */
function SideBtn({ active, onClick, icon, label, count, color }) {
  const accent = color || T.red;
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      width: '100%', padding: '7px 10px',
      borderRadius: 8,
      border: active ? `1px solid ${accent}40` : '1px solid transparent',
      cursor: 'pointer', textAlign: 'left',
      fontSize: 12, fontWeight: active ? 600 : 400,
      fontFamily: "'Inter', system-ui, sans-serif",
      background: active ? `${accent}12` : 'transparent',
      color: active ? accent : T.textMuted,
      transition: 'all 0.2s',
      boxShadow: active ? `0 0 12px ${accent}20` : 'none',
      textShadow: active ? `0 0 10px ${accent}60` : 'none',
    }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {count != null && (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '1px 6px',
          borderRadius: 10, minWidth: 20, textAlign: 'center',
          background: active ? `${accent}25` : T.border,
          color: active ? accent : T.textDim,
          border: active ? `1px solid ${accent}40` : 'none',
          boxShadow: active ? `0 0 6px ${accent}30` : 'none',
        }}>{count}</span>
      )}
    </button>
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
          ? `linear-gradient(135deg, ${m.color}10 0%, ${T.cardHover} 100%)`
          : hovered ? T.cardHover : T.card,
        border: selected
          ? `1px solid ${m.color}55`
          : hovered ? `1px solid ${T.borderHi}` : `1px solid ${T.border}`,
        borderRadius: 14, padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: selected
          ? `0 0 28px ${m.color}20, inset 0 0 20px ${m.color}05`
          : hovered ? `0 4px 20px rgba(0,0,0,0.4)` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Animated scan line on selected */}
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${m.color}, ${T.purple}, transparent)`,
          animation: 'scanSlide 2.5s ease-in-out infinite',
        }} />
      )}

      {/* Left color bar */}
      <div style={{
        position: 'absolute', left: 0, top: '15%', bottom: '15%',
        width: selected ? 3 : hovered ? 2 : 0,
        background: `linear-gradient(180deg, ${m.color}, ${T.purple})`,
        borderRadius: '0 3px 3px 0',
        transition: 'width 0.2s',
        boxShadow: selected ? `0 0 8px ${m.color}` : 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11, flexShrink: 0,
          background: `radial-gradient(circle at 30% 30%, ${m.color}30, ${m.dim})`,
          border: `1px solid ${m.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: m.color,
          boxShadow: selected ? `0 0 14px ${m.color}40` : `0 0 6px ${m.color}20`,
          transition: 'box-shadow 0.2s',
        }}>
          {m.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 13, fontWeight: 700, color: T.text,
            marginBottom: 2, lineHeight: 1.3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {job.title}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted }}>
            by <span style={{
              color: T.cyan, fontWeight: 700,
              textShadow: `0 0 8px ${T.cyan}60`,
            }}>{job.users?.name || 'Anonymous'}</span>
            {' · '}{job.game}
          </div>
        </div>
        <span style={{
          fontSize: 10, color: T.textDim, flexShrink: 0, marginTop: 2,
          background: T.border, padding: '2px 6px', borderRadius: 6,
        }}>
          {timeAgo(job.created_at)}
        </span>
      </div>

      <p style={{
        fontSize: 12, color: T.textMuted, lineHeight: 1.65,
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
              background: `linear-gradient(135deg, ${m.color}, ${m.color}99)`,
              border: `1px solid ${m.color}60`,
              borderRadius: 9, color: '#fff',
              padding: '10px 0', fontSize: 12, fontWeight: 700,
              fontFamily: "'Inter', system-ui, sans-serif",
              cursor: 'pointer', letterSpacing: '0.5px',
              boxShadow: `0 0 20px ${m.glow}`,
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
      width: 282, flexShrink: 0,
      background: T.surface,
      borderLeft: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
      position: 'relative',
    }}>
      {/* Animated color stripe */}
      <div className="panel-stripe" style={{
        height: 3,
        backgroundImage: `linear-gradient(90deg, ${m.color}, ${T.purple}, ${T.cyan}, ${m.color})`,
        backgroundSize: '200% 100%',
        flexShrink: 0,
      }} />

      {/* Faint radial glow bg */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 200, height: 200,
        background: `radial-gradient(circle at 80% 0%, ${m.color}08 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ padding: '18px 16px 14px', borderBottom: `1px solid ${T.border}`, position: 'relative' }}>
        {/* Role icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 14, marginBottom: 14,
          background: `radial-gradient(circle at 30% 30%, ${m.color}35, ${m.dim})`,
          border: `1px solid ${m.color}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, color: m.color,
          boxShadow: `0 0 28px ${m.color}35, inset 0 0 12px ${m.color}15`,
          animation: 'iconPulse 3s ease-in-out infinite',
        }}>
          {m.icon}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 14, fontWeight: 700, color: T.text,
          marginBottom: 5, lineHeight: 1.4,
        }}>
          {job.title}
        </div>

        {/* Posted by */}
        <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 12 }}>
          posted by{' '}
          <Link href={`/profile/${job.posted_by}`} style={{
            color: T.cyan, fontWeight: 700, textDecoration: 'none',
            textShadow: `0 0 8px ${T.cyan}60`,
          }}>
            {job.users?.name || 'Anonymous'}
          </Link>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          <NeonTag color={T.cyan} dim={T.cyanDim} glow={T.cyanGlow}>{job.game}</NeonTag>
          <NeonTag color={m.color} dim={m.dim} glow={m.glow}>{m.icon} {m.label}</NeonTag>
        </div>

        {/* CTA Button */}
        <Link href={`/marketplace/jobs/${job.id}`}>
          <button
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${m.color} 0%, ${m.color}bb 100%)`,
              border: `1px solid ${m.color}70`,
              borderRadius: 11, color: '#fff',
              padding: '12px 0', fontSize: 13, fontWeight: 700,
              fontFamily: "'Inter', system-ui, sans-serif",
              cursor: 'pointer', letterSpacing: '0.3px',
              boxShadow: `0 0 28px ${m.glow}, 0 4px 16px rgba(0,0,0,0.3)`,
              textShadow: '0 1px 6px rgba(0,0,0,0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `0 0 36px ${m.glow}, 0 6px 20px rgba(0,0,0,0.4)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 0 28px ${m.glow}, 0 4px 16px rgba(0,0,0,0.3)`;
            }}
          >
            ⚡ Apply Now
          </button>
        </Link>

        <p style={{ margin: '8px 0 0', textAlign: 'center', fontSize: 11, color: T.textDim }}>
          <span style={{ color: m.color, fontWeight: 700 }}>{job.applications_count || 0}</span> players already applied
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>

        <div>
          <SectionLabel>// Description</SectionLabel>
          <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.75, margin: 0 }}>
            {job.description}
          </p>
        </div>

        {job.requirements && (
          <div>
            <SectionLabel>// Requirements</SectionLabel>
            <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.75, margin: 0 }}>
              {job.requirements}
            </p>
          </div>
        )}

        <div>
          <SectionLabel>// Details</SectionLabel>
          <div style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 10, overflow: 'hidden',
          }}>
            {infoRows.map(({ label, value }, i) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px',
                borderBottom: i < infoRows.length - 1 ? `1px solid ${T.border}` : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
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
      fontSize: 11, fontWeight: 700,
      color: T.textDim,
      letterSpacing: '2px', marginBottom: 8,
      textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{ width: 12, height: 1, background: T.textDim, display: 'inline-block' }} />
      {children}
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
            <div style={{ width: 42, height: 42, borderRadius: 11, background: T.surface }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 13, background: T.surface, borderRadius: 4, marginBottom: 6, width: '60%' }} />
              <div style={{ height: 11, background: T.surface, borderRadius: 4, width: '35%' }} />
            </div>
          </div>
          <div style={{ height: 11, background: T.surface, borderRadius: 4, marginBottom: 5 }} />
          <div style={{ height: 11, background: T.surface, borderRadius: 4, width: '70%', marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ height: 20, width: 58, background: T.surface, borderRadius: 20 }} />
            <div style={{ height: 20, width: 70, background: T.surface, borderRadius: 20 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── LIVE COUNTER BADGE ─────────────────────────────────────── */
function LiveBadge({ count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: T.green,
        boxShadow: `0 0 0 3px ${T.greenDim}, 0 0 10px ${T.green}`,
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

        /* ── Type scale — Netflix/Instagram inspired ──
           Inter     → UI text, body, labels (clean, legible, professional)
           Barlow Condensed → headings, badges, brand marks (bold, impactful)
        ── */
        .font-ui      { font-family: 'Inter', system-ui, sans-serif; }
        .font-display { font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.5px; }
        * { box-sizing: border-box; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); }

        input { outline: none; }
        input:focus { border-color: ${T.cyan}70 !important; box-shadow: 0 0 0 2px ${T.cyan}15 !important; }

        /* ── Fade-up entry for cards ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        .fade-card { animation: fadeUp 0.25s ease both; }

        /* ── Skeleton shimmer ── */
        @keyframes shimmer {
          0%   { opacity: 0.35; }
          50%  { opacity: 0.65; }
          100% { opacity: 0.35; }
        }
        .sk-pulse { animation: shimmer 1.6s ease-in-out infinite; }

        /* ── Live dot ping ── */
        @keyframes ping {
          0%, 100% { box-shadow: 0 0 0 3px ${T.greenDim}, 0 0 10px ${T.green}; }
          50%       { box-shadow: 0 0 0 6px ${T.greenDim}, 0 0 18px ${T.green}80; }
        }

        /* ── Panel stripe scroll ── */
        @keyframes panelStripe {
          0%   { background-position: 0% 0%;   }
          100% { background-position: 200% 0%; }
        }
        .panel-stripe { animation: panelStripe 4s linear infinite; }

        /* ── Detail panel icon pulse ── */
        @keyframes iconPulse {
          0%, 100% { box-shadow: 0 0 20px var(--icon-glow-color, rgba(255,59,59,0.3)), inset 0 0 10px rgba(255,59,59,0.1); }
          50%       { box-shadow: 0 0 36px var(--icon-glow-color, rgba(255,59,59,0.5)), inset 0 0 16px rgba(255,59,59,0.2); }
        }

        /* ── Scan line ── */
        @keyframes scanSlide {
          0%   { opacity: 0.6; transform: scaleX(0.3) translateX(-100%); }
          50%  { opacity: 1;   transform: scaleX(1)   translateX(0); }
          100% { opacity: 0.6; transform: scaleX(0.3) translateX(100%); }
        }

        /* ── Search input placeholder ── */
        input::placeholder { color: ${T.textDim}; }

        /* ── Quick filter hover ── */
        .qf-btn:hover { filter: brightness(1.2); }

        /* ── Post Job btn pulse ── */
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 16px ${T.redGlow}; }
          50%       { box-shadow: 0 0 28px ${T.redGlow}, 0 0 44px ${T.redDim}; }
        }
        .post-btn { animation: btnPulse 3s ease-in-out infinite; }
        .post-btn:hover { animation: none !important; opacity: 0.88; }
      `}</style>

      {/* ══════════════════ TOP BAR ══════════════════ */}
      <div style={{
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        flexShrink: 0,
        /* subtle bottom glow */
        boxShadow: `0 1px 0 ${T.border}, 0 4px 20px rgba(0,0,0,0.6)`,
      }}>
        {/* Brand */}
        <div style={{ marginRight: 4 }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 16, fontWeight: 800, letterSpacing: '2.5px',
            color: T.red, textTransform: 'uppercase',
            textShadow: `0 0 12px ${T.red}90`,
          }}>
            VINCI MARKET
          </div>
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 10, fontWeight: 500, color: T.textMuted, letterSpacing: '0.3px',
          }}>
            Find jobs &amp; opportunities
          </div>
        </div>

        <div style={{ width: 1, height: 28, background: T.border }} />

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
          <span style={{
            position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
            color: T.textDim, fontSize: 15, pointerEvents: 'none',
          }}>⌕</span>
          <input
            type="text"
            placeholder="Search opportunities…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 10px 8px 32px',
              border: `1px solid ${T.border}`, borderRadius: 9,
              fontSize: 13, color: T.text, background: T.card,
              fontFamily: "'Inter', system-ui, sans-serif",
              transition: 'all 0.2s',
            }}
          />
        </div>

        <LiveBadge count={jobs.length} />

        {/* Right actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Link href="/marketplace/my-applications">
            <button style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 8, color: T.textMuted,
              padding: '7px 16px', fontFamily: "'Inter', system-ui, sans-serif",
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
              border: `1px solid ${T.red}60`,
              borderRadius: 8, color: '#fff',
              padding: '7px 18px', fontFamily: "'Inter', system-ui, sans-serif",
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
          width: 200, flexShrink: 0,
          background: T.surface,
          borderRight: `1px solid ${T.border}`,
          padding: '12px 8px',
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

          <div style={{ height: 1, background: T.border, margin: '10px 0 8px' }} />

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
          <div style={{ height: 1, background: T.border, margin: '8px 0' }} />

          {/* User chip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '7px 10px',
            background: T.card, borderRadius: 10,
            border: `1px solid ${T.border}`,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: `linear-gradient(135deg, ${T.red}, ${T.purple})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#fff',
              boxShadow: `0 0 12px ${T.redGlow}`,
            }}>
              {userName[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.text, fontFamily: "'Inter', system-ui, sans-serif" }}>{userName}</div>
              <div style={{
                fontSize: 10, color: T.green, fontWeight: 600,
                textShadow: `0 0 6px ${T.green}80`,
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
                    padding: '5px 16px', borderRadius: 20,
                    fontSize: 12, fontWeight: active ? 600 : 500,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    cursor: 'pointer', transition: 'all 0.2s',
                    border: active ? `1px solid ${T.red}60` : `1px solid ${T.border}`,
                    background: active
                      ? `linear-gradient(135deg, ${T.red}cc, ${T.redMid}aa)`
                      : T.card,
                    color: active ? '#fff' : T.textMuted,
                    boxShadow: active ? `0 0 14px ${T.redGlow}` : 'none',
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
                flex: 1, gap: 14, paddingTop: 60,
              }}>
                <div style={{
                  fontSize: 52,
                  filter: `drop-shadow(0 0 16px ${T.red}60)`,
                }}>💀</div>
                <div style={{
                  fontSize: 16, fontWeight: 700, color: T.red,
                  letterSpacing: '2px',
                  textShadow: `0 0 16px ${T.red}80`,
                }}>NO RESULTS</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>Try changing your filters or search term</div>
                <Link href="/marketplace/post">
                  <button className="post-btn" style={{
                    marginTop: 8,
                    background: `linear-gradient(135deg, ${T.red}, ${T.redMid})`,
                    color: '#fff', border: `1px solid ${T.red}60`,
                    borderRadius: 9, padding: '10px 24px',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    letterSpacing: '0.8px',
                  }}>
                    + Post a Job
                  </button>
                </Link>
              </div>
            ) : (
              filtered.map((job, i) => (
                <div key={job.id} className="fade-card" style={{ animationDelay: `${i * 0.045}s` }}>
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