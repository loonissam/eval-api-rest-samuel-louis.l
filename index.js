require('dotenv').config();
const express = require('express');
const { db } = require('./config/association.js');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

async function start() {
    try {
        await db.authenticate();
        await db.sync();
        console.log('Connexion MySQL OK');
        app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
    } catch (err) {
        console.error('Impossible de démarrer :', err.message);
        process.exit(1);
    }
}

start();