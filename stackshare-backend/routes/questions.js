const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport')
const Questions = mongoose.model('Questions');

router.get('/',
    async (req, res) => {
        const questions = await Questions.find().populate('user');
        res.json({
            data: questions,
            totalCount: await Questions.countDocuments()
        });
    });

router.get('/:questionId',
    async (req, res) => {
        const question = await Questions.findOne({uuid: req.params.questionId});
        res.json(question);
    });

module.exports = router;
