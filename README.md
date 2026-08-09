<div align="center">

# 📰 SKEW NEWS

### **AI-Powered News Analysis & Bias Explorer**

<p>
  <strong>Read the story. Understand the framing. See the data.</strong>
</p>

<p>
  A full-stack news platform that collects real articles, analyzes them with AI,
  and turns raw news content into structured insights about sentiment and political framing.
</p>

<br/>

<a href="YOUR_LIVE_DEMO_URL">
  <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Skew-111111?style=for-the-badge" alt="Live Demo"/>
</a>
<a href="YOUR_GITHUB_REPOSITORY_URL">
  <img src="https://img.shields.io/badge/💻_Source_Code-GitHub-111111?style=for-the-badge&logo=github" alt="GitHub"/>
</a>

<br/><br/>

<img src="https://img.shields.io/badge/Next.js-111111?style=flat-square&logo=nextdotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white"/>
<img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white"/>
<img src="https://img.shields.io/badge/pgvector-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white"/>
<img src="https://img.shields.io/badge/Oxylabs-23E6A8?style=flat-square"/>
<img src="https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white"/>

<br/><br/>

</div>

---

## 🎯 What is Skew?

**Skew** is an AI-powered news analysis platform built to answer a simple question:

> **“How is this story being presented?”**

Instead of treating a news article as just a headline and a block of text, Skew processes the article and exposes structured signals such as:

| Signal | What Skew provides |
|---|---|
| 📝 Summary | AI-generated article summary |
| ❤️ Sentiment | Positive / Neutral / Negative |
| ⚖️ Political framing | Left / Center / Right / Mixed / Unclear |
| 📊 Framing distribution | Left / Center / Right percentages |
| 🎯 Confidence | AI confidence score |
| 🧠 Framing notes | Explanation of the detected framing |
| 🔎 Loaded terms | Potentially emotionally charged language |
| 📰 Source | Original publication/source |

> **Important:** Political framing is an AI-generated estimate based on article content. It is not presented as objective political truth.

---

## ✨ Why I Built It

I built Skew as a practical full-stack + AI engineering project rather than a simple AI demo.

The system combines:

```text
News ingestion
      ↓
Data validation
      ↓
PostgreSQL storage
      ↓
AI analysis
      ↓
Structured results
      ↓
Vector infrastructure
      ↓
News experience
```

This gave me the opportunity to work with:

- Full-stack application architecture
- Next.js App Router
- TypeScript
- PostgreSQL database design
- AI model integration
- Structured AI output validation
- Web scraping pipelines
- Scheduled background processing
- Authentication
- Vector embeddings
- API design
- Logging and observability

---

# 🚀 Core Features

### 📰 Multi-Source News

Skew is designed to ingest articles from multiple configured publishers.

Current configured sources include:

**BBC · Fox News · NPR · Reuters · The Guardian**

Sources are managed through the database, allowing individual sources to be activated or deactivated.

---

### 🤖 AI-Powered Article Analysis

Every analyzed article can contain:

```text
Summary
Sentiment Score
Sentiment Label
Political Framing Label
Left %
Center %
Right %
Confidence
Framing Notes
Loaded Terms
Disclaimer
```

The backend also normalizes the three framing percentages so:

```text
Left % + Center % + Right % = 100%
```

---

### 📊 Transparent Bias Analysis

Skew does not simply display a label such as:

```text
"Left"
```

Instead, it exposes the underlying distribution:

```text
Left       ███████░░░  20%
Center     █████████░  60%
Right      ███████░░░  20%
```

This makes the result easier to interpret than a single opaque classification.

---

### 🧠 Semantic Search Infrastructure

The database supports vector embeddings through PostgreSQL **pgvector**.

The current schema uses:

```sql
embedding extensions.vector(1536)
```

and an HNSW index with cosine similarity.

The application also contains a database-level article matching function for comparing article embeddings.

> The vector layer is intentionally separated from the normal article metadata and AI-analysis fields so semantic retrieval can evolve independently.

---

### 🔄 Automated News Pipeline

Skew is built around a pipeline rather than manual article entry.

