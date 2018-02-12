'use strict';

const Task = require('../../models/task');
const BoardColumn = require('../../models/boardColumn');
const TaskStateMachine = require('./taskStateMachine');
const mongoose = require('mongoose');

exports.get_all_tasks = (req, res, next) => {
    var allTasksTree = [];
    buildTreeWithPromisesUpToDown().then(result => { res.status(200).json(result); })


    async function buildTreeWithPromisesDownToUp(allTasks) {
        allTasks.forEach(async task => {
            if (task.parent_id) {
                task = await getTreeWithPromises(task, allTasks);
            }
            allTasksTree.push(task);
            return task;
        });

        async function getTreeWithPromises(currentTask, allTasks) {
            let parentTask = await allTasks.find(x => x._id.toString() === currentTask.parent_id.toString());
            parentTask.childrens = parentTask.childrens || [];
            parentTask.childrens.push(currentTask);

            if (parentTask.parent_id) {
                parentTask = getTreeWithoutPromises(parentTask, allTasks);
            }

            return parentTask;
        }
    }

    async function buildTreeWithPromisesUpToDown() {
        let roots = await Task.find().where({ 'parent_id': null }).exec();
        for (let i = 0; i < roots.length; i++) {
            roots[i]._doc.childrens = [];
            roots[i]._doc.childrens = await getTreeWithPromises(roots[i]);
        }

        async function getTreeWithPromises(parent) {
            let childrens = await Task.find().where({ 'parent_id': parent._id }).exec();
            parent._doc.childrens = childrens;
            for (let i = 0; i < parent._doc.childrens.length; i++) {
                parent._doc.childrens[i].childrens = [];
                parent._doc.childrens[i].childrens = await getTreeWithPromises(parent._doc.childrens[i]);
            }

            return childrens;
        }
        return roots;
    }


    function buildTreeWithoutPromises(allTasks) {
        allTasks.forEach(task => {
            if (task.parent_id) {
                task = getTreeWithoutPromises(task, allTasks);
            }
            allTasksTree.push(task);
        });

        function getTreeWithoutPromises(currentTask, allTasks) {
            let parentTask = allTasks.find(x => x._id.toString() === currentTask.parent_id.toString());
            parentTask.childrens = parentTask.childrens || [];
            parentTask.childrens.push(currentTask);

            if (parentTask.parent_id) {
                parentTask = getTreeWithoutPromises(parentTask, allTasks);
            }

            return parentTask;
        }
    }
};


exports.get_task_by_id = (req, res, next) => {
    const id = req.params.taskId;
    var fullPathName = "";
    findElement(id, req, res, next);

    async function findElement(id, req, res, next) {
        var result = await Task.findById(id).exec()
        if (result) {
            fullPathName += result.name;
            if (result.parent_id) {
                return await findFullPathName(result.parent_id)
                    .then((fullPathName) => {
                        result._doc.fullPathName = fullPathName;
                        res.status(200).json(result);
                    });
            } else {
                result._doc.fullPathName = fullPathName;
                res.status(200).json(result);
            }
        } else {
            res.status(404).json({
                message: "Object not found!"
            });
        }
        return result;
    }

    async function findFullPathName(id) {
        var result = await Task.findById(id).exec()
        if (result) {
            if (result.parent_id) {
                fullPathName = result.name + "/" + fullPathName;
                return findFullPathName(result.parent_id);
            }
            return result.name + "/" + fullPathName
        } else {
            res.status(404).json({
                message: "Object not found!"
            });
        }
        return result;
    }

};




exports.create_task = (req, res, next) => {
    Task.find().exec().then(allTasks => {
        var maxId = allTasks.reduce((max, p) => p.task_id > max ? p.task_id : max, allTasks[0].task_id);
        createTask(maxId)
    }).catch(error => {
        // uses for the first create
        createTask();
    });

    function createTask(maxId) {
        const task = new Task({
            _id: mongoose.Types.ObjectId(),
            task_id: ++maxId || 1,
            name: req.body.name,
            description: req.body.description,
            parent_id: req.body.parent_id,
            children_ids: req.body.children_ids,
            user_id: req.body.user_id,
            column_id: req.body.column_id,
            status: req.body.status
        })

        task.save().then(result => {
            res.status(200).json({
                result: result
            })
        }).catch(error => {
            res.status(500).json({
                error: error
            })
        });
    }
};

exports.update_task = async (req, res, next) => {
    try {
        const id = req.params.taskId;
        const propertiesForUpdate = {};
        for (const prop in req.body) {
            propertiesForUpdate[prop] = req.body[prop];
        }

        if (propertiesForUpdate.status) {
            var currentTask = await Task.findById(id);
            var taskStateMachine = new TaskStateMachine(currentTask.status);
            taskStateMachine.setNewState(propertiesForUpdate.status);
            propertiesForUpdate.status = taskStateMachine.state;
            var columnForStatus = await BoardColumn.find().where({persistentName: taskStateMachine.state}).exec();
            propertiesForUpdate.column_id = columnForStatus[0].id;
        }

        var result = await Task.update({ _id: id }, { $set: propertiesForUpdate }).exec();
        res.status(200).json({updatedProperties: propertiesForUpdate});
    } catch (error) {
        next(error);
    }
};

exports.delete_task = async (req, res, next) => {
    const id = req.params.taskId;
    let result = await Task.findById(id).exec();
    await updateAllChildrens(result._id, result.parent_id, next)
    const deleteResult = await Task.remove({ _id: id }).exec()
    res.status(200).json(deleteResult)

    async function updateAllChildrens(currentId, parentId, next) {
        return await Task.find().where()
            .update({ 'parent_id': currentId }, { $set: { parent_id: parentId } }, { multi: true })
            .exec().catch(error => {
                next(error)
            });
    }
};