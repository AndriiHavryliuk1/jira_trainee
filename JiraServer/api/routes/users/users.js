const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const UserController = require('../../controllers/usersController');
const User = require('../../models/user');

// GET users get all users
router.get('/', UserController.get_all_users);

// GET users/:userId get by id
router.get('/:userId', UserController.get_user_by_id);

// POST create user
router.post('/', UserController.create_user);

// PATCH users/:userId update by id 
router.patch('/:userId', UserController.update_user);

// DELETE users/:userId get by id
router.delete('/:userId', UserController.delete_user);

module.exports = router;
