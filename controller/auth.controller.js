const bcrypt = require('bcryptjs');
const User = require('./../models/user.models.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { revokedTokens } = require('./../middleware/auth.middleware.js');

const hashPassword = (password) => bcrypt.hash(password, 10);

const publicUser = (user) => {
    const data = user.get({ plain: true });
    delete data.password;
    return data;
};

const createToken = (user) => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not configured');
    }
    return jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: '1h', jwtid: crypto.randomUUID() });
};

exports.login = async (req, res) => {
    const { username, password } = req.body || {};
    if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const user = await User.findOne({
        where: { username: username.trim() }
    });
    if(!user){
        return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if(!valid){
        return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    return res.status(200).json({ token: createToken(user), user: publicUser(user) });
}

exports.signin = async (req, res) => {
    const { username, password } = req.body || {};
    const name = typeof username === 'string' ? username.trim() : '';
    if (name.length < 2 || name.length > 30) {
        return res.status(400).json({ error: 'Un pseudo de 2 à 30 caractères est requis' });
    }
    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Un mot de passe d’au moins 6 caractères est requis' });
    }

    const user = await User.findOne({
        where: { username: name }
    });
    if(user){
        return res.status(409).json({ error: 'Ce pseudo est déjà utilisé' });
    }

    const hash = await hashPassword(password);
    const newUser = await User.create({
        username: name,
        password: hash
    });
    return res.status(201).json({ token: createToken(newUser), user: publicUser(newUser) });
}

exports.me = (req, res) => {
    return res.status(200).json(req.user);
}

exports.logout = (req, res) => {
    revokedTokens.add(req.token);
    return res.status(204).end();
}
