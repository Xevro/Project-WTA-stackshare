const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    toJSON: {virtuals: true}
});

module.exports = mongoose.model('Categories', categoriesSchema);
