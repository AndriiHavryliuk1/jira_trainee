const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, default: "password" },
    imageURL: { type: String, default: "" },
    ticket_ids: { type: Array, default: [] }
});

module.exports = mongoose.model('User', userSchema);