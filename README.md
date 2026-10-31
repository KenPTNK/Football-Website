# Premier League

A football website about the Premier League: clubs, league history and standings.
Built with plain HTML, CSS and JavaScript (Bootstrap 5) in the MindX Web Development course (2025).

**Live:** https://kenptnk.github.io/premier-league/

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Home page with a carousel and league navigation; clubs are loaded from `js/premierLeague.json` |
| `standings.html` | The 2023 Premier League table through the API-Football standings widget |
| `detail.html` | A club detail page |
| `login.html` | A demo sign-in kept in `localStorage` |

Club data is cached in local JSON files (`js/premierLeague.json`, `js/bundesliga.json`, `js/data.json`)
so the pages do not spend API calls.

## Run locally

Serve the folder with any static server, for example `npx serve .`
The standings widget needs your own API-Football key in `standings.html`.
