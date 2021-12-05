const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {virtuals: true}
});

module.exports = mongoose.model('Questions', questionSchema);
