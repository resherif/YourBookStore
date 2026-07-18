const jwt = require('jsonwebtoken');
//const dotenv = require('dotenv').config();
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Not Authorized !" });
    }
    const token = authHeader.split(' ')[1];

    try {
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = {
            id: decodedToken.id,
            role: decodedToken.role 
        };
        next();

    } catch (error) {
        return res.status(401).json({ message: "Token is not valid!" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        res.status(403).json({ message: "Unauthorized to enter here !" });
    }
};

module.exports = { requireAuth, isAdmin };