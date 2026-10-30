require('dotenv').config();
const express = require('express');
const { db } = require('./config/association.js');
const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/user.routes.js');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON malformé' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

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