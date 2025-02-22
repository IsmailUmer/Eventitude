const userModel = require('../models/user.server.models');

const isAuthenticated = (req, res, next) => {
    const token = req.get('X-Authorization'); // Retrieve token from headers

    if (!token) {
        return res.status(401).json({ error_message: 'User not logged in.' });
    }

    userModel.getIdFromToken(token, (err, userId) => {
        if (err || !userId) {
            return res.status(401).json({ error_message: 'Invalid or expired session token.' });
        }

        req.authenticatedUserId = userId; // Attach user ID to the request
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = {
    isAuthenticated,
};
