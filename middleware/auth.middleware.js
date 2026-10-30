const jwt = require('jsonwebtoken');
const User = require('./../models/user.models.js');

const revokedTokens = new Set();
exports.revokedTokens = revokedTokens;

exports.auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || revokedTokens.has(token)) {
        return res.status(401).json({ error: 'Vous devez être connecté pour accéder à cette ressource' })
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findByPk(payload.id, { attributes: ['id', 'username'] });
        if (!user) {
            return res.status(401).json({ error: 'Vous devez être connecté pour accéder à cette ressource' })
        }
        req.user = user;
        req.token = token;
    } catch (error) {
        return res.status(401).json({ error: 'Vous devez être connecté pour accéder à cette ressource' })
    }
    next();
}
