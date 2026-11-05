// ESPN's public standings feed: no API key and CORS-open, so it works from GitHub Pages.
const STANDINGS_URL = 'https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings';

// ESPN sometimes sends colours as "##B5E7CE"
const zoneColor = note => '#' + note.color.replace(/^#+/, '');

function cell(tag, text, className) {
    const el = document.createElement(tag);
    el.textContent = text;
    if (className) el.className = className;
    return el;
}

function teamCell(team) {
    const td = document.createElement('td');
    td.className = 'club';
    const logo = team.logos && team.logos[0];
    if (logo) {
        const img = document.createElement('img');
        img.src = logo.href;
        img.alt = '';
        img.width = 24;
        img.height = 24;
        img.loading = 'lazy';
        td.appendChild(img);
    }
    td.appendChild(cell('span', team.displayName));
    return td;
}

function renderLegend(rows, legend) {
    const seen = new Map();
    rows.forEach(r => { if (r.note) seen.set(r.note.description, zoneColor(r.note)); });
    seen.forEach((color, description) => {
        const item = cell('li', description);
        item.style.setProperty('--zone', color);
        legend.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const body = document.getElementById('standings-body');
    const meta = document.getElementById('standings-meta');
    const legend = document.getElementById('standings-legend');

    try {
        const res = await fetch(STANDINGS_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const league = (await res.json()).children[0];

        const rows = league.standings.entries.map(e => ({
            team: e.team,
            note: e.note,
            stat: Object.fromEntries(e.stats.map(s => [s.name, s.displayValue])),
        })).sort((a, b) => Number(a.stat.rank) - Number(b.stat.rank));

        rows.forEach(r => {
            const tr = document.createElement('tr');
            if (r.note) {
                tr.style.setProperty('--zone', zoneColor(r.note));
                tr.title = r.note.description;
            }
            tr.append(
                cell('td', r.stat.rank, 'rank'),
                teamCell(r.team),
                cell('td', r.stat.gamesPlayed),
                cell('td', r.stat.wins, 'wdl'),
                cell('td', r.stat.ties, 'wdl'),
                cell('td', r.stat.losses, 'wdl'),
                cell('td', r.stat.pointDifferential),
                cell('td', r.stat.points, 'pts'),
            );
            body.appendChild(tr);
        });

        renderLegend(rows, legend);
        meta.textContent = league.name;
    } catch (err) {
        console.error('Standings fetch failed:', err);
        meta.textContent = "Couldn't load the table right now. Please try again later.";
    }
});
