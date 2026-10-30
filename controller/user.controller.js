const bcrypt = require('bcryptjs');
const User = require('./../models/user.models.js');

const publicUser = (user) => {
    const data = user.get({ plain: true });
    delete data.password;
    return data;
};

exports.create = async (req, res) => {
    const { username, password } = req.body || {};
    const name = typeof username === 'string' ? username.trim() : '';
    if (name.length < 2 || name.length > 30) {
        return res.status(400).json({ error: 'Un pseudo de 2 à 30 caractères est requis' });
    }
    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Un mot de passe d’au moins 6 caractères est requis' });
    }

    const existing = await User.findOne({ where: { username: name } });
    if (existing) {
        return res.status(409).json({ error: 'Ce pseudo est déjà utilisé' });
    }

    const user = await User.create({
        username: name,
        password: await bcrypt.hash(password, 10)
    });
    return res.status(201).json(publicUser(user));
}

exports.getAll = async (req, res) => {
    const listUser = await User.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json(listUser);
}
