# 🎬 Movie Explorer

A responsive, component-based movie browsing app built with **React**,
**Vite**, and **Tailwind CSS**, powered by [The Movie Database (TMDB)](https://www.themoviedb.org/)
API. All TMDB requests go through a small server-side proxy, so the API key
never ships to the browser and the app keeps working even on networks that
block TMDB's API domain directly.

## Features

- 🔥 Browse **Popular**, **Trending**, and **Top Rated** movies
- 🎭 Filter results by genre
- 🔍 Debounced live search (400ms) with a clear button
- 🪟 Click a card to open a detail modal (overview, runtime, tagline, genres)
- 📄 "Load more" pagination
- 💀 Skeleton loading placeholders — the UI never appears blank while fetching
- ⚠️ Friendly error states with a retry button (handles network failures,
  invalid API key, rate limiting, and TMDB outages)
- 🗂️ Empty state when a search returns no results
- 📱 Fully responsive grid — 2 columns on mobile up to 6 columns on large screens
- ♿ Accessible markup: semantic HTML, `aria-label`s, keyboard-focusable
  controls, `Escape`-to-close modal
- 🔒 Server-side API proxy — TMDB key never reaches the client bundle
- 🚀 Request cancellation (`AbortController`) to avoid race conditions
  between fast, successive requests (typing quickly while searching, etc.)

## Tech Stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first `@theme` config)
- Plain JavaScript (ES6+) — no TypeScript
- Fetch API for HTTP requests
- A Vercel Serverless Function as a thin TMDB proxy
- [TMDB API](https://developer.themoviedb.org/docs) as the data source

## Folder Structure

```
api/
└── tmdb.js              # Vercel Serverless Function — proxies all TMDB calls

src/
├── components/
│   ├── NavBar.jsx          # Fixed top navigation bar
│   ├── SearchBar.jsx       # Debounced search input with clear button
│   ├── CategoryTabs.jsx    # Popular / Trending / Top Rated tabs
│   ├── GenreFilter.jsx     # Horizontally scrollable genre pill filter
│   ├── GenreBadge.jsx      # Small genre pill used inside MovieModal
│   ├── MovieGrid.jsx       # Responsive grid + skeleton loading
│   ├── MovieCard.jsx       # Poster, title, year, rating, overview
│   ├── MovieModal.jsx      # Full detail view, opened on card click
│   ├── SkeletonCard.jsx    # Animated placeholder card
│   ├── LoadMoreButton.jsx  # Pagination control
│   ├── ErrorState.jsx      # Error message + retry button
│   └── EmptyState.jsx      # "No results" state
│
├── hooks/
│   ├── useMovies.js        # Core data-fetching hook (search/category/genre/pagination)
│   ├── useGenres.js        # Loads the TMDB genre list once
│   └── useDebounce.js      # Generic debounce hook
│
├── utils/
│   └── api.js              # TMDB service layer — calls the /api/tmdb proxy
│
├── pages/
│   └── Home.jsx            # Composes everything into the main page
│
├── App.jsx
├── main.jsx
└── index.css                # Tailwind import + design tokens + component classes

vite.config.js            # Includes a dev-only middleware that mirrors api/tmdb.js
                           # locally, so `npm run dev` behaves like production
```

## Why there's a server-side proxy

TMDB's API domain (`api.themoviedb.org`) is, as of this writing, blocked at
the ISP/DNS level for a meaningful number of users in India (Jio and Airtel
come up most often in TMDB's own support forum). Calling TMDB directly from
the browser means *the visitor's* network decides whether the app works —
not yours.

This project avoids that entirely:

- The browser calls `/api/tmdb?path=...` (same origin as the app)
- `api/tmdb.js` — a Vercel Serverless Function — makes the actual TMDB
  request from Vercel's infrastructure, which isn't on that blocklist, and
  returns the JSON back to the browser
- `vite.config.js` adds a matching dev middleware so the exact same flow
  works locally with `npm run dev`, instead of only working once deployed
- As a side benefit, the TMDB API key is read only on the server side and
  never appears in the public JS bundle

> **Note on images:** movie posters are loaded directly from
> `image.tmdb.org` in the browser. If a visitor's network blocks that CDN
> the same way it blocks the API domain, posters may not load for them even
> though search/browsing still works (since that part goes through the
> proxy). This is a known, separately-reported issue and can be closed by
> adding an `/api/image` proxy route following the same pattern as
> `api/tmdb.js`, if full resilience is needed.

## Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd movie-explorer
npm install
```

### 2. Get a TMDB API key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup)
2. Go to **Settings → API** and request a free API key (v3 auth)

### 3. Configure environment variables

```bash
cp .env.example .env
```

```
# No VITE_ prefix — this key must stay server-side only.
TMDB_API_KEY=your_tmdb_api_key_here
```

> If you ever paste your key into a chat, doc, or commit by mistake,
> regenerate it from your TMDB account (Settings → API) — it only takes a
> few seconds and avoids leaving a live key floating around.

### 4. Run locally

```bash
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`). The
`/api/tmdb` route is served by the Vite dev middleware in `vite.config.js`,
so everything works the same as it will on Vercel.

**If TMDB requests time out locally:** this is most likely the India
ISP-level TMDB block mentioned above, not a code issue. Try switching your
machine's DNS to `8.8.8.8` / `8.8.4.4` (Google) or `1.1.1.1` / `1.0.0.1`
(Cloudflare), flush your DNS cache, and retry. If that doesn't help, a VPN
or Cloudflare WARP will — or just deploy and test the live Vercel URL
instead, since the block doesn't apply there.

### 5. Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Architecture Decisions

**State management — Hooks only, no external library.** All data-fetching
state (movies, loading, error, pagination, active category/genre, search
query) lives in the `useMovies` custom hook. This keeps `Home.jsx` purely
presentational and makes the fetching logic reusable/testable in isolation
— appropriate for an app of this size, where Redux/Zustand would be
over-engineering.

**Fetch priority.** `useMovies` decides what to display as: **search
query** (if non-empty) → **genre filter** (if selected) → **category tab**
(Popular/Trending/Top Rated). Changing any of these resets pagination to
page 1 and cancels any in-flight request via `AbortController`, so a slow
older response can't overwrite a newer one.

**API layer separation.** `utils/api.js` is the only client-side file that
knows about TMDB's endpoint shapes. Every component calls small,
intention-revealing functions (`fetchPopular`, `searchMovies`,
`fetchByGenre`, `fetchGenres`, `fetchMovieDetails`, `posterUrl`) that all
route through the `/api/tmdb` proxy — swapping data sources later only
touches this one file.

**Server-side proxy (`api/tmdb.js` + dev middleware).** Covered above —
keeps the API key off the client and decouples the app's reliability from
any individual visitor's network/ISP.

**Debounced search.** `useDebounce` delays the *fetch* by 400ms after the
user stops typing, while the input itself still updates instantly, so
typing feels responsive without firing a request on every keystroke.

**Tailwind v4 CSS-first theme.** Custom design tokens (`brand-*`,
`surface-*` color scales) are declared with `@theme` directly in
`index.css`, matching Tailwind v4's recommended setup with
`@tailwindcss/vite` — no separate `tailwind.config.js` needed.

## Responsive Strategy

The movie grid uses Tailwind's responsive grid utilities:

| Breakpoint | Width    | Columns |
|------------|----------|---------|
| default    | < 640px  | 2       |
| `sm`       | ≥ 640px  | 3       |
| `md`       | ≥ 768px  | 4       |
| `lg`       | ≥ 1024px | 5       |
| `xl`       | ≥ 1280px | 6       |

All other UI elements (navbar, search bar, filters, footer) sit in a
`max-w-7xl mx-auto` container with responsive padding, so the layout never
feels cramped on mobile or overly stretched on large monitors. Description
text on movie cards is hidden below `sm` to keep cards compact on phones.

## Error & Loading Handling

- **Loading:** skeleton cards matching the real card's layout render during
  the initial fetch of a new list, and append at the end of the grid while
  "Load more" is in flight.
- **Errors:** any thrown error (network failure, non-2xx response, missing
  API key, rate limiting, TMDB unreachable) renders a friendly `ErrorState`
  with a **Try again** button that re-runs the last request.
- **Empty results:** a successful response with zero results renders
  `EmptyState`, distinct from the error state.

## Future Improvements

- Proxy images through `/api/image` for full resilience against
  CDN-level network blocks, not just the API domain
- Persist search/filter state in the URL (shareable links, browser back/forward)
- Watchlist / favorites using `localStorage`
- Infinite scroll as an alternative to "Load more"
- Unit tests (Vitest + React Testing Library) for hooks and components
- Dark/light theme toggle

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
   Framework preset: **Vite** (auto-detected). Vercel will also
   auto-detect `api/tmdb.js` and deploy it as a serverless function — no
   extra config needed.
3. In **Project Settings → Environment Variables**, add:
   - `TMDB_API_KEY` = your TMDB key (no `VITE_` prefix)
4. Deploy.
5. Test the live URL — ideally from a network other than the one you
   developed on (e.g. mobile data instead of home Wi-Fi), as a quick sanity
   check that it works independent of any one network's quirks.

| | |
|---|---|
| **Live URL** | _add after deploying_ |
| **GitHub repo** | _add your repo URL_ |

## License

This project is for educational/assessment purposes. Movie data, images,
and the TMDB logo are property of [TMDB](https://www.themoviedb.org/) and
are used under their API terms of use. This product uses the TMDB API but
is not endorsed or certified by TMDB.