```text
┌─────────────────┐
│  News Sources   │
└────────┬────────┘
         ↓
┌─────────────────┐
│    Oxylabs      │
│ Scraper +       │
│ Scheduler       │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Result          │
│ Processing      │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Article         │
│ Validation      │
│ + Deduplication │
└────────┬────────┘
         ↓
┌─────────────────┐
│   Supabase      │
│   PostgreSQL    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Gemini AI       │
│ Analysis        │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Analysis +      │
│ Embedding       │
└─────────────────┘
```

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │     NEWS SOURCES    │
                         │                     │
                         │ BBC · NPR · Reuters │
                         │ Fox · Guardian      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      OXYLABS        │
                         │                     │
                         │ Web Scraper API     │
                         │ Scheduler            │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   INGESTION LAYER   │
                         │                     │
                         │ Validation          │
                         │ Cleanup             │
                         │ Deduplication       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │          SUPABASE             │
                    │                               │
                    │ PostgreSQL                    │
                    │ Sources                       │
                    │ Articles                      │
                    │ Analyses                      │
                    │ Logs                          │
                    │ Schedule Runs                 │
                    └──────────────┬────────────────┘
                                   │
                         ┌─────────┴─────────┐
                         ▼                   ▼
                ┌─────────────────┐   ┌─────────────────┐
                │  GEMINI AI      │   │ GEMINI          │
                │  ANALYSIS       │   │ EMBEDDINGS      │
                │                 │   │                 │
                │ Summary         │   │ Vector          │
                │ Sentiment       │   │ representation  │
                │ Framing         │   │                 │
                │ Confidence      │   │                 │
                └────────┬────────┘   └────────┬────────┘
                         │                     │
                         └──────────┬──────────┘
                                    ▼
                         ┌─────────────────────┐
                         │       SKEW UI       │
                         │                     │
                         │ Home                │
                         │ News Details        │
                         │ Bias Analysis       │
                         │ Source Information  │
                         └─────────────────────┘
```

---

# 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js** |
| Language | **TypeScript** |
| UI | **React + Tailwind CSS** |
| Authentication | **Clerk** |
| Database | **Supabase PostgreSQL** |
| Vector Database | **pgvector** |
| AI Analysis | **Google Gemini** |
| Embeddings | **Gemini Embedding 2** |
| Web Scraping | **Oxylabs** |
| Validation | **Zod** |
| Analytics | **PostHog** |
| AI Integration | **Vercel AI SDK** |

---

# 🗃️ Database Design

Skew uses a relational PostgreSQL schema with clear separation between ingestion, analysis, and scheduling.

### `sources`

Stores configured news publishers.

```text
id
name
listing_url
parser_strategy
active
logo_url
created_at
```

### `articles`

Stores the canonical article record.

```text
id
source_id
url
canonical_url
title
image_url
published_at
raw_text
scraped_at
analyzed_at
created_at
```

### `article_analyses`

Stores AI analysis and vector data.

```text
article_id
summary
sentiment_score
sentiment_label
bias_score
bias_label
left_percentage
center_percentage
right_percentage
confidence
framing_notes
loaded_terms
disclaimer
model
embedding
created_at
```

### `logs`

Central application and pipeline logging.

### `oxylabs_schedules`

Stores synchronized Oxylabs schedules.

### `oxylabs_schedule_runs`

Tracks Oxylabs run/job processing state.

---

# 🧠 AI Analysis Example

A structured analysis can look like:

```json
{
  "summary": "Neutral summary of the article.",
  "sentimentScore": 0.12,
  "sentimentLabel": "neutral",
  "politicalFramingLabel": "center",
  "leftPercentage": 20,
  "centerPercentage": 60,
  "rightPercentage": 20,
  "confidence": 0.78,
  "framingNotes": "Explanation based on language and framing in the article.",
  "loadedTerms": [],
  "disclaimer": "AI-estimated framing based on article text."
}
```

The backend validates and normalizes the model output before saving it to PostgreSQL.

---

# ⚙️ Analysis Pipeline

The analysis orchestrator follows a controlled flow:

```text
Get pending articles
        ↓
Split into batches
        ↓
Analyze article
        ↓
Validate AI output
        ↓
Retry failed analysis once
        ↓
Normalize percentages
        ↓
