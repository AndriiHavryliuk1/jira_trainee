const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    login: { type: String, required: true, unique: true },
    password: { type: String, default: "password" },
    imageURL: { type: String, default: "" },
    ticket_ids: { type: Array, default: [] }
});

module.exports = mongoose.model('User', userSchema);