document.addEventListener('DOMContentLoaded', () => {
    fetchLiveScores();
    fetchLeagues();
    fetchHistoricalData();
});

function fetchLiveScores() {
    fetch('/api/live-scores')
        .then(response => response.json())
        .then(data => {
            const liveScoresDiv = document.getElementById('live-scores');
            liveScoresDiv.innerHTML = data.scores.map(score => `
                <p>${score.match}: ${score.result} (${score.league}, ${score.time} Minuten)</p>
            `).join('');
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der Live-Daten:', error);
            document.getElementById('live-scores').innerHTML = '<p>Fehler beim Abrufen der Live-Daten.</p>';
        });
}

function fetchLeagues() {
    fetch('/api/leagues')
        .then(response => response.json())
        .then(data => {
            const leagueListDiv = document.getElementById('league-list');
            leagueListDiv.innerHTML = data.leagues.map(league => `
                <p>${league.name} (${league.country}, Saison ${league.season})</p>
            `).join('');
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der Liga-Daten:', error);
            document.getElementById('league-list').innerHTML = '<p>Fehler beim Abrufen der Liga-Daten.</p>';
        });
}

function fetchHistoricalData() {
    fetch('/api/historical-data')
        .then(response => response.json())
        .then(data => {
            const historicalStatsDiv = document.getElementById('historical-stats');
            historicalStatsDiv.innerHTML = data.stats.map(stat => `
                <p>${stat.year}: ${stat.event}</p>
            `).join('');
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der historischen Daten:', error);
            document.getElementById('historical-stats').innerHTML = '<p>Fehler beim Abrufen der historischen Daten.</p>';
        });
}
