exports.auth = (req, res, next) => {
    console.log(req);
}

exports.auth = (req, res, next) => {
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' })
    } 
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' })
    }
}