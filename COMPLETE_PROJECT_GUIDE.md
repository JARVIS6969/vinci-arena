# 🎮 VINCI-ARENA PRO - ULTIMATE PROJECT GUIDE

**Version:** 3.0.0  
**Last Updated:** March 27, 2026  
**Status:** 88% Complete 🚀  
**Progress:** Auth ✅ | Tournaments ✅ | Squads ✅ | Profiles ✅ | Marketplace ✅ | Chat ✅ | Dashboard ✅ | Home ✅ | Achievements ✅ | Rankings ❌

---

## 📋 TABLE OF CONTENTS

1. [Quick Overview](#quick-overview)
2. [Complete Project Structure](#complete-project-structure)
3. [Tech Stack](#tech-stack)
4. [All Features Status](#all-features-status)
5. [Complete API Reference](#complete-api-reference)
6. [Database Schema](#database-schema)
7. [UI & Visual System](#ui--visual-system)
8. [Setup & Installation](#setup--installation)
9. [Deployment Guide](#deployment-guide)
10. [Future Roadmap](#future-roadmap)
11. [Troubleshooting](#troubleshooting)
12. [Continuing in New Chat](#continuing-in-new-chat)

---

## 🎯 QUICK OVERVIEW

**VINCI-ARENA PRO** is a complete esports tournament management and community platform built for India's esports ecosystem.

**What it does:**
- 🏠 Advanced home page with Three.js neural globe + golden ratio particle effects
- 📊 Tournament point calculator with 40 professional export templates
- 👥 Squad/team management system
- 👤 Advanced player profiles with 3D globe stats, achievements & gameplay clips
- 💼 Job marketplace (Discord + LinkedIn hybrid)
- 💬 Real-time chat (DMs + Group chats with WebSocket)
- 🎨 Vinci Studio (Point tables, Certificates, Banners, MVP Cards)
- 🏆 Achievement wall with tournament history

**Target Users:** Esports organizers, players, teams, content creators (India focus)  
**Supported Games:** Free Fire, BGMI, Valorant

---

## 📁 COMPLETE PROJECT STRUCTURE

```
tournament-calculator/
│
├── backend/
│   ├── server.js                     # Main server (all routes + Socket.io)
│   ├── package.json
│   ├── .env                          # NOT in git
│   └── database/
│       ├── schema.sql
│       ├── squads-schema.sql
│       ├── player-profiles-schema.sql
│       ├── marketplace-schema.sql
│       └── chat-system-schema.sql
│
└── frontend/
    ├── app/
    │   ├── layout.js                 # Root layout + Global navbar
    │   ├── page.js                   # Landing page (imports Hero)
    │   │
    │   ├── components/
    │   │   ├── Hero.jsx              # ★ Full home page (Three.js globe + particles)
    │   │   ├── FireParticles.jsx     # ★ Canvas-based golden ratio particles (15 patterns)
    │   │   ├── GameStatsDisplay.js   # ★ 3D globe stats + animated bars
    │   │   └── Navbar.js             # Global navbar
    │   │
    │   ├── login/page.js
    │   ├── signup/page.js
    │   │
    │   ├── dashboard/
    │   │   └── page.js               # ★ Renaissance dashboard (3 tabs + radar chart)
    │   │
    │   ├── profile/
    │   │   ├── edit/page.js          # Edit profile (3 tabs: Profile, Games, Stats)
    │   │   └── [userId]/
    │   │       ├── page.js           # ★ Advanced public profile (3D tilt, reactions)
    │   │       └── achievements/
    │   │           └── page.js       # ★ Achievement wall + tournament history
    │   │
    │   ├── tournaments/
    │   │   ├── create/page.js
    │   │   └── [id]/
    │   │       ├── page.js
    │   │       └── export/page.js    # 40 export templates
    │   │
    │   ├── studio/
    │   │   ├── page.js               # Vinci Studio hub
    │   │   ├── certificate/page.js
    │   │   └── point-table/page.js
    │   │
    │   ├── squads/
    │   │   ├── page.js
    │   │   ├── create/page.js
    │   │   └── [id]/page.js
    │   │
    │   ├── marketplace/page.js
    │   ├── esports/page.js
    │   │
    │   └── chat/
    │       ├── page.js
    │       ├── dm/[id]/page.js
    │       └── group/[id]/page.js
```

---

## 🛠 TECH STACK

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| Styling | TailwindCSS + Inline styles |
| 3D/Canvas | Three.js, Canvas API |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Auth | JWT tokens |
| Real-time | Socket.io (WebSockets) |
| OCR | Tesseract.js |
| Fonts | Orbitron, Rajdhani, Share Tech Mono |

---

## ✅ ALL FEATURES STATUS

### COMPLETED ✅

**Home Page (Hero.jsx)**
- Three.js neural network globe (left panel) — nodes spawn on user interaction
- 8 shape illusion patterns rotating (triangle, pentagon, hexagon, spiral, etc.)
- Sphere cloud (4000 particles) rotating
- FireParticles.jsx — 15 golden ratio patterns (spiral, sunflower, metatron cube, etc.)
- Gamer psychology color pairs (12 pairs: Danger Zone, Champion Loot, Hacker, etc.)
- OKLCH perceptual color system
- Blueprint canvas animation
- Animated ticker, feature cards, stat counters
- Full page sections (games, features, studio, FAQ, CTA)

**Dashboard (dashboard/page.js)**
- Renaissance-themed design with particle canvas background
- 3 tabs: VINCI STUDIO, ESPORTS HUB, TOURNAMENTS
- SVG Radar/Spider chart (player stats visualization)
- Holographic player card with XP bar
- Live clock, activity pulse bars, system status

**Public Profile (profile/[userId]/page.js)**
- Full-width hero banner with BannerParticles canvas (120 stars + connections)
- Rotating neon ring avatar (conic-gradient animation)
- Rainbow animated name (8 neon colors cycling)
- 3-column dossier layout (250px | 1fr | 270px)
- 3D tilt game card (mouse-track perspective tilt + shine)
- Floating emoji reactions button (🔥⚡💀🏆🎯👑)
- Animated skill bars (K/D, Win%, HS%, Kills) with shimmer
- Glow cards (hover = neon border + translateY + inner glow)
- Col 1: Bio, Socials, Achievements preview + SEE ALL button, Quick View
- Col 2: Game tabs, 3D tilt card with GameStatsDisplay
- Col 3: Live FF Stats (UID/OCR), Gameplay clips
- Online indicator badge

**GameStatsDisplay.js (3D Globe Stats)**
- 3 animated 3D globes for KEY METRICS (K/D, Win Rate, Headshot, Combat Score)
- Liquid fill animation — value fills globe like water based on % of max
- Wave animation on liquid surface with foam/shine
- Rotating orbit ring with glowing dot around each globe
- Outer percentage arc progress ring
- Glass sphere effect with latitude/longitude grid lines
- Hover: scale up, stronger glow, faster orbit
- Performance bars with shimmer effect
- Badge cards for rank/titles
- Neon colors: K/D=#ff0044, Win Rate=#00ffff, Headshot=#ff00ff, etc.

**Achievement Wall (profile/[userId]/achievements/page.js)**
- Filter tabs: All, Wins, Milestone, Rank, Special
- Achievement cards with image/icon, type badge, game badge, date, cert link
- Tournament history section below
- Add Achievement modal (owner only) — title, desc, type, game, date, image, cert URL
- Scan-fx animation, corner brackets, neon styling

**Edit Profile (profile/edit/page.js)**
- 3 tabs: Profile, Games, Stats
- Profile tab: Display name, tagline, bio, avatar/banner URL, country, looking_for, socials
- Games tab: Select Free Fire/BGMI/Valorant, role + rank per game
- Stats tab: UID auto-fetch (Free Fire API), OCR screenshot, manual entry

**FireParticles.jsx (Golden Ratio Canvas)**
- 15 patterns: Golden Spiral, Fibonacci Sunflower, Pentagram, Hexagonal Lattice,
  Lissajous 8:13, Metatron's Cube, Rose Curve, Torus Knot, Flower of Life,
  Epicycloid, Hypocycloid, Harmonograph, Vesica Piscis, Golden Rectangle, Concentric Rings
- Two simultaneous shapes for hallucination/interference effect
- Hallucination trail (0.92 alpha clear = 8% ghost persistence)
- 12 gamer psychology color pairs
- 60 ambient background dots
- Phase lifecycle: fadein → hold (200 frames) → fadeout → next random pattern
- Particle size BASE=0.8, uniform

**Other Pages**
- Login, Signup, Tournament CRUD + 40 export templates
- Squad create/join/view, Marketplace full, Esports Hub
- Chat (DM + Groups with WebSocket), Certificate Generator, Point Table Generator

---

## 🎨 UI & VISUAL SYSTEM

### Color System (Gamer Psychology)
```
Primary:    #ef4444 (red — danger/adrenaline)
Cyan:       #00ffff (tech/precision)  
Gold:       #fbbf24 (champion/reward)
Purple:     #a78bfa (rare/prestige)
Green:      #10b981 (victory)
Orange:     #f97316 (energy/hit)
Magenta:    #ec4899 (style)
```

### Typography
```
Headings:   Orbitron (900 weight) — futuristic
Body:       Rajdhani (600/700) — readable
Mono:       Share Tech Mono — code/stats
```

### CSS Animation Classes
```css
.scan-fx    — horizontal scanline across cards
.blink      — opacity blink (indicators)
.fu         — fadeUp entrance animation
.rainbow-name — 8-color cycle on name
.grid-bg    — red grid background pattern
```

### Key CSS Patterns
```jsx
// Corner brackets
<div className="c tl" style={{borderColor:'#ef4444'}}/>
<div className="c br" style={{borderColor:'rgba(0,255,255,0.3)'}}/>

// Neon card
background: '#050505'
border: '1px solid rgba(239,68,68,0.15)'
hover: boxShadow: '0 0 30px rgba(239,68,68,0.25)'

// Game color coding
Free Fire → #ef4444
BGMI      → #f97316  
Valorant  → #6366f1
```

---

## 🔌 COMPLETE API REFERENCE

### Auth
```
POST /api/auth/register    — signup
POST /api/auth/login       — login → JWT token
GET  /api/auth/me          — get current user
```

### Profiles
```
POST /api/profiles                           — create/update profile
GET  /api/profiles/me                        — own profile
GET  /api/profiles/user/:userId              — public profile
GET  /api/profiles/user/:userId/games        — user games
GET  /api/profiles/user/:userId/stats        — user stats
POST /api/profiles/games                     — add/update game
POST /api/profiles/stats                     — save stats
POST /api/profiles/achievements              — add achievement
POST /api/profiles/clips                     — add gameplay clip
```

### Tournaments
```
GET  /api/tournaments          — list all
POST /api/tournaments          — create
GET  /api/tournaments/:id      — get one
PUT  /api/tournaments/:id      — update
GET  /api/tournaments/:id/matches — matches
POST /api/tournaments/:id/matches — add match
```

### Free Fire Live Stats
```
GET /api/freefire/stats/:uid   — fetch live FF stats
```

### Chat
```
GET  /api/chat/conversations          — DMs + groups
POST /api/chat/messages               — send DM
GET  /api/chat/dm/:convId/messages    — DM history
POST /api/chat/groups                 — create group
POST /api/chat/groups/:id/messages    — send to group
```

### Marketplace
```
GET  /api/marketplace/jobs    — list jobs
POST /api/marketplace/jobs    — post job
POST /api/marketplace/jobs/:id/apply — apply
```

---

## 🗄 DATABASE SCHEMA

### Key Tables
```sql
users                  — id, username, email, password_hash
player_profiles        — profile_id, user_id, display_name, bio, tagline,
                         avatar_url, banner_url, country, looking_for,
                         youtube_url, instagram_url, discord_tag, twitter_url
player_games           — id, profile_id, game, role, rank
game_stats             — id, profile_id, game, stats (JSONB)
achievements           — id, profile_id, title, description, achievement_type,
                         date_achieved, game, image_url, certificate_url
gameplay_clips         — id, profile_id, title, video_url, game, clip_type
tournaments            — id, user_id, name, game, format, created_at
matches                — id, tournament_id, team1, team2, scores...
squads                 — id, name, game, owner_id
squad_members          — squad_id, user_id, role
jobs                   — id, title, company, type, game...
conversations          — id, user1_id, user2_id (DMs)
messages               — id, conversation_id, sender_id, message, created_at
```

### Supabase RLS
```sql
-- All tables: permissive policies
USING (true) WITH CHECK (true)
```

---

## 🚀 SETUP & INSTALLATION

### Prerequisites
- Node.js 18+
- Git
- Supabase account

### 1. Clone
```bash
git clone https://github.com/YOUR_USERNAME/tournament-calculator.git
cd tournament-calculator
```

### 2. Supabase Setup
Run SQL files in order in Supabase SQL Editor:
```
backend/database/schema.sql
backend/database/squads-schema.sql
backend/database/player-profiles-schema.sql
backend/database/marketplace-schema.sql
backend/database/chat-system-schema.sql
```

### 3. Backend
```bash
cd backend
npm install
# Create .env
echo "SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
JWT_SECRET=your_32char_secret
PORT=3001" > .env
npm run dev
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Start Dev (both terminals)
```bash
# Terminal 1
cd ~/Projects/tournament-calculator/backend && npm run dev

# Terminal 2
cd ~/Projects/tournament-calculator/frontend && npm run dev
```

---

## 🚢 DEPLOYMENT

### Backend → Railway
1. New project → Deploy from GitHub
2. Root: `backend`, Start: `npm start`
3. Add env vars (SUPABASE_URL, SUPABASE_ANON_KEY, JWT_SECRET, PORT=3001)

### Frontend → Vercel
1. Import from GitHub, root: `frontend`
2. Replace ALL `http://localhost:3001` with Railway URL
3. Update Socket.io URL in chat pages

---

## 🎯 FUTURE ROADMAP

### Pending Features
- [ ] Rankings System (global leaderboard, ELO)
- [ ] Mobile Responsiveness
- [ ] BGMI stats API integration
- [ ] Valorant stats API integration
- [ ] Notifications system
- [ ] MVP Card Generator (/studio/mvp-card)
- [ ] Banner Generator (/studio/banner)
- [ ] My Creations page (/studio/my-creations)
- [ ] Razorpay payments (Phase 2)
- [ ] Production deployment

---

## 🐛 TROUBLESHOOTING

### Common Issues
```bash
# Port in use
lsof -i :3001 && kill -9 <PID>

# Frontend build error
rm -rf .next node_modules && npm install && npm run dev

# Hydration error (clock/random)
# Fix: useState(null) → set in useEffect

# clearShape not defined
# Fix: Remove clearShape() from cleanup, keep clearInterval(shapeTimer)

# GameStatsDisplay in wrong file
# Symptom: "Module not found: Can't resolve ../../components/GameStatsDisplay"
# Fix: Restore original GameStatsDisplay.js content

# Profile black screen
# Fix: outer div paddingTop should be '44px', banner is inside grid-bg
```

### Import Paths
```jsx
// Profile page correct import:
import GameStatsDisplay from '@/app/components/GameStatsDisplay';

// NOT:
import GameStatsDisplay from '../../components/GameStatsDisplay';
```

---

## 📞 CONTINUING IN NEW CHAT

**Paste this exactly in new Claude conversation:**

```
Hi Claude! I'm continuing work on VINCI-ARENA PRO esports platform.

Please read the attached COMPLETE_PROJECT_GUIDE.md file to understand the full project.

Tech: Next.js 15 + Express + Supabase + Socket.io
Progress: 88% complete

KEY FILES:
- frontend/app/components/Hero.jsx — home page Three.js globe + FireParticles
- frontend/app/components/FireParticles.jsx — 15 golden ratio canvas patterns  
- frontend/app/components/GameStatsDisplay.js — 3D globe liquid fill stats
- frontend/app/profile/[userId]/page.js — advanced profile with 3D tilt + reactions
- frontend/app/profile/[userId]/achievements/page.js — achievement wall
- frontend/app/dashboard/page.js — Renaissance dashboard

CRITICAL RULES:
1. Never paste wrong code into GameStatsDisplay.js or FireParticles.jsx
2. Always take backup before major changes: cp file.js file.js.backup
3. Profile paddingTop:'44px' on outer div — banner is INSIDE grid-bg
4. Import GameStatsDisplay with @/app/components/ path
5. feature cards use window.location.href (NOT router.push — cursor intercept bug)
6. Always git commit before big changes

WHAT'S WORKING PERFECTLY:
- Home page neural globe + particles
- Profile page (3D tilt, reactions, skill bars, rotating avatar ring)
- GameStatsDisplay (3D liquid globes + neon bars)
- Achievement wall
- Dashboard with tabs + radar chart
- All core features (tournaments, squads, chat, marketplace)

I need help with: [YOUR SPECIFIC TASK]
```

---

## 📊 PROJECT METRICS

| Metric | Value |
|--------|-------|
| Overall Progress | 88% |
| Total Files | ~65 |
| Lines of Code | ~25,000+ |
| Database Tables | 15 |
| API Endpoints | ~40 |
| Pages | 28+ |
| Components | 6 key |
| Templates | 40 |
| Canvas Animations | 3 major |

---

## ✅ FEATURE COMPLETION CHECKLIST

**Core:**
- [x] Authentication (Signup/Login/JWT)
- [x] Tournament Calculator
- [x] 40 Export Templates
- [x] Squad System
- [x] Player Profiles (edit)
- [x] Public Profiles (advanced)
- [x] Achievement Wall (separate page)
- [x] Gameplay Clips
- [x] Marketplace (Full)
- [x] Chat System (DM + Groups + WebSocket)
- [x] Dashboard (Renaissance themed)
- [x] Vinci Studio (Hub, Point Table, Certificate)
- [x] Free Fire Live Stats API
- [x] OCR Screenshot Stats

**Visual/UI:**
- [x] Three.js Neural Globe (home)
- [x] 15 Golden Ratio Particles (FireParticles)
- [x] 3D Globe Stats (liquid fill)
- [x] Rotating Neon Ring Avatar
- [x] Banner Particle Canvas
- [x] 3D Tilt Game Card
- [x] Rainbow Name Animation
- [x] Floating Emoji Reactions
- [x] Animated Skill Bars
- [x] Glow Cards (hover effects)
- [x] Gamer Psychology Color System

**Pending:**
- [ ] Rankings System
- [ ] Mobile Responsive
- [ ] Notifications
- [ ] BGMI/Valorant Live Stats
- [ ] MVP Card / Banner Generator
- [ ] Production Deployment

---

*VINCI-ARENA PRO — Built for India's Esports Community*  
*Next.js + Express + Supabase + Socket.io + Three.js*  
*Version 3.0.0 | March 2026*
