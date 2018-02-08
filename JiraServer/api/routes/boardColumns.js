const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const BoardColumn = require('../models/boardColumn');

// GET get all boardColumns
router.get('/', (req, res, next) => {
    BoardColumn.find().exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => res.status(500).json({
            message: error.message
        }));
});

// POST create new boardColumn
router.post("/", (req, res, next) => {
    const ticket = new BoardColumn({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        persistentName: req.body.persistentName,
    });

    ticket.save()
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json({
            error: error
        }));
});

module.exports = router;