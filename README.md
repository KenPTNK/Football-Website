# Premier League

A football website about the Premier League: clubs, league history and standings.
Built with plain HTML, CSS and JavaScript (Bootstrap 5) in the MindX Web Development course (2025).

**Live:** https://kenptnk.github.io/Football-Website/

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Home page: league history and a carousel of club crests (from `js/premierLeague.json`) |
| `standings.html` | The live Premier League table, with European places and relegation marked |
| `teams.html` | Every club this season |
| `detail.html` | One club: its record, the next five fixtures and every result this season |
| `login.html` | A demo sign-in kept in `localStorage` (not real accounts) |

Live data comes from ESPN's public standings and schedule feeds, which need no API key
and can be called straight from the browser.

## Run locally

Serve the folder with any static server, for example `npx serve .`
