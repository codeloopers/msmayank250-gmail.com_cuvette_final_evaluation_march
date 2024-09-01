const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const Auth = async (req, res, next) => {
    try {
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
       
        req.user = decoded;  
        next(); 
    } catch (error) {
        console.error('Token verification error:', error); 
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = Auth;
