# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Deffi69/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Deffi69/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

**Bounty:** [Build the best GTA 6 trophy guide — $250 — make.fun](https://make.fun/bounty/gta6-trophy-guide-01)

An unofficial, fully offline guide and tracker for all **55 PlayStation 5 trophies** in Grand Theft Auto VI (1 Platinum, 2 Gold, 6 Silver, 46 Bronze — 28 hidden, 0 online).

## What it does

- **Every trophy, verified** — official names, descriptions and grades exactly as PlayStation publishes them, checked against the PSN list as collected by PSNProfiles / TrueAchievements (see [SOURCES.md](SOURCES.md)).
- **A real guide for each trophy, in our own words** — what to do, where and how, and when it can be missed. Every guide names its source beside it; a source is cited, never copied.
- **Roadmap to the Platinum** — 5 stages in play order, with per-stage progress. Roughly 200 hours all in, per the early guides.
- **Missable flag** — only one trophy is flagged as possibly missable: **Positive Mental Attitude** (Lucia's Chapter 1 balcony meditation, gone when the chapter ends). The guide explains the chapter-save habit that protects you, since the game has no mission replay.
- **Tracker** — tick trophies off; progress is saved in your browser (localStorage), exportable to a JSON file and importable back.
- **Filters** — by kind (story, missable, collectibles, activities, robberies, exploration, combat, stranger missions, completion, online), by grade, by earned/remaining, plus search. The online filter truthfully shows nothing: the game lists no online trophies.
- **Spoiler setting** — on by default, story trophy names and descriptions stay hidden until you earn them.
- **Offline** — static files under `app/`, no build step, no network requests at run time. Serve with any static server (`node serve.ts` serves `app/` on http://localhost:8080) and open `app/index.html`.

## Run it

```sh
node serve.ts            # http://localhost:8080
# or: python3 -m http.server --directory app
```

## Layout

- `main.ts` — hands the entry in: copies `app/` + `screenshots/` to the output dir and writes `dossier.json` via `vendor/makefun-frontend.ts` (vendored from the kit, unmodified).
- `app/` — `index.html`, `app.js`, `style.css`, `data/trophies.json` (all 55 trophies + guides + sources).
- `screenshots/` — 4 real renders of the running app (see `shots.json` for the views).
- `SOURCES.md` — research notes and every source used.

## Disclaimer

Unofficial fan project. Not affiliated with, endorsed by, or connected to Rockstar Games, Take-Two Interactive, Sony Interactive Entertainment, or PlayStation. Grand Theft Auto and GTA are trademarks of Take-Two Interactive. No official artwork, logos, or game screenshots are used; the design is our own.
