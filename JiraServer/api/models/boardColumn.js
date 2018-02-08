const mongoose = require('mongoose');

const boardColumnSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    persistentName: String
});

module.exports = mongoose.model('BoardColumn', boardColumnSchema);