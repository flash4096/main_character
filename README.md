# Main Character – Memento Mori

> *"You could leave life right now. Let that determine what you do and say and think."* — Marcus Aurelius

**Main Character – Memento Mori** is a production-ready application engineered to remind users that life is finite. It transforms time from an abstract concept into an urgent, precious reality—making every second feel valuable.

Designed with an ultra-minimalist aesthetic inspired by **Apple, Linear, and Vercel**: pure black background, bold typography, generous whitespace, smooth animations, and zero clutter.

---

## ✦ Key Features

1. **Life Countdown (Hero)**
   - Massive real-time numerical display showing remaining seconds until estimated death.
   - Updates every second with smooth layout animation.
   - Displays *"Every new day is a gift."* if estimated remaining time reaches zero or negative.

2. **Current Age Breakdown**
   - Precise live calculation of current age split into Years, Months, Days, Hours, Minutes, and Seconds.

3. **Expected Remaining Life**
   - Calculates remaining years, months, and total days based on average life expectancy (default 73 years) or custom user target.

4. **Temporal Progress Milestones**
   - Animated linear progress bars tracking completion percentages for:
     - **Year Progress**: Current year completion %
     - **Month Progress**: Current month completion %
     - **Day Progress**: Current day completion % (updated every minute)

5. **Daily Memento Mori Question**
   - 100 high-quality existential questions seeded in the database.
   - Deterministically cycles every day to present one deep question for reflection.

6. **Daily Wisdom Quote**
   - 100 curated quotes from Marcus Aurelius, Seneca, Epictetus, Nietzsche, Naval Ravikant, Steve Jobs, Viktor Frankl, and more.

7. **User Personalization & Auth**
   - Register and login to customize birth date and expected life expectancy.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS (Custom minimalist dark theme)
- **Animations**: Framer Motion
- **Data Fetching**: TanStack React Query
- **Icons**: Lucide React
- **Authentication**: Supabase Auth / JWT Integration

### Backend
- **Framework**: FastAPI
- **ORM**: SQLAlchemy 2.0 (Async Engine with asyncpg)
- **Validation**: Pydantic v2
- **Database Migrations**: Alembic
- **Database**: PostgreSQL (Supabase Compatible)

### Deployment & Infrastructure
- **Containerization**: Docker & Docker Compose

---

## 📁 Monorepo Structure

```
main-character/
├── frontend/                 # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/              # Routes: dashboard, login, register, profile
│   │   ├── components/       # CountdownHero, CurrentAge, ProgressSection, etc.
│   │   ├── lib/              # API client, utilities, Supabase helper
│   │   └── types/            # TypeScript interfaces
│   ├── Dockerfile
│   ├── package.json
│   └── tailwind.config.ts
├── backend/                  # FastAPI Async Backend
│   ├── app/
│   │   ├── api/              # v1 API Endpoints (auth, dashboard, profile, memento)
│   │   ├── core/             # Config, Security, Database
│   │   ├── db/               # Seeding script (100 quotes & 100 questions)
│   │   ├── models/           # SQLAlchemy models (User, Question, Quote)
│   │   ├── schemas/          # Pydantic v2 schemas
│   │   └── services/         # Time & Life calculation engine
│   ├── alembic/              # Database migration scripts
│   ├── Dockerfile
│   └── requirements.txt
├── supabase/
│   ├── migrations/           # Initial SQL schema
│   └── seed.sql              # 100 Questions & 100 Quotes SQL seed file
├── docker-compose.yml        # Multi-container orchestrator (Frontend + Backend + DB)
├── .env.example              # Environment variables template
└── README.md                 # Documentation
```

---

## 🚀 Quick Start with Docker Compose

Run the full monorepo stack with a single command:

```bash
docker-compose up --build
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ⚡ Local Development Setup

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run migrations and auto-seed database
python -m app.main
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🛡 License

MIT License. Designed with reverence for time.
