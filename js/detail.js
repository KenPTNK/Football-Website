// One club's season: record, upcoming fixtures and results, from ESPN's public feeds.
// Only the standings and schedule endpoints are CORS-open, so everything comes from those two.
const STANDINGS_URL = 'https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings';
const TEAM_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/';
const UPCOMING_SHOWN = 5;

const STATS = [
    ['gamesPlayed', 'Played'], ['wins', 'Won'], ['ties', 'Drawn'], ['losses', 'Lost'],
    ['pointsFor', 'Goals for'], ['pointsAgainst', 'Goals against'], ['points', 'Points'],
];

function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
}

function crest(team) {
    const logo = team.logos && team.logos[0];
    if (!logo) return el('span');
    const img = document.createElement('img');
    img.src = logo.href;
    img.alt = '';
    img.width = 28;
    img.height = 28;
    img.loading = 'lazy';
    return img;
}

// W/D/L from this club's point of view
function resultFor(comp, teamId) {
    const us = comp.competitors.find(c => c.team.id === teamId);
    const them = comp.competitors.find(c => c.team.id !== teamId);
    const diff = Number(us.score.value) - Number(them.score.value);
    return diff > 0 ? ['W', 'Won'] : diff < 0 ? ['L', 'Lost'] : ['D', 'Drawn'];
}

// One row: date, home side, score (or kick-off time), away side, then W/D/L or the venue.
function matchRow(event, teamId) {
    const comp = event.competitions[0];
    const home = comp.competitors.find(c => c.homeAway === 'home');
    const away = comp.competitors.find(c => c.homeAway === 'away');
    const date = new Date(event.date);
    const played = comp.status.type.state === 'post';

    const row = el('div', undefined, 'match');
    row.appendChild(el('span', date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), 'match-date'));

    const homeSide = el('span', undefined, 'match-team home');
    homeSide.append(el('span', home.team.displayName), crest(home.team));
    const awaySide = el('span', undefined, 'match-team away');
    awaySide.append(crest(away.team), el('span', away.team.displayName));

    const middle = played
        ? `${home.score.displayValue} – ${away.score.displayValue}`
        : date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    row.append(homeSide, el('span', middle, played ? 'match-score' : 'match-score upcoming'), awaySide);

    if (played) {
        const [letter, label] = resultFor(comp, teamId);
        const badge = el('span', letter, `result result-${letter}`);
        badge.title = label;
        badge.setAttribute('aria-label', label);
        row.appendChild(badge);
    } else {
        row.appendChild(el('span', comp.venue ? comp.venue.fullName : '', 'match-venue'));
    }
    return row;
}

document.addEventListener('DOMContentLoaded', async () => {
    const nameEl = document.getElementById('team-name');
    const summary = document.getElementById('team-summary');
    const id = new URLSearchParams(location.search).get('id');

    if (!/^\d+$/.test(id || '')) {
        nameEl.textContent = 'Club not found';
        const link = el('a', 'clubs page');
        link.href = './teams.html';
        summary.append('Pick a club from the ', link, '.');
        return;
    }

    try {
        const responses = await Promise.all([
            fetch(`${TEAM_URL}${id}/schedule`),
            fetch(`${TEAM_URL}${id}/schedule?fixture=true`),
            fetch(STANDINGS_URL),
        ]);
        const bad = responses.find(r => !r.ok);
        if (bad) throw new Error(`HTTP ${bad.status}`);
        const [schedule, fixtures, standings] = await Promise.all(responses.map(r => r.json()));
        const team = schedule.team;

        document.title = `${team.displayName} · Premier League`;
        nameEl.textContent = team.displayName;
        summary.textContent = team.standingSummary || '';
        if (team.logo) {
            const img = document.getElementById('team-logo');
            img.src = team.logo;
            img.hidden = false;
        }

        const entry = standings.children[0].standings.entries.find(e => e.team.id === team.id);
        if (entry) {
            const values = Object.fromEntries(entry.stats.map(s => [s.name, s.displayValue]));
            const list = document.getElementById('team-stats');
            STATS.forEach(([key, label]) => {
                if (values[key] === undefined) return;
                const box = el('div', undefined, 'team-stat');
                box.append(el('dt', label), el('dd', values[key]));
                list.appendChild(box);
            });
        }

        const upcoming = (fixtures.events || [])
            .filter(e => e.competitions[0].status.type.state === 'pre')
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, UPCOMING_SHOWN);
        if (upcoming.length) {
            const body = document.getElementById('next-match-body');
            upcoming.forEach(e => body.appendChild(matchRow(e, team.id)));
            document.getElementById('next-match').hidden = false;
        }

        const played = (schedule.events || [])
            .filter(e => e.competitions[0].status.type.state === 'post')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        if (played.length) {
            const body = document.getElementById('results-body');
            played.forEach(e => body.appendChild(matchRow(e, team.id)));
            document.getElementById('results').hidden = false;
        }
    } catch (err) {
        console.error('Club fetch failed:', err);
        nameEl.textContent = 'Club unavailable';
        summary.textContent = "Couldn't load this club right now. Please try again later.";
    }
});
