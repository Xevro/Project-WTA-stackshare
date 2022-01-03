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

// Get question by id
router.get('/:questionId/comments', async (req, res) => {
    const comments = await Comments.find({question_uuid: req.params.questionId}).populate('user');
    res.json({
        data: comments,
    });
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
            message: err.message + 'This question could not be added.'
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
            message: err.message + 'This comment could not be added.'
        });
    }
});

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

/*
router.delete(
  '/:storyId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    let story = await Story.findOne({ _id: req.params.storyId })
    if (!story.user.equals(req.user._id)) {
      res
        .status(401)
        .json({
          message: 'You cannot delete a story that you do not own!'
        })
      return
    }
    await Story.deleteOne({ _id: story._id })
    res.json({
      message: 'deleted!'
    })
  }
)*/

module.exports = router;
