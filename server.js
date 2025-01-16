const express = require('express');
const mysql = require('mysql');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

// Verbindung zur MySQL-Datenbank herstellen
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'fussballstatistiken'
});

db.connect(err => {
    if (err) {
        console.error('Fehler beim Verbinden zur Datenbank:', err);
    } else {
        console.log('Mit der Datenbank verbunden.');
    }
});

// API-Schlüssel für RapidAPI (ersetzen Sie 'YOUR_RAPIDAPI_KEY' durch Ihren tatsächlichen API-Schlüssel)
const RAPIDAPI_KEY = 'YOUR_RAPIDAPI_KEY';

// Route für Live-Ergebnisse
app.get('/api/live-scores', async (req, res) => {
    try {
        const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        });

        const data = await response.json();
        res.json({ scores: data.response.map(fixture => ({
            match: `${fixture.teams.home.name} vs ${fixture.teams.away.name}`,
            result: `${fixture.goals.home} - ${fixture.goals.away}`
        })) });
    } catch (error) {
        console.error('Fehler beim Abrufen der Live-Daten:', error);
        res.status(500).send('Fehler beim Abrufen der Live-Daten');
    }
});

// Route für historische Daten
app.get('/api/historical-data', (req, res) => {
    const query = 'SELECT * FROM historical_data ORDER BY year DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Fehler beim Abrufen der historischen Daten:', err);
            res.status(500).send('Fehler beim Abrufen der historischen Daten');
        } else {
            res.json({ stats: results });
        }
    });
});

// Statische Dateien bereitstellen
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
