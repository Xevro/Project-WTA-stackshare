const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport')
const Questions = mongoose.model('Questions');

router.get('/', passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        const questions = await Questions.find();
        res.json({
            data: questions,
            totalCount: await Questions.countDocuments()
        });
    });

module.exports = router;
