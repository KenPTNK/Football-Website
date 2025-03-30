document.addEventListener("DOMContentLoaded", async function () {
    callTeams();
});

async function callTeams() {
    try {
        
        let response = await fetch("https://v3.football.api-sports.io/teams/statistics?season=2023&team=33&league=39", {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "99ef879facec031cb5721b03daaca547"
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error('Fetch error:', err);
    }
}