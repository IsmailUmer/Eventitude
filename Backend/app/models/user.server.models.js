const crypto = require("crypto");
const db = require('../../database.js');

// Function to hash the password using a salt
const getHash = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
};

// Add a new user to the database
const addNewUser = (user, done) => {
    const checkEmailSql = `SELECT user_id FROM users WHERE email = ?`;

    db.get(checkEmailSql, [user.email], (err, row) => {
        if (err) {
            console.error('Error checking email:', err.message);
            return done({ status: 500, message: 'Database error' });
        }
        if (row) {
            return done({ status: 400, message: 'Email already in use' });
        }

        const salt = crypto.randomBytes(64).toString("hex");
        const hash = getHash(user.password, salt);

        const sql = `
            INSERT INTO users (first_name, last_name, email, password, salt, session_token) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [user.first_name, user.last_name, user.email, hash, salt, null];

        db.run(sql, values, function (err) {
            if (err) {
                console.error('Error adding user:', err.message);
                return done({ status: 500, message: 'Database error' });
            }
            done(null, { id: this.lastID });
        });
    });
};

// Authenticate a user by email and password
const authenticateUser = (email, password, done) => {
    const getUserSql = `SELECT user_id, password, salt, session_token FROM users WHERE email = ?`;

    db.get(getUserSql, [email], (err, row) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return done({ status: 500, message: 'Database error' });
        }
        if (!row) {
            return done({ status: 400, message: 'Invalid email or password.' });
        }

        const hash = getHash(password, row.salt);
        if (hash !== row.password) {
            return done({ status: 400, message: 'Invalid email or password.' });
        }

        if (row.session_token) {
            return done(null, { token: row.session_token, user_id: row.user_id });
        }

        const sessionToken = crypto.randomBytes(64).toString("hex");
        const updateTokenSql = `UPDATE users SET session_token = ? WHERE user_id = ?`;

        db.run(updateTokenSql, [sessionToken, row.user_id], (updateErr) => {
            if (updateErr) {
                console.error('Error updating session token:', updateErr.message);
                return done({ status: 500, message: 'Database error' });
            }
            done(null, { token: sessionToken, user_id: row.user_id });
        });
    });
};

// Logout a user by clearing their session token
const logoutUser = (token, done) => {
    const sql = `UPDATE users SET session_token = NULL WHERE session_token = ?`;

    db.run(sql, [token], function (err) {
        if (err) {
            console.error('Error clearing session token:', err.message);
            return done({ status: 500, message: 'Database error' });
        }
        done(null);
    });
};

// Retrieve user ID from a session token
const getIdFromToken = (token, done) => {
    const sql = `SELECT user_id FROM users WHERE session_token = ?`;

    db.get(sql, [token], (err, row) => {
        if (err) {
            console.error('Error retrieving user ID from token:', err.message);
            return done({ status: 500, message: 'Database error' });
        }
        done(null, row ? row.user_id : null);
    });
};

module.exports = {
    addNewUser,
    authenticateUser,
    logoutUser,
    getIdFromToken
};
