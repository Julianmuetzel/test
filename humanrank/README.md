# HumanRank

Eine moderne Mobile-First Web-App zum Testen und weltweiten Vergleich menschlicher Fähigkeiten.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma v5** + PostgreSQL
- **NextAuth v4** (JWT)
- **Recharts** (Statistiken)

## Features

### 6 Tests
| Test | Einheit |
|------|---------|
| Reaktionszeit | ms (niedriger = besser) |
| Gedächtnis | Level |
| Tippgeschwindigkeit | WPM |
| Kopfrechnen | Richtig/60s |
| Logiktest | % |
| Allgemeinwissen | % |

### Rankings
- Perzentilranking: "Besser als 83% aller Nutzer"
- Globaler Human Score (gewichteter Durchschnitt)

### Gamification
- XP + Level System
- Streak (3/7/30/100 Tage)
- Badges (Top 50%/25%/10%/1%)

## Setup

```bash
npm install
cp .env.example .env.local
# DATABASE_URL und NEXTAUTH_SECRET setzen
npm run db:push
npm run db:seed
npm run dev
```

Demo-Account: `demo@humanrank.app` / `demo1234`

## Deployment (Vercel + Supabase)

1. Supabase-Projekt erstellen, Connection URL kopieren
2. `npx vercel` und Env-Vars setzen
3. `DATABASE_URL="..." npm run db:push && npm run db:seed`

## Human Score Algorithmus

```
Human Score = gewichteter Durchschnitt der Perzentilränge

Gewichte:
  Reaktion:    20%  |  Gedächtnis: 20%
  Kopfrechnen: 20%  |  Tippen:     15%
  Logik:       15%  |  Wissen:     10%
```
