const  argon2 = require('argon2');
const User = require('./../models/user.models.js');
const jwt = require('jsonwebtoken');

const hashPassword = (password) => argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3
});

const publicUser = (user) => {
    const data = user.get({ plain: true });
    delete data.password;
    return data;
};

exports.login = async (req, res) => {
    const { email, password } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || typeof password !== 'string' || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({
        where: { email: normalizedEmail }
    });
    if(!user){
        return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    const valid = await argon2.verify(user.password, password);
    if(!valid){
        return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not configured');
    }
    const token = jwt.sign({
        id: user.id
    }, process.env.JWT_KEY, { expiresIn: '1h' });
    return res.status(200).json({ token });
}

exports.signin = async (req, res) => {
    const { email, password } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ message: 'Un email et un mot de passe d’au moins 8 caractères sont requis' });
    }

    const user = await User.findOne({
        where: { email: normalizedEmail }
    });
    if(user){
        return res.status(409).json({ message: 'Cet utilisateur existe déjà' });
    }

    const hash = await hashPassword(password);
    const newUser = await User.create({
        email: normalizedEmail,
        password: hash
    });
    return res.status(201).json(publicUser(newUser));
}
