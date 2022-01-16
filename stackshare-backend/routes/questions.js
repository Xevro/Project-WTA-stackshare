const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Questions = mongoose.model('Questions');
const Comments = mongoose.model('Comments');

function generateUUID() {
    let dt = new Date().getTime();
    return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, (c) => {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return ((c === 'x') ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// Get all questions
router.get('/', async (req, res) => {
    const questions = await Questions.find().populate('user').populate('categories');
    res.json({
        data: questions,
        totalCount: await Questions.countDocuments()
    });
});

// Get question by id
router.get('/:questionId', async (req, res) => {
    const question = await Questions.findOne({uuid: req.params.questionId}).populate('user');
    res.json(question);
});

// Get all question by the user id
router.get('/user/:userId', async (req, res) => {
    const questions = await Questions.find({user: req.params.userId}).populate('categories');
    res.json({data: questions});
});

// Get question by id
router.get('/:questionId/comments', async (req, res) => {
    const comments = await Comments.find({question_uuid: req.params.questionId}).populate('user');
    res.json({data: comments});
});

// Add new question
router.post('/add', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try {
        const question = await (new Questions({
            uuid: generateUUID(),
            title: req.body.title,
            description: req.body.description,
            categories: req.body.categories,
            user: req.user._id
        }).save());
        res.json(question);
    } catch (err) {
        next({
            status: 400,
            message: err.message + 'This question could not be added'
        });
    }
});

// Add new comment
router.post('/:questionId/comment/add', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try {
        const comment = await (new Comments({
            uuid: generateUUID(),
            message: req.body.message,
            user: req.user._id,
            question_uuid: req.params.questionId
        }).save());
        res.json(comment);
    } catch (err) {
        next({
            status: 400,
            message: err.message + 'This comment could not be added'
        });
    }
});

// Update a comment
router.patch('/comment/:commentId', (req, res) => {
    Comments.updateOne({uuid: req.params.commentId}, req.body,
        (err) => {
            if (err) {
                res.json({
                    err: err,
                    success: false,
                    msg: 'Failed to update the comment'
                })
            } else {
                res.json({success: true})
            }
        }
    )
});

// Update the count of a question
router.patch('/:questionId/count', (req, res) => {
    Questions.updateOne({uuid: req.params.questionId}, req.body,
        (err) => {
            if (err) {
                res.json({
                    err: err,
                    success: false,
                    msg: 'Failed to update count value'
                })
            } else {
                res.json({success: true})
            }
        }
    )
});

// Update the count of a comment
router.patch('/:questionId/comment/:commentId/count', (req, res) => {
    Comments.updateOne({_id: req.params.commentId}, req.body,
        (err) => {
            if (err) {
                res.json({
                    err: err,
                    success: false,
                    msg: 'Failed to update count value'
                })
            } else {
                res.json({success: true})
            }
        }
    )
});

// Delete a question with all comments
router.delete('/:questionId', passport.authenticate('jwt', {session: false}), async (req, res) => {
    let question = await Questions.findOne({uuid: req.params.questionId})
    if (!question.user.equals(req.body.user._id)) {
        res.status(401).json({
            message: 'You cannot delete a question that you do not own'
        });
        return;
    }
    await Questions.deleteOne({uuid: req.params.questionId});
    await Comments.deleteMany({question_uuid: req.params.questionId});
    res.json({
        message: 'deleted the question and comments',
        status: true
    });
});

// Delete a comment by Id
router.delete('/:questionId/comment/:commentId', passport.authenticate('jwt', {session: false}), async (req, res) => {
    let comment = await Comments.findOne({question_uuid: req.params.questionId, uuid: req.params.commentId})
    if (!comment.user.equals(req.body.user._id)) {
        res.status(401).json({
            message: 'You cannot delete a comment that you do not own'
        });
        return;
    }
    await Comments.deleteOne({uuid: req.params.commentId, user: req.body.user._id}).then(() => {
        res.json({
            message: 'deleted the comment',
            status: true
        });
    });
});

// Update a question
router.patch('/:questionId', async (req, res) => {
    let question = await Questions.findOne({uuid: req.params.questionId})
    if (!question.user.equals(req.body._id)) {
        res.status(401).json({
            message: 'You cannot edit a question that you do not own'
        });
        return;
    }
    Questions.updateOne({uuid: req.params.questionId}, req.body,
        (err) => {
            if (err) {
                res.json({
                    err: err,
                    success: false,
                    msg: 'Failed to update the question'
                })
            } else {
                res.json({success: true})
            }
        }
    )
});

module.exports = router;
