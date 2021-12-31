const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    question_uuid: {
        type: String,
        required: true
    },
    created_at: {
        type: Number,
        default: Date.now
    }
}, {
    toJSON: {virtuals: true}
});

module.exports = mongoose.model('Comments', commentSchema);
