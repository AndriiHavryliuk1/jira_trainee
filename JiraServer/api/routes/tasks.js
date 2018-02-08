const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Task = require('../models/task');
const TasksController = require('../controllers/tasksController');

// GET tasks get all tasks
router.get('/', TasksController.get_all_tasks);

// GET tasks/:taskId get by id
router.get('/:taskId', TasksController.get_task_by_id);

// POST create task
router.post('/', TasksController.create_task);

// PATCH tasks/:taskId update by id 
router.patch('/:taskId', TasksController.update_task);

// DELETE tasks/:taskId get by id
router.delete('/:taskId', TasksController.delete_task);


module.exports = router;

