const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

function generateUUID() {
    let dt = new Date().getTime();
    return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, (c) => {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return ((c === 'x') ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// Post route login user
router.post('/login', async (req, res, next) => {
    const user = await User.findOne({username: req.body.username}).select('+password');
    const isAuthenticated = await (user && user.verifyPassword(req.body.password));
    if (!isAuthenticated) {
        next({
            status: 401,
            message: 'The username or password is wrong!'
        });
        return;
    }
    res.json({
        _id: user._id,
        username: user.username,
        token: user.getToken()
    });
});

// Post route register a new user
router.post('/register', async (req, res, next) => {
    try {
        const user = await (new User({
            uuid: generateUUID(),
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }).save());
        res.json({
            _id: user._id,
            username: user.username,
            token: user.getToken()
        });
    } catch (err) {
        if (err.code === 11000) {
            next({
                status: 409,
                message: 'This username already exists!'
            });
        }
        next();
    }
});

module.exports = router;
