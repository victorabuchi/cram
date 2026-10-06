# Scribletics

A study app for test preparation, built with React. Pick a subject on the dashboard, open a week, then learn it, practise it with spaced repetition, and test yourself with a practice test. Progress is stored in your browser (localStorage).

Course content is summarised from lectures for the *Web Programming I* course.

## Screens

| Route | Purpose |
| --- | --- |
| `/` | Dashboard of subjects (course cards with progress) |
| `/s/:subject` and `/s/:subject/:week` | Subject page with its weeks, and a week page |
| `/s/:subject/:week/learn` | Lecture summaries with code examples |
| `/s/:subject/:week/practice` | Practice sessions: wrong answers come back sooner (Leitner boxes) |
| `/s/:subject/:week/mock` | Practice test scored out of 30, with self-graded open questions |
| `/progress` | Charts and per-week progress |
| `/glossary` | Look up course terms live from Wikipedia |

## Tech

- React 19 + Vite, components in `src/components` and `src/pages`
- **react-router-dom** for navigation (HashRouter, so it works on GitHub Pages)
- **Bootstrap + react-bootstrap** for styling and layout
- **Chart.js + react-chartjs-2** for the progress charts
- **react-toastify** for notifications
- **Wikipedia REST API** (`fetch` + `async/await`, JSON) for the glossary: `src/api/wikipedia.js`

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # development server, http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
npm run lint
```

## Deploy to GitHub Pages

1. Push the repository to GitHub (public).
2. In the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds the app and publishes it at `https://<your-username>.github.io/<repository-name>/`.

## Adding content

Study items live in `src/data/content.json` (learn cards and questions, each tagged with `topic` and `week`). Subjects and their weeks are listed in `src/data/subjects.js`; add an entry there to get a new card on the dashboard.
