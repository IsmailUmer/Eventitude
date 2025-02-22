const Joi = require('joi');
const userModel = require('../models/user.server.models');

// Validation schema for create account
const createAccountSchema = Joi.object({
    first_name: Joi.string().min(1).max(50).required(),
    last_name: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^(){}[\]:;<>,.+~=])[A-Za-z\d@$!%*?&#^(){}[\]:;<>,.+~=]{8,}$/).required()
}).options({ allowUnknown: false });

// Validation schema for login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).options({ allowUnknown: false });

// Create account function
const create_account = (req, res) => {
    const { error } = createAccountSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error_message: error.details[0].message });
    }

    userModel.addNewUser(req.body, (err, result) => {
        if (err) {
            if (err.status === 400) {
                return res.status(400).json({ error_message: err.message });
            }
            return res.status(500).json({ message: 'Internal server error.' });
        }
        res.status(201).send({ user_id: result.id });
    });
};

// Login function
const login = (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error_message: error.details[0].message });
    }

    userModel.authenticateUser(req.body.email, req.body.password, (err, result) => {
        if (err) {
            if (err.status === 400) {
                return res.status(400).json({ error_message: err.message });
            }
            return res.status(500).json({ error_message: 'Internal server error.' });
        }
        res.status(200).json({ user_id: result.user_id, session_token: result.token });
    });
};

// Logout function
const logout = (req, res) => {
    const token = req.headers['x-authorization'];

    if (!token) {
        return res.status(401).json({ error_message: 'User not logged in.' });
    }

    userModel.logoutUser(token, (err) => {
        if (err) {
            if (err.status === 401) {
                return res.status(401).json({ error_message: 'User not logged in.' });
            }
            return res.status(500).json({ error_message: 'Internal server error.' });
        }
        return res.status(200).json({ message: 'Logout successful.' });
    });
};

module.exports = {
    create_account,
    login,
    logout
};
