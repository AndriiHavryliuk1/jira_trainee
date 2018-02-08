const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    boardColumn_ids: { type: Array, default: [] },
    ticket_ids: { type: Array, default: [] }
});

module.exports = mongoose.model('Board', boardSchema);