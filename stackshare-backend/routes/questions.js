const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Questions = mongoose.model('Questions');

function generateUUID() {
    let dt = new Date().getTime();
    return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, (c) => {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return ((c === 'x') ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

router.get('/', async (req, res) => {
    const questions = await Questions.find().populate('user').populate('categories');
    res.json({
        data: questions,
        totalCount: await Questions.countDocuments()
    });
});

router.get('/:questionId', async (req, res) => {
    const question = await Questions.findOne({uuid: req.params.questionId}).populate('user');
    res.json(question);
});

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
            message: err.message + 'This post could not be added.'
        });
    }
});


/*router.put(
  '/:storyId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    let story = await Story.findOne({ _id: req.params.storyId })
    if (!story.user.equals(req.user._id)) {
      res
        .status(401)
        .json({
          message: 'You cannot edit a story that you do not own!'
        })
      return
    }
    story.title = req.body.title
    story.content = req.body.content
    story = await story.save()
    res.json(story)
  }
)

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