Derive bias score
        ↓
Save analysis
        ↓
Write pipeline log
```

### Batch processing

Configure the batch size with:

```env
ANALYSIS_BATCH_SIZE=5
```

For example:

```text
67 pending articles
       ↓
5 articles / batch
       ↓
14 batches
```

The batch size controls how many articles are handled together by the analysis orchestrator.

---

# 🔌 API Endpoints

### Analyze articles

```http
POST /api/analyze
```

Example PowerShell request:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/analyze" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{"x-SKEW-admin-secret"="YOUR_ADMIN_SECRET"} `
  -Body '{}'
```

---

### Synchronize Oxylabs schedules

```http
POST /api/oxylabs/schedules
```

Example:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/oxylabs/schedules" `
  -Method POST `
  -Headers @{"x-SKEW-admin-secret"="YOUR_ADMIN_SECRET"}
```

---

### List schedules

```http
GET /api/oxylabs/schedules
```

---

### Process scheduled results

```http
POST /api/oxylabs/scheduled-results/process
```

---

# 📁 Project Structure

```text
skew-news/
│
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   ├── cron/
│   │   ├── oxylabs/
│   │   │   ├── runs/
│   │   │   ├── scheduled-results/
│   │   │   └── schedules/
│   │   └── scrape/
│   │
│   ├── news/
│   ├── sign-in/
│   └── sign-up/
│
├── components/
│
├── lib/
│   ├── ai/
│   ├── pipeline/
│   ├── scraping/
│   ├── supabase/
│   └── api/
│
├── public/
│
├── supabase/
│   ├── schema.sql
│   └── seed.sql
│
├── .env.example
├── AGENTS.md
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd skew-news
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create `.env.local`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OXY_WSA_USERNAME=
OXY_WSA_PASSWORD=

SKEW_ADMIN_SECRET=

GEMINI_API_KEY=

ANALYSIS_BATCH_SIZE=5

CRON_SECRET=
```

## 4. Configure Supabase

Open the Supabase SQL Editor and run:

```text
supabase/schema.sql
```

Then, if included:

```text
supabase/seed.sql
```

## 5. Start the application

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# 🔐 Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public/client key |
| `CLERK_SECRET_KEY` | Clerk server authentication |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side database access |
| `OXY_WSA_USERNAME` | Oxylabs username |
| `OXY_WSA_PASSWORD` | Oxylabs password |
| `SKEW_ADMIN_SECRET` | Admin API authentication |
| `GEMINI_API_KEY` | Gemini API authentication |
| `ANALYSIS_BATCH_SIZE` | Analysis batch size |
| `CRON_SECRET` | Cron endpoint authentication |

---

# 🔒 Security

**Never commit secrets to GitHub.**

Do not commit:

```text
.env
.env.local
API keys
Supabase service-role keys
Oxylabs credentials
Clerk secret keys
Admin secrets
Cron secrets
```

Use `.env.example` with empty placeholders instead.

If a secret has ever been pushed to a public repository, **rotate it immediately**. Simply deleting the file later is not enough.

---

# 📈 Future Improvements

The architecture leaves room for several extensions:

- Personalized news recommendations
- User-specific reading preferences
- Article clustering
- Improved semantic retrieval
- More news sources
- Bias-analysis evaluation datasets
- AI quality benchmarking
- Advanced analytics dashboards
- Better background-job monitoring
- More sophisticated recommendation ranking

---

# 👨‍💻 Author

<div align="center">

## **Rahul Debnath**

**Full-Stack Developer · AI Engineering · Problem Solving**

Building practical applications at the intersection of  
**software engineering, AI, and data-driven systems.**

</div>

---

# 📜 Attribution

This repository is a **customized and extended implementation** based on the codebase that I originally used as a starting point.

The implementation in this repository includes my own configuration, database setup, AI integration, Gemini-based analysis workflow, vector infrastructure, automated ingestion pipeline, API integration, and application-level modifications.

If the original project license requires attribution, the original license and required notices should remain in the repository.

---

<div align="center">

### ⭐ If you find the project interesting, consider starring the repository.

**Built with Next.js · TypeScript · Supabase · Gemini · pgvector · Oxylabs**

</div>
