Skew News

<div align="center">

AI-Powered News Analysis & Bias Explorer

A full-stack news platform that collects articles from multiple sources, analyzes sentiment and political framing with AI, and presents the results through a transparent news-reading experience.

</div>

Overview

Skew News is a full-stack AI-powered news analysis application.

The platform collects articles from configured news sources, stores them in Supabase, analyzes article content with Google Gemini, and presents:

AI-generated summaries

Sentiment classification

Political framing estimates

Left / Center / Right framing percentages

Confidence scores

Framing notes

Loaded or emotionally charged terms

Source-level bias distribution

Political framing is presented as an AI estimate based on article text, not as objective truth.

The application also includes an automated scraping and processing pipeline using Oxylabs Scheduler, Supabase PostgreSQL, pgvector, and scheduled backend processing.

Why I Built This

I built this project to combine modern full-stack engineering with practical AI engineering:

Next.js and TypeScript

AI integration with structured output

News scraping and ingestion

PostgreSQL database design

Vector embeddings and semantic search infrastructure

Authentication

Automated background pipelines

API design

Logging and observability

The goal is an end-to-end system that can collect → process → analyze → store → present news data automatically.

Tech Stack

Frontend

Next.js

React

TypeScript

Tailwind CSS

Backend & Data

Supabase / PostgreSQL

pgvector

Clerk

Oxylabs

AI

Google Gemini

Gemini Embedding 2

Vercel AI SDK

Zod

Analytics

PostHog

Architecture

News Sources
     |
     v
Oxylabs Scheduler / Scraper
     |
     v
Scrape Processing
(validation / cleanup / dedupe)
     |
     v
Supabase PostgreSQL
     |
     v
Gemini AI Analysis
     |
     +---- Summary
     +---- Sentiment
     +---- Political framing
     +---- Confidence
     |
     v
Gemini Embedding 2
     |
     v
pgvector
     |
     v
Skew News UI

Features

Multi-Source News Collection

Configured sources include:

BBC

Fox News

NPR

Reuters

The Guardian

Sources are stored in PostgreSQL and can be activated or deactivated.

AI News Analysis

Each article can be analyzed for:

Neutral summary

Sentiment score

Sentiment label

Political framing label

Left percentage

Center percentage

Right percentage

Confidence

Framing notes

Loaded terms

The framing percentages are normalized so that:

Left + Center + Right = 100%

Bias Transparency

The application does not treat AI classification as absolute truth. Political framing is explicitly presented as an AI-estimated interpretation of the article text.

Authentication

Clerk provides:

Sign in

Sign up

User authentication

Protected routes

Vector Search Infrastructure

The database supports vector embeddings through PostgreSQL pgvector.

The current configuration uses:

embedding extensions.vector(1536)

with an HNSW cosine-similarity index.

Embeddings are generated using Gemini Embedding 2.

Automated Processing

The ingestion architecture is:

Oxylabs Scheduler
       |
       v
Scheduled scrape
       |
       v
Oxylabs result
       |
       v
Result processing
       |
       v
Article validation / dedupe
       |
       v
Supabase
       |
       v
Gemini analysis
       |
       v
Analysis stored

AI Analysis

The AI layer uses structured output rather than relying on unvalidated free-form text.

A typical analysis contains:

{
  "summary": "Neutral article summary",
  "sentimentScore": 0.12,
  "sentimentLabel": "neutral",
  "politicalFramingLabel": "center",
  "leftPercentage": 20,
  "centerPercentage": 60,
  "rightPercentage": 20,
  "confidence": 0.78,
  "framingNotes": "Explanation based on article text",
  "loadedTerms": [],
  "disclaimer": "AI-estimated framing based on article text."
}

Analysis rules

The analysis layer is designed to:

Use article text as evidence.

Avoid assigning framing simply because of the publication source.

Produce neutral summaries.

Identify loaded language actually present in the article.

Produce a complete 100% framing split.

Reduce confidence when evidence is weak or ambiguous.

Automated News Pipeline

1. Schedule Synchronization

Active sources are synchronized with Oxylabs.

POST /api/oxylabs/schedules

One schedule is created for each active source.

2. Scheduled Result Processing

Completed Oxylabs jobs are retrieved and processed.

POST /api/oxylabs/scheduled-results/process

Only completed jobs are processed.

3. Article Ingestion

The ingestion pipeline:

Extracts article information

Validates required fields

Cleans article content

Checks duplicate URLs

