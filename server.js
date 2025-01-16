{
  "name": "dotenv",
  "version": "16.4.7",
  "description": "Loads environment variables from .env file",
  "main": "lib/main.js",
  "types": "lib/main.d.ts",
  "exports": {
    ".": {
      "types": "./lib/main.d.ts",
      "require": "./lib/main.js",
      "default": "./lib/main.js"
    },
    "./config": "./config.js",
    "./config.js": "./config.js",
    "./lib/env-options": "./lib/env-options.js",
    "./lib/env-options.js": "./lib/env-options.js",
    "./lib/cli-options": "./lib/cli-options.js",
    "./lib/cli-options.js": "./lib/cli-options.js",
    "./package.json": "./package.json"
  },
  "scripts": {
    "dts-check": "tsc --project tests/types/tsconfig.json",
    "lint": "standard",
    "pretest": "npm run lint && npm run dts-check",
    "test": "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
    "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov",
    "prerelease": "npm test",
    "release": "standard-version"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/motdotla/dotenv.git"
  },
  "funding": "https://dotenvx.com",
  "keywords": [
    "dotenv",
    "env",
    ".env",
    "environment",
    "variables",
    "config",
    "settings"
  ],
  "readmeFilename": "README.md",
  "license": "BSD-2-Clause",
  "devDependencies": {
    "@types/node": "^18.11.3",
    "decache": "^4.6.2",
    "sinon": "^14.0.1",
    "standard": "^17.0.0",
    "standard-version": "^9.5.0",
    "tap": "^19.2.0",
    "typescript": "^4.8.4"
  },
  "engines": {
    "node": ">=12"
  },
  "browser": {
    "fs": false
  }
}
const express = require('express');
const mysql = require('mysql');
const fetch = require('node-fetch');
require('dotenv').config(); // dotenv Modul laden, um Umgebungsvariablen zu verwenden

const app = express();
const port = process.env.PORT || 3000;

// Verbindung zur MySQL-Datenbank herstellen
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Fehler beim Verbinden zur Datenbank:', err);
    } else {
        console.log('Mit der Datenbank verbunden.');
    }
});

// API-Schlüssel für RapidAPI
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// Route für Live-Ergebnisse
app.get('/api/live-scores', async (req, res) => {
    try {
        const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        });

        const data = await response.json();
        res.json({ scores: data.response.map(fixture => ({
            match: `${fixture.teams.home.name} vs ${fixture.teams.away.name}`,
            result: `${fixture.goals.home} - ${fixture.goals.away}`,
            league: fixture.league.name,
            time: fixture.fixture.status.elapsed
        })) });
    } catch (error) {
        console.error('Fehler beim Abrufen der Live-Daten:', error);
        res.status(500).send('Fehler beim Abrufen der Live-Daten');
    }
});

// Route für Liga-Übersichten
app.get('/api/leagues', async (req, res) => {
    try {
        const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/leagues', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        });

        const data = await response.json();
        res.json({ leagues: data.response.map(league => ({
            name: league.league.name,
            country: league.country.name,
            season: league.seasons[0].year
        })) });
    } catch (error) {
        console.error('Fehler beim Abrufen der Liga-Daten:', error);
        res.status(500).send('Fehler beim Abrufen der Liga-Daten');
    }
});

// Statische Dateien bereitstellen
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
