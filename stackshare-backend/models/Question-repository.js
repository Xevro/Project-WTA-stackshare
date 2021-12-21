const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categories: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Categories',
            required: false
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Number,
        default: Date.now
    }
}, {
    toJSON: {virtuals: true}
});

module.exports = mongoose.model('Questions', questionSchema);
