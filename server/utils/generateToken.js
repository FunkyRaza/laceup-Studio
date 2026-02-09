const jwt = require('jsonwebtoken');

const generateToken = (data) => {
    const payload = typeof data === 'object' ? data : { id: data };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

module.exports = generateToken;
