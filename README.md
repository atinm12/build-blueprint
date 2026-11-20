# Build Blueprint

**Find a hackathon idea backed by real evidence.**

Build Blueprint pulls clearly stated, evidence-backed problems out of academic research and news and organizes them by industry. Beginner hackathon teams can browse validated problems to get ideas fast, or paste in their own idea to see if real studies back it up.

## Features

| Feature | What it does |
| --- | --- |
| **Problem Library by Industry** | 40 curated problems across 8 industries (healthcare, education, climate, finance, food, mental health, accessibility, housing & cities). Each one cites real studies or reports. |
| **Idea Validator** | Paste an idea. The app pulls out keywords, searches 250M+ research papers (OpenAlex) and recent news, scores how relevant each result is, and says whether it found strong, some, or no evidence. It also links to similar problems in the library. |
| **Hackathon Track Filter** | Pick your track (AI/ML, Sustainability, Fintech, Health Tech, EdTech, Social Impact, Accessibility, Hardware/IoT) to see only problems that fit. |
| **Summarizer / Evidence cards** | Each problem has a plain-language summary, key stats with their sources, links to the originals, existing products, past hackathon projects on Devpost, and live research + news. |
| **Team shortlist** | Save problems, share a link so teammates can vote, pick one, and export a pitch slide (PNG) or copy the slide text with sources. No accounts needed. |

## Screens

1. **Home**: idea search bar, track filter, industry grid
2. **Problem Library + Filters**: problem list with source counts, track tags, keyword filter
3. **Problem Summary**: summary, key stats, sources, live research and news, existing solutions, build ideas
4. **Idea Validator Results**: verdict, matching studies with short summaries, news, similar library problems
5. **Shortlist**: voting, share link, team pick, pitch slide export

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

```bash
npm run build   # production build in dist/ (static, works on any host incl. GitHub Pages)
```

### Optional: OpenAlex API key

Live research search uses [OpenAlex](https://openalex.org), which is free. Without a key, each network shares a small daily search budget (roughly 100 searches). For more, get a free key at https://openalex.org/settings/api, then:

```bash
cp .env.example .env
# put your key in VITE_OPENALEX_API_KEY
```

## How it works

- **No backend.** The app is a static React site. All data is either bundled (curated problems) or fetched straight from free public APIs in the browser.
- **Curated problems:** `src/data/problems.ts`. Every stat points to a source. DOIs were checked against Crossref.
- **Research:** OpenAlex `/works` search, filtered to papers from 2012 on that have abstracts. Abstracts are rebuilt and trimmed to 1–2 sentence summaries.
- **News:** GDELT (global news, rate-limited to 1 request per 5 seconds per IP) runs in parallel with a Hacker News search fallback. Each section also links to Google News.
- **Validator scoring:** `src/lib/match.ts`. Keywords are ranked by how often they show up in real problem statements. A paper or headline only counts if it mentions enough of the idea's keywords.
- **Shortlist and votes** live in `localStorage`. The share link encodes the shortlist and votes in the URL, and opening a teammate's link merges their votes.
- **Success metrics (from the PRD):** the shortlist shows how long the team took from first visit to picking an idea.

## Tech

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router (hash routing) · html-to-image · lucide-react

## Adding a problem

Add an entry to `PROBLEMS` in `src/data/problems.ts`, with at least one real source and stats that point to it by index. Pick an `industry` and `tracks` from `src/data/taxonomy.ts`.

> Build Blueprint summarizes research to help you get started. Always read the original source before you cite it in a pitch.
