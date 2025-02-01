const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
    const token = req.cookies.authcookie || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token, no access.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = authAdmin;