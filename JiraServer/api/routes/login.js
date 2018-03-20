const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

router.post('/', (req, res, next) => {
    if (req.body.login && req.body.password) {
        let login = req.body.login;
        let password = req.body.password;
    } else {
        return res.status(400).json({ message: "Incorrect body." });
    }

    User.findOne({ 'login': login }).exec().then(function(user) {
        if (user.password === req.body.password) {
            // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
            var payload = { id: user.id };
            var token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({ message: "ok", token: token });
        } else {
            res.status(401).json({ message: "passwords did not match" });
        }
    }, function() {
        res.status(401).json({ message: "no such user found" });
    });
})

module.exports = router;