Saves valid articles to Supabase

4. AI Analysis

Pending articles are sent to Gemini.

The analysis pipeline processes articles in batches.

ANALYSIS_BATCH_SIZE=5

This means the analysis pipeline processes up to five articles per batch.

5. Logging

Pipeline activity is written to the logs table and server logs.

Database

The main PostgreSQL tables are:

Table

Purpose

sources

Configured news sources

articles

Scraped article data

article_analyses

AI analysis and embeddings

logs

Pipeline/application logs

oxylabs_schedules

Stored Oxylabs schedules

oxylabs_schedule_runs

Oxylabs execution history

Vector configuration

create extension if not exists vector
with schema extensions;

The analysis table contains:

embedding extensions.vector(1536)

and an HNSW cosine-similarity index.

Project Structure

skew-news/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   ├── cron/
│   │   ├── oxylabs/
│   │   └── scrape/
│   ├── news/
│   ├── sign-in/
│   └── sign-up/
│
├── components/
├── lib/
│   ├── ai/
│   ├── pipeline/
│   ├── scraping/
│   ├── supabase/
│   └── api/
│
├── public/
├── supabase/
│   ├── schema.sql
│   └── seed.sql
│
├── .env.example
├── AGENTS.md
├── package.json
└── README.md

Quick Start

Prerequisites

Install:

Git

Node.js

npm

Clone

git clone YOUR_GITHUB_REPOSITORY_URL
cd skew-news

Install dependencies

npm install

Environment variables

Create:

.env.local

Add:

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

Never commit .env.local or API keys.

Supabase setup

Open the Supabase SQL Editor and execute the project's schema.

The schema creates the required tables, pgvector configuration, vector column, HNSW index, constraints, indexes, matching function, and RLS configuration.

If the project contains a seed file, execute:

supabase/seed.sql

Run locally

npm run dev

Open:

http://localhost:3000

Manual API Testing

Run article analysis

PowerShell:

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/analyze" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{"x-SKEW-admin-secret"="YOUR_ADMIN_SECRET"} `
  -Body '{}'

Synchronize Oxylabs schedules

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/oxylabs/schedules" `
  -Method POST `
  -Headers @{"x-SKEW-admin-secret"="YOUR_ADMIN_SECRET"}

List stored schedules

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/oxylabs/schedules" `
  -Method GET

Process completed Oxylabs results

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/oxylabs/scheduled-results/process" `
  -Method POST `
  -Headers @{"x-SKEW-admin-secret"="YOUR_ADMIN_SECRET"}

Environment Variables

Variable

Purpose

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

Clerk frontend key

CLERK_SECRET_KEY

Clerk server authentication

NEXT_PUBLIC_SUPABASE_URL

Supabase project URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

Supabase public key

SUPABASE_SERVICE_ROLE_KEY

Server-side Supabase access

OXY_WSA_USERNAME

Oxylabs account username

OXY_WSA_PASSWORD

Oxylabs account password

SKEW_ADMIN_SECRET

Admin API protection

GEMINI_API_KEY

Gemini API authentication

ANALYSIS_BATCH_SIZE

Articles processed per analysis batch

CRON_SECRET

Cron endpoint protection

Deployment

Before deploying:

Configure production environment variables.

Configure the Supabase production database.

Configure Oxylabs credentials.

Configure Gemini API access.

Configure the production cron mechanism.

Keep server-side credentials out of client-side code.

Security

Never commit:

.env.local
.env
API keys
Supabase service-role keys
Oxylabs credentials
Clerk secret keys
Admin secrets
Cron secrets

If a secret is accidentally pushed to GitHub, rotate it immediately. Removing the secret from the latest commit does not make an exposed credential safe.

Future Improvements

Personalized news recommendations

More robust source comparison

User-specific reading preferences

Improved article clustering

Advanced semantic search

Bias-analysis evaluation datasets

AI analysis quality benchmarking

Additional news sources

Advanced analytics dashboards

Improved background-job observability

Author

Rahul Debnath

Full-Stack Developer | AI Engineering | Problem Solving

This repository represents my customized implementation and engineering work on the Skew News application, including the AI integration, Gemini-based analysis, vector database configuration, automated ingestion pipeline, database setup, and application development.

Attribution & License

This repository has been customized and extended from the project/codebase that I originally used as a starting point.

If the original repository's license requires attribution, retain the original license and attribution notices in this repository. The sections of this repository that I independently modified or added represent my own engineering work.

