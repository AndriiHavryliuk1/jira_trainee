const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Board = require('../models/board');

// GET get all boardColumns
router.get('/', (req, res, next) => {
    Board.find().exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => res.status(500).json({
            message: error.message
        }));
});

// POST create new boardColumn
router.post("/", (req, res, next) => {
    const board = new Board({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        boardColumn_ids: req.body.boardColumn_ids,
        ticket_ids: req.body.ticket_ids
    });

    board.save()
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json({
            error: error
        }));
});

module.exports = router;