// Club list from ESPN's standings feed (no key, CORS-open; their /teams endpoint is not CORS-open),
// linking to each club's page.
const STANDINGS_URL = 'https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings';

document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('team-grid');
    const meta = document.getElementById('teams-meta');

    try {
        const res = await fetch(STANDINGS_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const teams = (await res.json()).children[0].standings.entries
            .map(e => e.team)
            .sort((a, b) => a.displayName.localeCompare(b.displayName));

        teams.forEach(team => {
            const link = document.createElement('a');
            link.className = 'team-card';
            link.href = `./detail.html?id=${encodeURIComponent(team.id)}`;

            const logo = team.logos && team.logos[0];
            if (logo) {
                const img = document.createElement('img');
                img.src = logo.href;
                img.alt = '';
                img.width = 64;
                img.height = 64;
                img.loading = 'lazy';
                link.appendChild(img);
            }
            const name = document.createElement('span');
            name.textContent = team.displayName;
            link.appendChild(name);

            const item = document.createElement('li');
            item.appendChild(link);
            grid.appendChild(item);
        });

        meta.textContent = `${teams.length} clubs this season. Pick one to see its results.`;
    } catch (err) {
        console.error('Teams fetch failed:', err);
        meta.textContent = "Couldn't load the clubs right now. Please try again later.";
    }
});
