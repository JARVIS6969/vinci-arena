  # 🎮 VINCI-ARENA PRO - Complete Project Documentation

**Version:** 1.0.0  
**Last Updated:** February 24, 2026  
**Status:** Production Ready 🚀

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features Implemented](#features-implemented)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [How It All Works](#how-it-all-works)
8. [Setup Instructions](#setup-instructions)
9. [Environment Variables](#environment-variables)
10. [Future Roadmap](#future-roadmap)
11. [Deployment Guide](#deployment-guide)

---

## 🎯 PROJECT OVERVIEW

**VINCI-ARENA PRO** is a complete esports tournament management platform with:
- Tournament point table calculator (40 templates)
- Squad/team management system
- Player profile & achievement system
- Job marketplace (Discord + LinkedIn hybrid)
- Real-time chat system (DMs + Groups)

**Target Users:** Esports tournament organizers, players, teams, and content creators in India

**Supported Games:** Free Fire, BGMI, Valorant

---

## 💻 TECH STACK

### **Frontend**
- **Framework:** Next.js 15.1.4 (React 18)
- **Language:** JavaScript (ES6+)
- **Styling:** TailwindCSS 3.x
- **UI Components:** Custom components (no external UI library)
- **Routing:** Next.js App Router
- **State Management:** React useState/useEffect hooks

### **Backend**
- **Framework:** Express.js 4.x
- **Language:** JavaScript (Node.js)
- **Runtime:** Node.js 18+
- **Module System:** ES Modules (import/export)

### **Database**
- **Primary DB:** Supabase (PostgreSQL 15)
- **ORM:** Supabase JavaScript Client
- **Authentication:** JWT (JSON Web Tokens)

### **File Storage**
- **Storage:** Supabase Storage (for future image uploads)
- **Current:** Image URLs (Imgur/external links)

---

## 📁 PROJECT STRUCTURE
```
tournament-calculator/
│
├── backend/                          # Express.js API Server
│   ├── server.js                     # Main server file (all routes)
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables (NOT in git)
│   ├── .env.example                  # Template for env vars
│   └── database/                     # SQL schema files
│       ├── schema.sql                # Initial schema (users, tournaments)
│       ├── squads-schema.sql         # Squad system tables
│       ├── player-profiles-schema.sql # Profiles, achievements, clips
│       ├── marketplace-schema.sql    # Jobs, applications
│       └── chat-system-schema.sql    # Messages, groups, DMs
│
├── frontend/                         # Next.js React App
│   ├── app/                          # App Router pages
│   │   ├── layout.js                 # Root layout
│   │   ├── page.js                   # Landing page
│   │   │
│   │   ├── login/                    # Authentication
│   │   │   └── page.js
│   │   ├── signup/
│   │   │   └── page.js
│   │   │
│   │   ├── dashboard/                # Main Dashboard
│   │   │   └── page.js               # Quick nav + 2 main cards
│   │   │
│   │   ├── tournaments/              # Tournament System
│   │   │   ├── create/
│   │   │   │   └── page.js           # Create tournament
│   │   │   └── [id]/                 # Dynamic routes
│   │   │       ├── page.js           # View/edit tournament
│   │   │       └── export/
│   │   │           └── page.js       # Export with 40 templates
│   │   │
│   │   ├── squads/                   # Squad System
│   │   │   ├── page.js               # List all squads
│   │   │   ├── create/
│   │   │   │   └── page.js           # Create squad
│   │   │   └── [id]/
│   │   │       └── page.js           # Squad profile
│   │   │
│   │   ├── profile/                  # Player Profiles
│   │   │   ├── page.js               # My profile
│   │   │   ├── achievements/
│   │   │   │   └── page.js           # Achievement wall
│   │   │   └── clips/
│   │   │       └── page.js           # Gameplay clips
│   │   │
│   │   ├── marketplace/              # Job Marketplace
│   │   │   ├── page.js               # Discord+LinkedIn style
│   │   │   ├── post/
│   │   │   │   └── page.js           # Post job (future)
│   │   │   └── my-applications/
│   │   │       └── page.js           # Track applications (future)
│   │   │
│   │   ├── esports/                  # Esports Hub Landing
│   │   │   └── page.js               # All features overview
│   │   │
│   │   └── chat/                     # Chat System (future pages)
│   │       ├── new/
│   │       ├── dm/[id]/
│   │       └── group/[id]/
│   │
│   ├── components/                   # Reusable Components
│   │   └── chat/
│   │       ├── ChatButton.js         # Floating chat button
│   │       └── ChatSidebar.js        # Chat sidebar
│   │
│   ├── public/                       # Static Assets
│   │   ├── vinci-logo.jpg            # Brand logo
│   │   └── templates/
│   │       └── backgrounds/          # Template backgrounds
│   │           ├── bg-1.jpg to bg-16.jpg
│   │
│   ├── package.json                  # Frontend dependencies
│   ├── tailwind.config.js            # TailwindCSS config
│   └── next.config.js                # Next.js config
│
└── README.md                         # Basic project info
```

---

## ✨ FEATURES IMPLEMENTED

### **1. Authentication System**
- **Status:** ✅ Complete
- **Pages:** `/login`, `/signup`
- **Features:**
  - JWT token-based auth (30-day expiry)
  - Secure password hashing (bcrypt)
  - Protected routes
  - Auto-redirect if not logged in

### **2. Tournament Calculator**
- **Status:** ✅ Complete
- **Pages:** `/tournaments/create`, `/tournaments/[id]`, `/tournaments/[id]/export`
- **Features:**
  - Support for 3 games (Free Fire, BGMI, Valorant)
  - Auto point calculation (placement + kills)
  - 12-team bulk entry
  - Real-time standings calculation
  - 40 export templates:
    - Templates 1-16: Moderate neon (color-matched backgrounds)
    - Templates 17-32: High opacity variants
    - Templates 33-40: Extreme neon special pro templates
  - Download as image (Canvas API)

### **3. Squad System**
- **Status:** ✅ Complete
- **Pages:** `/squads`, `/squads/create`, `/squads/[id]`
- **Features:**
  - Create squads (up to 4 members)
  - Invite system (via Squad ID)
  - Role management (Leader, Member)
  - Squad profile with stats
  - Member management (kick, promote)

### **4. Player Profiles**
- **Status:** ✅ Complete
- **Pages:** `/profile`, `/profile/achievements`, `/profile/clips`
- **Features:**
  - Personal profile (display name, bio, primary game)
  - Achievement wall (tournament wins, milestones, ranks)
  - Gameplay clips (YouTube embeds)
  - Stats tracking (tournaments, wins, kills)
  - Edit profile capability

### **5. Marketplace**
- **Status:** ⚡ Partial (UI complete, functionality pending)
- **Pages:** `/marketplace`
- **Features:**
  - Discord + LinkedIn hybrid design
  - Left sidebar: Games & Categories filter
  - Center: Job listings feed
  - Right: Job details panel
  - Job types: Player, Squad, Content Creator, Coach, Analyst
  - Browse & filter jobs
  - **Pending:** Post job, Apply to job, My applications

### **6. Chat System**
- **Status:** ⚡ Partial (Backend complete, UI pending)
- **Components:** `ChatButton`, `ChatSidebar`
- **Features:**
  - Direct messages (1-on-1)
  - Group chats (like Discord servers)
  - File/link sharing support
  - Real-time conversation list
  - **Pending:** Full chat UI, message sending/receiving

### **7. Esports Hub**
- **Status:** ✅ Complete
- **Page:** `/esports`
- **Features:**
  - Central landing page for all esports features
  - 4 feature cards (Squads, Profiles, Marketplace, Rankings)
  - Status badges (LIVE, SOON, PLANNED)
  - Professional Netflix-style design

### **8. Dashboard**
- **Status:** ✅ Complete
- **Page:** `/dashboard`
- **Features:**
  - Quick access navigation (4 cards)
  - Point Table card (red theme, tournament list)
  - Esports Hub card (Netflix style, feature menu)
  - Floating chat button
  - User greeting & logout

---

## 🗄️ DATABASE SCHEMA

### **Tables Created:**

1. **users** - User accounts
2. **tournaments** - Tournament metadata
3. **matches** - Match results (team, kills, position, points)
4. **squads** - Team/squad information
5. **squad_members** - Squad membership (with roles)
6. **player_profiles** - Player profile data
7. **achievements** - Player achievements
8. **gameplay_clips** - Video highlights
9. **player_stats** - Per-game statistics
10. **job_postings** - Marketplace job listings
11. **job_applications** - Job applications
12. **group_chats** - Group chat rooms
13. **group_chat_members** - Group membership
14. **chat_messages** - All messages (DM + Group)
15. **dm_conversations** - DM conversation metadata

**All SQL files located in:** `backend/database/`

---

## 🔌 API ENDPOINTS

### **Authentication**
```
POST /api/signup          - Register new user
POST /api/login           - Login (returns JWT)
```

### **Tournaments**
```
GET    /api/tournaments              - List user's tournaments
POST   /api/tournaments              - Create tournament
GET    /api/tournaments/:id          - Get tournament details
PUT    /api/tournaments/:id          - Update tournament
DELETE /api/tournaments/:id          - Delete tournament
GET    /api/tournaments/:id/matches  - Get all matches
POST   /api/tournaments/:id/matches  - Add/update match
```

### **Squads**
```
GET    /api/squads           - List all squads
POST   /api/squads           - Create squad
GET    /api/squads/:id       - Get squad details
PUT    /api/squads/:id       - Update squad
DELETE /api/squads/:id       - Delete squad (leader only)
POST   /api/squads/:id/join  - Join squad
POST   /api/squads/:id/leave - Leave squad
POST   /api/squads/:id/kick  - Kick member (leader only)
```

### **Player Profiles**
```
GET  /api/profiles/me             - Get my profile
GET  /api/profiles/:userId        - Get user profile (public)
POST /api/profiles                - Create/update profile
POST /api/profiles/achievements   - Add achievement
POST /api/profiles/clips          - Add gameplay clip
```

### **Marketplace**
```
GET  /api/marketplace/jobs                - Browse jobs
GET  /api/marketplace/jobs/:id            - Job details
POST /api/marketplace/jobs                - Post job
POST /api/marketplace/jobs/:id/apply      - Apply to job
GET  /api/marketplace/my-applications     - My applications
GET  /api/marketplace/my-jobs             - My job postings
```

### **Chat**
```
GET  /api/chat/conversations       - List DMs + Groups
GET  /api/chat/messages            - Get messages (DM or Group)
POST /api/chat/messages            - Send message
POST /api/chat/groups              - Create group
POST /api/chat/groups/:id/members  - Add member
GET  /api/chat/groups/:id/members  - List members
```

**All routes in:** `backend/server.js` (single file, ~500 lines)

---

## ⚙️ HOW IT ALL WORKS

### **1. User Flow**
```
Landing Page (/) 
  → Signup/Login (/signup, /login)
    → Dashboard (/dashboard)
      ├─→ Create Tournament (/tournaments/create)
      │   → View/Edit Tournament (/tournaments/:id)
      │     → Export with Templates (/tournaments/:id/export)
      │
      ├─→ My Profile (/profile)
      │   ├─→ Achievements (/profile/achievements)
      │   └─→ Clips (/profile/clips)
      │
      ├─→ Squads (/squads)
      │   ├─→ Create Squad (/squads/create)
      │   └─→ Squad Profile (/squads/:id)
      │
      ├─→ Marketplace (/marketplace)
      │   └─→ Job Details (upcoming)
      │
      └─→ Esports Hub (/esports)
          → All features overview
```

### **2. Authentication Flow**
```
1. User signs up → Password hashed (bcrypt)
2. User data stored in Supabase (users table)
3. Login → JWT token generated (30-day expiry)
4. Token stored in localStorage
5. Every API request includes: Authorization: Bearer <token>
6. Server validates token → Returns user data or 401/403
```

### **3. Tournament Calculation**
```
1. User creates tournament (name + game)
2. For each match:
   - Input: team_name, position, kills
   - Calculate:
     * Placement points (from POINTS object)
     * Kill points (kills × kill multiplier)
     * Total = placement + kill points
3. Store in matches table
4. Frontend calculates live standings:
   - Group matches by team_name
   - Sum all points
   - Sort by total_points DESC
5. Export:
   - Render standings to Canvas
   - Apply selected template (overlay + colors)
   - Download as PNG
```

### **4. Template System**

**Templates are defined as objects:**
```javascript
{
  id: 1,
  name: 'Template Name',
  bg: '/templates/backgrounds/bg-1.jpg',  // Background image
  overlay: 'rgba(0,20,60,0.60)',          // Color overlay (controls neon)
  accent: '#60a5fa',                       // Highlight color
  headerBg: 'rgba(10,40,120,0.75)',       // Header row background
  rowEven: 'rgba(5,25,80,0.65)',          // Even rows
  rowOdd: 'rgba(8,32,95,0.55)',           // Odd rows
  text: '#fff',                            // Text color
  sub: '#93c5fd',                          // Secondary text
  type: 'image'                            // Type (image or custom)
}
```

**Rendering process:**
1. Draw background image
2. Apply color overlay (controls visibility)
3. Draw header with headerBg
4. Draw rows alternating rowEven/rowOdd
5. Add text with accent colors
6. Export as PNG

---

## 🚀 SETUP INSTRUCTIONS

### **Prerequisites**
- Node.js 18+ installed
- Git installed
- Supabase account (free tier)

### **1. Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/tournament-calculator.git
cd tournament-calculator
```

### **2. Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values:
# SUPABASE_URL=your_supabase_project_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
# JWT_SECRET=your_random_secret_key_here
# PORT=3001
```

**Run SQL schemas in Supabase:**
1. Go to Supabase Dashboard → SQL Editor
2. Run each file in order:
   - `database/schema.sql`
   - `database/squads-schema.sql`
   - `database/player-profiles-schema.sql`
   - `database/marketplace-schema.sql`
   - `database/chat-system-schema.sql`

**Start backend:**
```bash
npm run dev
# Server runs on http://localhost:3001
```

### **3. Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

### **4. Access Application**
- Open browser: `http://localhost:3000`
- Sign up for an account
- Start using features!

---

## 🔐 ENVIRONMENT VARIABLES

### **Backend (.env)**
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# JWT Secret (generate random string)
JWT_SECRET=your-super-secret-key-min-32-chars

# Server Port
PORT=3001
NODE_ENV=development
```

### **Frontend (no .env needed)**
- All API calls hardcoded to `http://localhost:3001`
- For production, change to your deployed backend URL

---

## 🎯 FUTURE ROADMAP

### **Phase 2C: Rankings System** (PENDING)
**When:** After real tournaments are conducted
**Features:**
- Global leaderboards
- India-specific rankings
- ELO rating system
- Performance analytics
- Historical data tracking

**Why delayed:** Need real tournament data first

---

### **Phase 3A: Marketplace Completion** (IN PROGRESS)
**Status:** 40% complete (UI done, functionality pending)

**Pending Features:**
1. **Post Job Page**
   - Create job listing form
   - Job requirements builder
   - Budget/compensation selector
   - Publish to marketplace

2. **Job Detail & Apply**
   - Full job description view
   - Application form
   - Resume/profile attachment
   - Submit application

3. **My Applications Page**
   - Track application status
   - View organizer responses
   - Application history

4. **My Job Postings** (for organizers)
   - View posted jobs
   - Review applications
   - Accept/reject applicants
   - Close job listing

**Next Steps:**
- Build `/marketplace/post` page
- Build `/marketplace/jobs/[id]` detail page
- Build application submission flow
- Build `/marketplace/my-applications` page

---

### **Phase 3B: Chat System Completion** (IN PROGRESS)
**Status:** 60% complete (Backend + sidebar done, chat UI pending)

**Pending Features:**
1. **Chat UI Pages**
   - `/chat/new` - Start new conversation
   - `/chat/dm/[id]` - Direct message thread
   - `/chat/group/[id]` - Group chat thread

2. **Message Features**
   - Send/receive text messages
   - File upload & sharing
   - Link previews
   - Message timestamps
   - Read receipts
   - Typing indicators (optional)

3. **Group Features**
   - Create group chat
   - Add/remove members
   - Group admin controls
   - Group settings

**Next Steps:**
- Build chat UI components
- Implement message sending
- Add file upload to Supabase Storage
- Test real-time updates

---

### **Phase 4: Polish & Production** (PLANNED)

**4A: UI/UX Improvements**
- Loading states everywhere
- Error handling & user feedback
- Form validation messages
- Empty state designs
- Success animations

**4B: Performance**
- Image optimization
- Code splitting
- Lazy loading
- API response caching
- Database query optimization

**4C: Mobile Responsiveness**
- Test all pages on mobile
- Fix layout issues
- Touch-friendly interactions
- Mobile navigation menu

**4D: Security**
- Rate limiting on APIs
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens

---

### **Phase 5: Advanced Features** (FUTURE)

**5A: Live Streaming Integration**
- Embed YouTube/Twitch streams
- Live tournament brackets
- Real-time score updates
- Chat during live events

**5B: Sponsorship System**
- Sponsor profiles
- Sponsorship packages
- Payment integration
- Invoice generation

**5C: Content Management**
- Blog/news system
- Event calendar
- Photo galleries
- Video archives

**5D: Analytics Dashboard**
- User growth metrics
- Tournament statistics
- Popular templates
- Engagement analytics

---

## 🚢 DEPLOYMENT GUIDE

### **Backend Deployment** (Railway/Render)

**Recommended:** Railway.app (free tier)

1. Create account on Railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Configure:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
5. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `JWT_SECRET`
   - `PORT` (Railway auto-assigns)
6. Deploy!
7. Copy your backend URL (e.g., `https://your-app.railway.app`)

---

### **Frontend Deployment** (Vercel)

**Recommended:** Vercel (free tier, made for Next.js)

1. Create account on Vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework: Next.js
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Install command: `npm install`
5. NO environment variables needed
6. **IMPORTANT:** Update all `http://localhost:3001` in frontend code to your Railway backend URL
7. Deploy!
8. Get your live URL (e.g., `https://vinci-arena.vercel.app`)

---

### **Domain Setup** (Optional)

**Free Option:** Use Vercel's subdomain
**Paid Option:** Buy custom domain

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel: Settings → Domains → Add domain
3. Update DNS records as instructed
4. Done! (Takes 24-48 hours)

---

## 📞 SUPPORT & CONTINUATION

### **If Starting New Claude Chat:**

**Say this:**
```
Hi! I'm continuing work on VINCI-ARENA PRO esports platform. 
Please read PROJECT_DOCUMENTATION.md to understand the full project.

Current status: [mention what you're working on]
I need help with: [your specific question]
```

**Claude will:**
1. Read the documentation
2. Understand the full context
3. Continue from where you left off

---

### **Quick Reference Commands**
```bash
# Start Backend
cd ~/Projects/tournament-calculator/backend
npm run dev

# Start Frontend
cd ~/Projects/tournament-calculator/frontend
npm run dev

# View Git Status
git status

# Commit Changes
git add .
git commit -m "Your message"
git push

# View Database
# Go to: https://supabase.com/dashboard

# Check Logs
# Backend: Check terminal running npm run dev
# Frontend: Check browser console (F12)
```

---

## 🎨 DESIGN SYSTEM

### **Color Palette**
- **Primary:** Red (#ef4444, #dc2626) - Brand color
- **Secondary:** Purple (#a855f7) - Accents
- **Success:** Green (#22c55e)
- **Warning:** Orange (#f97316)
- **Info:** Blue (#3b82f6)

### **Typography**
- **Headings:** font-black (900 weight)
- **Body:** font-normal (400 weight)
- **Small text:** text-xs to text-sm

### **Spacing**
- **Cards:** p-6 to p-8
- **Sections:** py-12
- **Gaps:** gap-4 to gap-8

---

## 📊 PROJECT METRICS

**Development Time:** ~2 weeks  
**Total Files:** ~50  
**Lines of Code:** ~15,000  
**Database Tables:** 15  
**API Endpoints:** ~30  
**Pages:** 20+  
**Components:** 10+  

---

## ✅ COMPLETION CHECKLIST

- [x] Authentication system
- [x] Tournament calculator
- [x] 40 export templates
- [x] Squad system
- [x] Player profiles
- [x] Achievement wall
- [x] Gameplay clips
- [x] Marketplace UI
- [x] Chat system backend
- [x] Dashboard navigation
- [x] Esports Hub landing
- [ ] Marketplace functionality (40%)
- [ ] Chat UI (60%)
- [ ] Rankings system (0% - delayed)
- [ ] Mobile responsive testing
- [ ] Production deployment

---

## 🎓 LEARNING RESOURCES

If rebuilding from scratch:
- **Next.js:** https://nextjs.org/docs
- **TailwindCSS:** https://tailwindcss.com/docs
- **Supabase:** https://supabase.com/docs
- **Express.js:** https://expressjs.com/
- **JWT Auth:** https://jwt.io/introduction

---

## 🐛 KNOWN ISSUES

1. **Hydration warnings** - Browser extensions adding attributes (harmless)
2. **Template backgrounds** - Need actual images in `/public/templates/backgrounds/`
3. **Chat not real-time** - Currently polling, needs WebSocket for true real-time

---

## 📝 NOTES

- All code is **ES6+ JavaScript** (no TypeScript)
- Backend is **single file** (`server.js`) for simplicity
- **No external UI libraries** - all custom components
- Templates use **Canvas API** for image generation
- JWT tokens last **30 days**

---

**🎮 Built with ❤️ for the esports community**

**Project:** VINCI-ARENA PRO  
**Developer:** Built with Claude AI assistance  
**License:** Private (not open source)  
**Contact:** [Your contact info]

---

*End of Documentation*
