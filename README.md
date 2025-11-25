# TicketTribe – Daily Stock Prediction Platform

<div align="center">
<img src="public/logo.svg" width="120" alt="TickerTribe Logo" />

### Predict. Compete. Climb the Leaderboard.

[![Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle%20ORM-green)](https://orm.drizzle.team/)
[![Neon](https://img.shields.io/badge/Database-Neon%20Serverless-orange)](https://neon.tech/)
[![Auth](https://img.shields.io/badge/Auth-BetterAuth-red)](https://www.better-auth.com/)
[![API](https://img.shields.io/badge/Stock%20Data-Yahoo%20Finance-lightgrey)]()
[![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com/)


</div>

---

## Overview

TicketTribe is a structured stock‑prediction platform where groups of users compete by predicting the daily movement of selected technology stocks. Predictions lock at 7:00 PM IST, scoring takes place after the US markets close, and leaderboards update automatically. The platform includes authentication, tribes (groups), automated scoring, and a responsive dashboard.

---

## Key Features

### Daily Stock Predictions

* Users make daily "higher" or "lower" predictions for selected stocks.
* Predictions are editable until the 7 PM IST lock.
* Predictions remain hidden until locking is complete.

### Prediction Locking

* Automated locking at 7 PM IST.
* Captures reference market prices at the time of lock.
* Unlocks viewability for tribe members once locked.

### Automated Scoring

* Executes after the US market close (approximately 2:30 AM IST).
* Retrieves closing prices from Yahoo Finance.
* Scoring rules: +1 for correct, -1 for incorrect, 0 for missing predictions.
* Leaderboards update automatically.

### Tribe System

* Users may create or join a private tribe using a generated code.
* Each user can be part of one tribe at a time.
* Tribes maintain their own cumulative and daily leaderboards.

### Leaderboards

* Tribe‑specific leaderboards.
* Automatically updated after scoring.
* Displays cumulative performance rankings.

### Interface

* Fully responsive design.
* Includes a dashboard, sidebar navigation, prediction cards, and results views.

---

## Technology Stack

### Frontend

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS
* ShadCN UI
* Sonner for notifications

### Backend and Database

* Vercel Serverless Functions (API routes)
* Drizzle ORM
* Neon Serverless PostgreSQL
* BetterAuth for authentication (email/password + Google OAuth)

### Stock Data

* Yahoo Finance API

---

## Core System Workflows

### 1. Prediction Workflow

* Users submit predictions each day.
* Data is stored in the database against a prediction record for that day.
* Predictions remain editable until lock time.

### 2. Lock Workflow (7 PM IST)

* All open predictions are locked.
* Reference prices are stored at lock time.
* Predictions become visible to tribe members.

### 3. Scoring Workflow (US Market Close)

* Closing prices are retrieved.
* Scores are computed based on prediction accuracy.
* Leaderboards and cumulative scores update.
* A fresh prediction entry is generated for the next day.

---

## Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/AppajiDheeraj/ticket_tribe
cd ticket_tribe
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file and include:

```env
DATABASE_URL=your_neon_connection_string

BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Development Server

```bash
npm run dev
```

---

## Deployment Notes and Resolved Issues

### Vercel Build Failure (ENOENT: page_client-reference-manifest.js)

**Cause:** Legacy configuration and build tracing conflicts in Next.js 15.

**Fixes:**

* Removed deprecated `outputFileTracingIncludes`.
* Migrated to the correct `serverExternalPackages` configuration.
* Ensured no pages referenced removed or relocated client‑manifest files.

### Serverless Function Size Exceeded

**Cause:** Unnecessary dependency inclusion during build.

**Fixes:**

* Cleaned unused imports.
* Reduced icon and helper library bundles where possible.

### Google OAuth “Invalid Origin”

**Cause:** Production redirect URI was not added to Google Cloud Console.

**Fix:** Added the exact production callback:

```
https://ticket-tribe-flax.vercel.app/api/auth/callback/google
```

### Redirect Conflicts and Session Handling

**Cause:** Root route redirect and layout‑level session validation conflicts.

**Fix:** Cleaned redirect rules and placed session checks inside layouts.

---

## Planned Enhancements

* Weekly streak tracking
* Additional competitive metrics
* Analytics for tribe performance
* Global leaderboard
* Notification system for locks and results

---

<div align="center">
TicketTribe – A structured, competitive approach to tracking market intuition.
</div>

