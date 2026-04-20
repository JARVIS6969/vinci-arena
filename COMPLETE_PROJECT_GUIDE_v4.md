# 🎮 VINCI-ARENA PRO — ULTIMATE PROJECT GUIDE

**Version:** 4.0.0
**Last Updated:** April 10, 2026
**Status:** 92% Complete 🚀
**GitHub:** https://github.com/JARVIS6969/vinci-arena

**Progress:**
Auth ✅ | Tournaments ✅ | Squads ✅ | Profiles ✅ | Marketplace ✅ | Chat ✅ | Dashboard ✅ | Home ✅ | Achievements ✅ | Edit Profile ✅ | Rankings ❌

---

## 📋 TABLE OF CONTENTS

1. [Quick Overview](#quick-overview)
2. [Complete Project Structure](#complete-project-structure)
3. [Tech Stack](#tech-stack)
4. [Dev Workflow](#dev-workflow)
5. [All Features Status](#all-features-status)
6. [Complete API Reference](#complete-api-reference)
7. [Database Schema](#database-schema)
8. [UI & Visual System](#ui--visual-system)
9. [Shared Components & Utils](#shared-components--utils)
10. [Setup & Installation](#setup--installation)
11. [Deployment Guide](#deployment-guide)
12. [Future Roadmap](#future-roadmap)
13. [Troubleshooting](#troubleshooting)
14. [Continuing in New Chat](#continuing-in-new-chat)

---

## 🎯 QUICK OVERVIEW

**VINCI-ARENA PRO** is a complete esports tournament management and community platform built for India's esports ecosystem.

**What it does:**
- 🏠 Advanced home page with Three.js neural globe + golden ratio particle effects
- 📊 Tournament point calculator with 40 professional export templates
- 👥 Squad/team management system
- 👤 Advanced player profiles with 3D globe stats, achievements & gameplay clips
- 💼 Job marketplace (Discord + LinkedIn hybrid) — Cyber UI
- 💬 Real-time chat (DMs + Group chats with WebSocket) — Cyber UI
- 🎨 Vinci Studio (Point tables, Certificates)
- 🏆 Achievement wall with tournament history
- ✏️ Advanced Edit Profile (3 steps, particles, 3D tilt cards, UID fetch, OCR)
- 🤖 AI Service (Python/Flask — OCR stats extraction)

**Target Users:** Esports organizers, players, teams, content creators (India focus)
**Supported Games:** Free Fire, BGMI, Valorant

---

## 📁 COMPLETE PROJECT STRUCTURE

```
tournament-calculator/
│
├── backend/
│   ├── server.js                        # Main server (ALL routes + Socket.io)
│   ├── package.json
│   ├── .env                             # NOT in git
│   └── database/
│       ├── schema.sql
│       ├── squads-schema.sql
│       ├── player-profiles-schema.sql
│       ├── marketplace-schema.sql
│       └── chat-system-schema.sql
│
├── ai-service/                          # Python Flask OCR service
│   └── main.py                          # Port 5000
│
└── frontend/
    ├── app/
    │   ├── layout.js                    # Root layout + Global navbar
    │   ├── page.js                      # Landing page (imports Hero)
    │   │
    │   ├── utils/
    │   │   └── chat.js                  # ★ Shared chat utilities
    │   │
    │   ├── components/
    │   │   ├── Hero.jsx                 # ★ Full home page (Three.js globe + particles)
    │   │   ├── FireParticles.jsx        # ★ Canvas-based golden ratio particles (15 patterns)
    │   │   ├── GameStatsDisplay.js      # ★ 3D globe liquid fill stats
    │   │   ├── Navbar.js                # Global navbar
    │   │   ├── TopLoader.js             # Red neon top loading bar
    │   │   └── chat/
    │   │       ├── ChatSidebar.jsx      # ★ Shared chat sidebar component
    │   │       └── MessageBubble.jsx    # ★ Shared message bubble component
    │   │
    │   ├── login/page.js
    │   ├── signup/page.js
    │   │
    │   ├── dashboard/page.js            # ★ Renaissance dashboard (3 tabs + radar chart)
    │   │
    │   ├── profile/
    │   │   ├── edit/page.js             # ★ Advanced edit profile (particles+3D tilt)
    │   │   └── [userId]/
    │   │       ├── page.js              # ★ Advanced public profile (3D tilt, reactions)
    │   │       └── achievements/page.js # ★ Achievement wall + tournament history
    │   │
    │   ├── tournaments/
    │   │   ├── create/page.js
    │   │   └── [id]/
    │   │       ├── page.js
    │   │       └── export/page.js       # 40 export templates
    │   │
    │   ├── studio/
    │   │   ├── page.js                  # Vinci Studio hub
    │   │   ├── certificate/page.js
    │   │   └── point-table/page.js
    │   │
    │   ├── squads/
    │   │   ├── page.js
    │   │   ├── create/page.js
    │   │   └── [id]/page.js
    │   │
    │   ├── marketplace/
    │   │   ├── page.js                  # ★ Cyber redesign — particles + scan line
    │   │   ├── post/page.js
    │   │   ├── jobs/[id]/page.js
    │   │   └── my-applications/page.js
    │   │
    │   ├── esports/page.js
    │   │
    │   └── chat/
    │       ├── chat.css                 # ★ Shared cyber chat styles
    │       ├── page.js                  # ★ Chat hub — particles + scan line
    │       ├── new/page.js              # ★ New chat — particles + scan line
    │       ├── dm/[id]/page.js          # ★ DM chat — particles + typing indicator
    │       └── group/
    │           ├── [id]/page.js         # ★ Group chat — particles + typing indicator
    │           └── [id]/info/page.js    # ★ Group info page
```

---

## 🛠 TECH STACK

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| Styling | TailwindCSS + Inline styles |
| 3D/Canvas | Three.js, Canvas API |
| Backend | Node.js + Express (single server.js) |
| AI Service | Python + Flask (port 5000) |
| Database | Supabase (PostgreSQL) |
| Auth | JWT tokens (30 day expiry) |
| Real-time | Socket.io (WebSockets) |
| OCR | Tesseract.js (frontend) + pytesseract (ai-service) |
| Fonts | Orbitron, Rajdhani, Share Tech Mono |

---

## 💻 DEV WORKFLOW

**Tools Used:**
| Tool | Purpose |
|------|---------|
| Claude AI | Writing ALL code |
| VS Code | Pasting + editing code |
| Ctrl+F | Finding specific lines/errors |
| Git Bash | Running everything (npm, git) |
| Browser | Testing (localhost:3000) |
| Supabase Dashboard | Managing database |
| GitHub | Version control & backup |

**Start Dev (2 Git Bash terminals):**
```bash
# Terminal 1 — Backend
cd ~/projects/tournament-calculator/backend && npm run dev

# Terminal 2 — Frontend
cd ~/projects/tournament-calculator/frontend && npm run dev

# Open: http://localhost:3000
```

**Git Workflow:**
```bash
git add .
git commit -m "your message"
git push
```

**Before big changes:**
```bash
git add . && git commit -m "backup before changes" && git push
```

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
- Col 1: Bio, Socials, Achievements preview + SEE ALL button
- Col 2: Game tabs, 3D tilt card with GameStatsDisplay
- Col 3: Live FF Stats (UID/OCR), Gameplay clips
- Online indicator badge
- Profile fallback for users without profile setup (shows basic info)

**Edit Profile (profile/edit/page.js) — FULLY REDESIGNED v4**
- Canvas particle background (same as marketplace)
- Animated scan line effect
- Cyber grid overlay
- 3D tilt cards on all sections
- Step 1: Basic info (display name, bio, tagline, avatar, banner, country, socials)
- Step 2: Games (Free Fire, BGMI, Valorant — role + rank per game, 3D tilt cards)
- Step 3: Stats (UID auto-fetch, OCR upload, manual entry — all with cyber design)
- Neon flicker on headings
- fadeUp animations on all elements
- glowPulse on active step indicators

**GameStatsDisplay.js (3D Globe Stats)**
- 3 animated 3D globes for KEY METRICS (K/D, Win Rate, Headshot)
- Liquid fill animation — value fills globe like water
- Wave animation on liquid surface
- Rotating orbit ring with glowing dot
- Outer percentage arc progress ring
- Glass sphere effect with latitude/longitude grid lines
- Hover: scale up, stronger glow, faster orbit

**Achievement Wall (profile/[userId]/achievements/page.js)**
- Filter tabs: All, Wins, Milestone, Rank, Special
- Achievement cards with image/icon, type badge, game badge, date, cert link
- Tournament history section below
- Add Achievement modal (owner only)

**Marketplace (marketplace/page.js) — FULLY REDESIGNED v4**
- Canvas particle background (ParticleCanvas component)
- Animated scan line effect
- Cyber grid overlay
- Sub-header with search + live count + MY ACTIVITY + POST JOB buttons
- Left sidebar: Games filter + Roles filter + User online status
- Center: Job cards with corner brackets when selected, fade-in animation
- Right panel: Job details with rainbow top line + corner brackets
- APPLY NOW button with glow pulse
- Navbar integration (paddingTop: 104px)

**Chat System — FULLY REDESIGNED v4**

*chat/page.js (Chat Hub):*
- Canvas particle background
- Animated scan line
- Cyber grid overlay
- Rainbow top line on header
- Larger avatar cards (48px) with online indicator
- Corner brackets on conversation cards
- fadeUp animation on cards
- DM/Group section dividers with glowing dots
- paddingTop: 104px

*chat/new/page.js:*
- Canvas particle background
- Animated scan line
- Cyber grid overlay
- Better input styling with focus glow
- User row hover: translateX + glow
- paddingTop: 104px

*chat/dm/[id]/page.js:*
- Floating particles (getParticles from utils)
- Scan beam in header
- Typing indicator (3 bouncing dots + username)
- Socket.io typing events (emitTypingStart/Stop)
- Message slide-in animations

*chat/group/[id]/page.js:*
- Same as DM but purple theme
- Squad members panel
- Group info navigation

*chat/group/[id]/info/page.js:*
- Group code display with copy button
- Members list with profile links
- Stats cards (members, admins, type)

*ChatSidebar.jsx (shared):*
- Cyber dark design
- Active item indicator bar (left neon line)
- DM/Group section dividers
- Online dots on DMs
- New Chat button

*MessageBubble.jsx (shared):*
- Red gradient for own messages
- Dark blue for others
- Corner accent brackets
- Timestamp with // prefix
- Sender name in groups

**AI Service (ai-service/main.py)**
- Python + Flask on port 5000
- /api/health — health check
- /api/extract — OCR stats from screenshot (mock data currently)
- Tesseract installed at C:\Program Files\Tesseract-OCR\tesseract.exe

**Other Pages (unchanged from v3)**
- Login, Signup
- Tournament CRUD + 40 export templates
- Squad create/join/view
- Esports Hub
- Vinci Studio (Hub, Point Table, Certificate)
- Free Fire Live Stats API + OCR Screenshot Stats

---

## 🔌 COMPLETE API REFERENCE

### Auth
```
POST /api/auth/register    — signup
POST /api/auth/login       — login → JWT token
GET  /api/auth/me          — get current user
```

### Users
```
GET  /api/users            — list all users (for new DM)
GET  /api/users/:id        — get user by ID (profile fallback)
```

### Profiles
```
POST /api/profiles                        — create/update profile
GET  /api/profiles/me                     — own profile
GET  /api/profiles/user/:userId           — public profile (returns basic if no profile)
GET  /api/profiles/user/:userId/games     — user games
GET  /api/profiles/user/:userId/stats     — user stats
POST /api/profiles/games                  — add/update game
POST /api/profiles/stats                  — save stats
POST /api/profiles/achievements           — add achievement
DELETE /api/profiles/achievements/:id     — delete achievement
```

### Tournaments
```
GET    /api/tournaments              — list all
POST   /api/tournaments              — create
GET    /api/tournaments/:id          — get one
PUT    /api/tournaments/:id          — update
DELETE /api/tournaments/:id          — delete
GET    /api/tournaments/:id/matches  — matches
POST   /api/tournaments/:id/matches  — add match
DELETE /api/matches/:id              — delete match
```

### Free Fire Live Stats
```
GET /api/freefire/stats/:uid   — fetch live FF stats (BR + CS)
```

### Squads
```
GET    /api/squads        — list all
POST   /api/squads        — create
GET    /api/squads/:id    — get one
PUT    /api/squads/:id    — update
DELETE /api/squads/:id    — delete
```

### Marketplace
```
GET    /api/marketplace/jobs                    — list jobs
POST   /api/marketplace/jobs                    — post job
GET    /api/marketplace/jobs/:id                — get job
POST   /api/marketplace/jobs/:id/apply          — apply to job
GET    /api/marketplace/my-applications         — my applications
GET    /api/marketplace/my-jobs                 — my posted jobs
PATCH  /api/marketplace/applications/:id/status — accept/reject
```

### Chat
```
GET  /api/chat/conversations              — DMs + groups list
GET  /api/chat/messages                   — messages (receiver_id or group_id param)
POST /api/chat/messages                   — send message
POST /api/chat/groups                     — create group
GET  /api/chat/groups/search              — search groups by name
POST /api/chat/groups/join                — join by code
GET  /api/chat/groups/:id/members         — group members
POST /api/chat/groups/:id/members         — add member
GET  /api/chat/groups/:id/info            — group info
```

### Socket.io Events
```
join         — user joins (userId)
join_room    — join chat room
new_message  — receive message
typing_start — user started typing ({ roomId, userName })
typing_stop  — user stopped typing ({ roomId, userName })
```

---

## 🗄 DATABASE SCHEMA

### Key Tables
```sql
users                — id, name, email, password_hash
player_profiles      — profile_id, user_id, display_name, bio, tagline,
                       avatar_url, banner_url, country, looking_for,
                       youtube_url, instagram_url, discord_tag, twitter_url
player_games         — id, user_id, game, role, rank
game_stats           — id, user_id, game, stats (JSONB)
achievements         — id, profile_id, title, description, achievement_type,
                       date_achieved, game, image_url, certificate_url
gameplay_clips       — id, profile_id, title, video_url, game, clip_type
tournaments          — id, user_id, name, game, format, created_at
matches              — id, tournament_id, team_name, position, kills, points
squads               — id, name, tag, bio, game, region, created_by
squad_members        — squad_id, user_id, role, in_game_name
job_postings         — id, posted_by, title, description, job_type, game,
                       role_needed, experience_level, budget_type, requirements
job_applications     — id, job_id, applicant_id, message, status
group_chats          — id, name, description, group_code, created_by, chat_type
group_chat_members   — group_id, user_id, role
dm_conversations     — id, user1_id, user2_id, last_message, last_message_at
chat_messages        — id, sender_id, receiver_id, group_id, message, created_at
```

### Supabase RLS
```sql
-- All tables: permissive policies
USING (true) WITH CHECK (true)
```

---

## 🎨 UI & VISUAL SYSTEM

### Color System (Gamer Psychology)
```
Primary Red:  #ef4444 — danger/adrenaline (brand color)
Cyan:         #00ffff — tech/precision (cyber accent)
Purple:       #a855f7 — rare/prestige (groups)
Gold:         #fbbf24 — champion/reward
Green:        #00ff88 — online/victory
Orange:       #f97316 — energy/hit (BGMI)
Indigo:       #6366f1 — Valorant
Magenta:      #ec4899 — style
```

### Backgrounds
```
Main bg:     #050510 (deep dark navy)
Card bg:     #080818
Input bg:    #080818 or rgba(8,8,24,0.8)
Sidebar bg:  #050510
```

### Typography
```
Headings:   Orbitron (900 weight) — futuristic
Body:       Rajdhani (600/700) — readable
Mono:       Share Tech Mono — code/stats/timestamps
```

### Cyber Design Pattern (v4 — Chat, Marketplace, Edit Profile)
```jsx
// Particle canvas (fixed, z-index 0)
<ParticleCanvas/>

// Scan line (fixed, z-index 1)
<div style={{
  position: 'fixed', top: `${scanY}%`,
  background: 'linear-gradient(90deg,transparent,rgba(0,255,255,0.15),rgba(239,68,68,0.2),transparent)'
}}/>

// Cyber grid (fixed, z-index 0)
<div className="cyber-grid" style={{position:'fixed',inset:0}}/>

// Content (relative, z-index 2)
<div style={{position:'relative', zIndex:2}}>

// Rainbow top line on headers
<div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',
  background:'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#10b981,#00ffff,#6366f1,#a78bfa,#ef4444)'}}/>

// Corner brackets
<div style={{position:'absolute',top:'6px',left:'6px',width:'10px',height:'10px',
  borderTop:'1.5px solid rgba(239,68,68,0.4)',borderLeft:'1.5px solid rgba(239,68,68,0.4)'}}/>
```

### paddingTop Rules
```
Pages with global navbar only:   paddingTop: '104px'
Old pages (not yet updated):     paddingTop: '44px'
Chat DM/Group pages:             paddingTop: '104px' on outer div
```

### CSS Animation Classes (chat.css)
```css
.cyber-grid    — cyan + red grid background
.conv-card     — hover: translateY + top neon line
.scan-beam     — moving horizontal beam
.msg-enter     — message slide in from bottom
.pulse-dot     — online status pulse
.temp-msg      — 0.6 opacity for sending state
.typing-dot    — bouncing typing indicator dot
```

### Game Color Coding
```
Free Fire → #ef4444 (red)
BGMI      → #f97316 (orange)
Valorant  → #6366f1 (indigo)
```

---

## 🔧 SHARED COMPONENTS & UTILS

### `frontend/app/utils/chat.js`
```js
API_URL             // 'http://localhost:3001' — change this for deployment
fetchConversations  // fetch DMs + groups
timeStr(date)       // format time HH:MM
timeAgo(date)       // "5m ago", "2h ago", etc.
handleKeyPress(e, sendFn)  // Enter to send, Shift+Enter newline
getUserId()         // localStorage.getItem('userId')
getToken()          // localStorage.getItem('token')
emitTypingStart(socket, roomId, userName)  // typing indicator start
emitTypingStop(socket, roomId, userName)   // typing indicator stop
getParticles(count)  // generate particle config for floating particles
```

### `frontend/app/components/chat/ChatSidebar.jsx`
```jsx
<ChatSidebar
  conversations={conversations}  // { dms: [], groups: [] }
  activeId={params.id}           // current chat ID
  type="dm"                      // "dm" or "group"
/>
```

### `frontend/app/components/chat/MessageBubble.jsx`
```jsx
<MessageBubble
  msg={msg}           // message object
  userId={userId}     // current user ID
  showName={true}     // show sender name (groups) or not (DMs)
  avatarColor={color} // gradient string for avatar
/>
```

### `frontend/app/chat/chat.css`
- All shared styles for chat pages
- Import with: `import '@/app/chat/chat.css'`

---

## 🚀 SETUP & INSTALLATION

### Prerequisites
- Node.js 18+
- Git + Git Bash
- Supabase account
- Python 3 (for ai-service)

### 1. Clone
```bash
git clone https://github.com/JARVIS6969/vinci-arena.git
cd vinci-arena
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
# Create .env file:
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
JWT_SECRET=your_32char_secret
PORT=3001

npm run dev
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### 5. AI Service (optional)
```bash
cd ai-service
pip install flask flask-cors pytesseract pillow
python main.py
# Runs on http://localhost:5000
```

---

## 🚢 DEPLOYMENT

### Backend → Railway
1. New project → Deploy from GitHub
2. Root: `backend`, Start: `npm start`
3. Add env vars: SUPABASE_URL, SUPABASE_ANON_KEY, JWT_SECRET, PORT=3001

### Frontend → Vercel
1. Import from GitHub, root: `frontend`
2. **CRITICAL:** Replace ALL `http://localhost:3001` with Railway URL
3. Only ONE place to change: `frontend/app/utils/chat.js` → `API_URL`
4. Also update Socket.io URL in dm/group chat pages

### After Deployment — Find localhost URLs:
```bash
# In frontend folder
grep -r "localhost:3001" . --include="*.js" --include="*.jsx"
```

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
- [ ] Real OCR in ai-service (currently mock data)
- [ ] Production deployment
- [ ] Razorpay payments (Phase 2)

### Known Issues To Fix
- [ ] Online status is fake (always green) — needs Socket.io presence tracking
- [ ] Auto-sends "👋 Hey!" when starting DM — UX improvement needed
- [ ] No error messages shown to user on API failures
- [ ] Chat pages still have some localhost:3001 hardcoded

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

# GameStatsDisplay in wrong file
# Symptom: "Module not found: Can't resolve ../../components/GameStatsDisplay"
# Fix: Restore original GameStatsDisplay.js content

# Profile black screen
# Fix: outer div paddingTop should be '104px'

# Chat page content hidden under navbar
# Fix: paddingTop: '104px' on outer div

# Marketplace content hidden
# Fix: height: 'calc(100vh - 104px)', marginTop: '104px'
```

### Import Paths
```jsx
// Correct imports:
import GameStatsDisplay from '@/app/components/GameStatsDisplay';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import MessageBubble from '@/app/components/chat/MessageBubble';
import { API_URL, getToken, getUserId } from '@/app/utils/chat';
import '@/app/chat/chat.css';

// NOT relative paths like:
import GameStatsDisplay from '../../components/GameStatsDisplay'; // ❌
```

### Critical Rules
```
1. Never paste wrong code into GameStatsDisplay.js or FireParticles.jsx
2. Always git commit before major changes
3. Profile paddingTop: '104px' (not '44px')
4. Import GameStatsDisplay with @/app/components/ path
5. Feature cards use window.location.href (NOT router.push — cursor intercept bug)
6. chat.css is shared — changes affect ALL chat pages
7. API_URL in utils/chat.js is the ONE place to change for deployment
```

---

## 📞 CONTINUING IN NEW CHAT

**Paste this EXACTLY in new Claude/AI conversation:**

```
Hi! I'm continuing work on VINCI-ARENA PRO esports platform.

I'm attaching COMPLETE_PROJECT_GUIDE_v4.md — please read it fully before helping.

TECH STACK:
- Frontend: Next.js 15 + TailwindCSS + Inline styles
- Backend: Node.js + Express (single server.js file)
- Database: Supabase (PostgreSQL)
- Real-time: Socket.io
- AI Service: Python Flask (port 5000)
- Language: JavaScript only (no TypeScript)

GITHUB: https://github.com/JARVIS6969/vinci-arena

DEV SETUP:
- Terminal 1: cd ~/projects/tournament-calculator/backend && npm run dev
- Terminal 2: cd ~/projects/tournament-calculator/frontend && npm run dev
- Browser: http://localhost:3000
- Editor: VS Code (copy paste from Claude into VS Code)
- Terminal: Git Bash for everything

KEY FILES:
- frontend/app/components/Hero.jsx — home page Three.js globe + FireParticles
- frontend/app/components/FireParticles.jsx — 15 golden ratio canvas patterns
- frontend/app/components/GameStatsDisplay.js — 3D globe liquid fill stats
- frontend/app/profile/[userId]/page.js — advanced profile
- frontend/app/profile/edit/page.js — edit profile (particles + 3D tilt)
- frontend/app/dashboard/page.js — Renaissance dashboard
- frontend/app/marketplace/page.js — cyber marketplace
- frontend/app/chat/page.js — chat hub
- frontend/app/chat/chat.css — shared chat styles
- frontend/app/utils/chat.js — shared chat utilities (API_URL here)
- frontend/app/components/chat/ChatSidebar.jsx — shared sidebar
- frontend/app/components/chat/MessageBubble.jsx — shared bubble
- backend/server.js — ALL API routes

CRITICAL RULES:
1. Never paste wrong code into GameStatsDisplay.js or FireParticles.jsx
2. Always git commit before major changes
3. paddingTop: '104px' on pages (navbar is 104px tall)
4. Import with @/app/ paths not relative paths
5. API_URL = 'http://localhost:3001' in utils/chat.js
6. chat.css is shared by ALL chat pages
7. JavaScript only — no TypeScript

DESIGN SYSTEM (v4 — Cyber Theme):
- Background: #050510
- Cards: #080818
- Primary: #ef4444 (red)
- Cyber accent: #00ffff (cyan)
- Groups: #a855f7 (purple)
- Fonts: Orbitron (headings), Rajdhani (body), Share Tech Mono (mono)
- All new pages have: ParticleCanvas + scan line + cyber grid

CURRENT STATUS: 92% complete
WHAT'S DONE: Auth, Tournaments, Squads, Profiles, Marketplace, Chat (all cyber redesigned), Dashboard, Home, Achievements, Edit Profile
WHAT'S PENDING: Rankings, Mobile responsive, Notifications, BGMI/Valorant stats, Production deployment

I need help with: [YOUR SPECIFIC TASK]
```

---

## 📊 PROJECT METRICS

| Metric | Value |
|--------|-------|
| Overall Progress | 92% |
| Total Files | ~70 |
| Lines of Code | ~30,000+ |
| Database Tables | 15 |
| API Endpoints | ~45 |
| Pages | 30+ |
| Key Components | 8 |
| Templates | 40 |
| Canvas Animations | 4 major |
| Git Commits | 52+ |
| Dev Time | ~7 weeks |

---

## ✅ FEATURE COMPLETION CHECKLIST

**Core:**
- [x] Authentication (Signup/Login/JWT)
- [x] Tournament Calculator
- [x] 40 Export Templates
- [x] Squad System
- [x] Player Profiles (edit — v4 redesign)
- [x] Public Profiles (advanced)
- [x] Achievement Wall
- [x] Gameplay Clips
- [x] Marketplace (Full + cyber redesign)
- [x] Chat System (DM + Groups + WebSocket + cyber redesign)
- [x] Dashboard (Renaissance themed)
- [x] Vinci Studio (Hub, Point Table, Certificate)
- [x] Free Fire Live Stats API
- [x] OCR Screenshot Stats
- [x] AI Service (Python Flask)
- [x] Profile fallback for users without profile
- [x] Typing indicator in chat

**Visual/UI (v4):**
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
- [x] Cyber Particle Canvas (marketplace, chat, edit profile)
- [x] Animated Scan Line
- [x] Corner Brackets on Cards
- [x] Typing Indicator Animation
- [x] Message Slide-in Animation
- [x] Rainbow Top Line on Headers
- [x] Floating Particle Background

**Pending:**
- [ ] Rankings System
- [ ] Mobile Responsive
- [ ] Notifications
- [ ] BGMI/Valorant Live Stats
- [ ] MVP Card / Banner Generator
- [ ] Production Deployment
- [ ] Real OCR in ai-service

---

*VINCI-ARENA PRO — Built for India's Esports Community*
*Next.js + Express + Supabase + Socket.io + Three.js + Python Flask*
*Version 4.0.0 | April 2026*
*GitHub: https://github.com/JARVIS6969/vinci-arena*


I'm working on a full-stack project and continuing from a previous session.

🚀 Project: VINCI-ARENA PRO (Esports Platform)  
🔗 GitHub: https://github.com/JARVIS6969/vinci-arena  

🧱 Tech Stack:
- Frontend: Next.js 15 (port 3000)
- Backend: Node.js + Express (port 3001)
- Database: Supabase
- Realtime: Socket.io

💻 Environment:
- I am using Git Bash for version control

📌 Current Task:
[Clearly describe what you're trying to build or fix]

🐞 Issue:
[Explain the exact bug/problem in 1–2 lines]

✅ Expected Behavior:
[What should happen]

❌ Actual Behavior:
[What is happening instead]

🧪 What I Tried:
[List 1–3 attempts briefly]

📂 Relevant Code:
[Paste only necessary code]

⚠️ Constraints (if any):
[Deadlines, limitations, etc.]

---

🛠️ I want you to:
1. Fix the issue with clear explanation  
2. Suggest better/optimized approach  
3. Identify edge cases or hidden bugs  
4. Keep solution clean and production-ready  

---

💾 Git Workflow (Git Bash - IMPORTANT):

Before making changes, remind me to run:

cd ~/projects/tournament-calculator  
git add .  
git commit -m "backup before changes"  
git push  

After fixing, suggest proper commit commands like:

git add .  
git commit -m "[clear and meaningful message]"  
git push  

---

📘 Documentation Update:
Tell me clearly:
- Should I update README.md? (Yes/No)
- What exact lines/section to add

---

📝 Session Summary (VERY IMPORTANT):
At the end of your answer, include:

1. What problem we solved  
2. What changes were made  
3. Files affected  
4. Suggested commit message  
5. Documentation update (ready-to-paste text)