document.getElementById('getPlayerInfo').addEventListener('click', function () {
    let playerName = document.getElementById('playerName').value.trim();
    if (playerName === "") {
        alert("Please enter a player name.");
        return;
    }

    // API URL for player information (For this example, you can use a mock data source or API)
    const apiUrl = `https://api.football-data.org/v4/players?name=${playerName}`;

    // Fetch player info
    fetch(apiUrl, {
        headers: {
            'X-Auth-Token': 'your_api_key_here' // Replace with your actual API key
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.players && data.players.length > 0) {
                const player = data.players[0];
                const playerInfoDiv = document.getElementById('playerInfo');
                playerInfoDiv.innerHTML = `
            <h3>${player.name}</h3>
            <p><strong>Position:</strong> ${player.position}</p>
            <p><strong>Nationality:</strong> ${player.nationality}</p>
            <p><strong>Birthdate:</strong> ${player.dateOfBirth}</p>
            <p><strong>Club:</strong> Manchester United</p>
          `;
            } else {
                document.getElementById('playerInfo').innerText = "Player not found.";
            }
        })
        .catch(error => {
            document.getElementById('playerInfo').innerText = "Error fetching player data.";
            console.error("Error fetching player data:", error);
        });
});

// Mock upcoming matches and highlighted news (You can replace this with actual API)
const mockMatches = [
    { date: '2025-02-15', opponent: 'Liverpool', time: '19:00' },
    { date: '2025-02-22', opponent: 'Chelsea', time: '21:00' }
];

const mockNews = [
    { title: 'Manchester United Signs New Star', highlighted: true },
    { title: 'Rashford Sets New Record', highlighted: false }
];

function displayUpcomingMatches() {
    const matchList = document.getElementById('matchList');
    mockMatches.forEach(match => {
        const matchItem = document.createElement('li');
        matchItem.innerHTML = `<strong>${match.date}</strong> vs ${match.opponent} at ${match.time}`;
        matchList.appendChild(matchItem);
    });
}

function displayHighlightedNews() {
    const newsList = document.getElementById('newsList');
    mockNews.forEach(news => {
        const newsItem = document.createElement('li');
        newsItem.innerHTML = news.highlighted ? `<span class="highlighted-news">${news.title}</span>` : news.title;
        newsList.appendChild(newsItem);
    });
}

// Load mock data initially
displayUpcomingMatches();
displayHighlightedNews();
