# Cram

A study app for test preparation, built with React. Pick a subject on the dashboard, open a week, then learn it, practise it with spaced repetition, and test yourself with a practice test. Progress is stored in your browser (localStorage).

Course content is summarised from lectures for the *Web Programming I* course.

## Screens

| Route | Purpose |
| --- | --- |
| `/` | Dashboard of subjects (course cards with progress) |
| `/s/:subject` and `/s/:subject/:week` | Subject page with its weeks, and a week page |
| `/s/:subject/:week/learn` | Lecture summaries with code examples |
| `/s/:subject/:week/practice` | Practice sessions: wrong answers come back sooner (Leitner boxes) |
| `/s/:subject/:week/code` | Code exercises (write a function, run the tests), for weeks that have them |
| `/s/webprog/all/test` | Practice quiz: the official Moodle practice questions in their original order |
| `/s/:subject/:week/mock` | Practice test scored out of 30, with self-graded open questions |
| `/s/:subject/progress` | Progress of one course: charts and per-week progress (each course has its own) |
| `/s/bmc/automata` | Basic Models of Computation only. Automata lab: type an automaton as text, get a JFLAP-style diagram, step through inputs, test many strings, download SVG / PNG / `.jff` |
| `/s/webprog/glossary` | Web Programming I only. Search any term live on Wikipedia, browse course terms by week, save terms with your own notes |

## Tech

- React 19 + Vite, components in `src/components` and `src/pages`
- **react-router-dom** for navigation (HashRouter, so it works on GitHub Pages)
- **Bootstrap + react-bootstrap** for styling and layout
- **Chart.js + react-chartjs-2** for the progress charts
- **react-toastify** for notifications
- **Wikipedia REST API** (`fetch` + `async/await`, JSON): `src/api/wikipedia.js`. It powers the Glossary page and the **Look up** buttons on every Learn card (the card's text is scanned for course terms such as React, JSON or Git, and a click opens the Wikipedia summary in a popup). Requests are cancelled with `AbortController`, summaries are cached, and loading, error, rate-limit and not-found states are handled.
- **Vitest + Testing Library + vitest-axe** for tests

## React concepts used

- Props, state (`useState`), effects (`useEffect`), refs (`useRef`: focus management and cancelling requests), reducers (`useReducer`: practice/mock sessions and saved terms), context (`ProgressContext` and `TermsContext`), custom hooks (`useScope`, `useWikiArticle`, `useProgress`, `useTerms`)
- Controlled forms, conditional rendering, lists with keys, URL state (`useSearchParams`)

## Accessibility

Skip link, focus moved to the page content after each route change, focus moved to results and answers, `aria-live` regions for loading and results, named progress bars and charts, labelled form controls, visible focus outlines, and an automated axe check of every page in the test suite.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # development server, http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
npm run lint
npm test         # unit and integration tests (Vitest)
```

## Running Java for real (Programming II)

The Java exercises can compile and run your code with the JDK on your computer. Start the runner in a second terminal and keep it open:

```
npm run java
```

Then press Check on a Java exercise: the code is compiled and run, and your output is compared with the expected output. Without the runner the exercises fall back to checking that your code contains the needed parts. The runner listens on 127.0.0.1:8787 only, answers only this site and localhost pages, and does not sandbox the code, so run only your own code. On the live site some browsers (Safari) block a web page from talking to localhost; use Chrome or Firefox, or `npm run dev`, then.

## Deploy to GitHub Pages

1. Push the repository to GitHub (public).
2. In the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds the app and publishes it at `https://<your-username>.github.io/<repository-name>/`.

## Adding a course or a week

- A **course** is an entry in `SUBJECTS` in `src/data/subjects.js` (title, logos, weeks) plus a data source listed in `src/data/content.js`, shaped `{ topics, learn, questions }`. Web Programming I uses `src/data/content.json` (weeks 1-5) `src/data/webprog/jsSyntax.js` (code exercises), `src/data/webprog/practiceSet.js` (the Moodle practice test) and `src/data/webprog/week6.js`; *Basic Models of Computation* uses `src/data/bmc/` (one `weekN.js` per week, merged in `index.js`).
- A course can list `tools` in `SUBJECTS`: extra pages that appear in the top bar while you are inside that course (Glossary for Web Programming I, Automata lab for Basic Models of Computation).
- A **week** is an entry in that subject's `weeks` list (`n`, `title`, `logos`) plus learn cards and questions tagged `subject` and `week`. Topic keys must be unique across courses, and question ids must be unique everywhere.
- **Automaton diagrams** are written as text (see the syntax help in the Automata lab) and put on a learn card or question as `automaton`. Design questions can add `modelAutomaton` for the model solution. Answers to "which state does it end in" questions are computed from the automaton, and `src/data/bmc/automata.test.js` checks every exercise automaton against the language it should accept.
- Logos live in `src/assets/logos/` (Simple Icons, CC0, tinted with the brand colour).

## Adding content

Study items for Web Programming I live in `src/data/content.json`: learn cards and questions, each tagged with `subject`, `topic` and `week`.
