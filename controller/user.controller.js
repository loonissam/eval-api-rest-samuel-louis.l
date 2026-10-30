const argon2 = require('argon2');
const User = require('./../models/user.models.js');

const publicUser = (user) => {
    const data = user.get({ plain: true });
    delete data.password;
    return data;
};

exports.create = async (req, res) => {
    const { email, password } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ message: 'Un email et un mot de passe d’au moins 8 caractères sont requis' });
    }

    const user = await User.create({
        email: normalizedEmail,
        password: await argon2.hash(password, { type: argon2.argon2id })
    });
    return res.status(201).json(publicUser(user));
}

exports.getAll = async (req, res) => {
    const listUser = await User.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json(listUser);
}