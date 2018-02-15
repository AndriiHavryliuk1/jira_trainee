const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    task_id: Number,
    name: { type: String, require: true },
    description: String,
    parent_id: mongoose.Schema.Types.ObjectId,
    children_ids: { type:Array, default: [] },
    user_id: mongoose.Schema.Types.ObjectId,
    column_id: mongoose.Schema.Types.ObjectId,
    status: String,
    type: String
});

module.exports = mongoose.model('Task', taskSchema);