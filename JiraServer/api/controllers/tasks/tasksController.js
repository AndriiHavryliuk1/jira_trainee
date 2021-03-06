'use strict';

const Task = require('../../models/task');
const BoardColumn = require('../../models/boardColumn');
const TaskStateMachine = require('./taskStateMachine');
const mongoose = require('mongoose');
const Promise = require('bluebird');

exports.get_all_tasks = (req, res, next) => {
    Task.find().select('_id task_id name description parent_id user_id column_id status type').exec().then(result => { res.status(200).json(result); }, error => { next(error); });
};

exports.get_all_tasks_with_childs = (req, res, next) => {
    buildTreeWithPromisesUpToDown(false).then(result => { res.status(200).json(result); })
};

exports.get_all_tasks_tree = (req, res, next) => {
    buildTreeWithPromisesUpToDown(true).then(result => { res.status(200).json(result); })
};

async function buildTreeWithPromisesUpToDown(treeOnly) {
    let roots = null;
    if (!treeOnly) {
        roots = await Task.find().select('_id task_id name description parent_id user_id column_id status type').exec();
    } else {
        roots = await Task.find().select('_id task_id name description parent_id user_id column_id status type')
            .where({ 'parent_id': null }).exec();
    }
    for (let i = 0; i < roots.length; i++) {
        roots[i]._doc.childrens = [];
        roots[i]._doc.childrens = await getTreeWithPromises(roots[i]);
    }

    async function getTreeWithPromises(parent) {
        let childrens = await Task.find().select('_id task_id name description parent_id user_id column_id status type')
            .where({ 'parent_id': parent._id }).exec();
        parent._doc.childrens = childrens;
        for (let i = 0; i < parent._doc.childrens.length; i++) {
            parent._doc.childrens[i].childrens = [];
            parent._doc.childrens[i].childrens = await getTreeWithPromises(parent._doc.childrens[i]);
        }

        return childrens;
    }
    return roots;
}



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
            parent_id: req.body.parent_id ? req.body.parent_id : null,
            children_ids: req.body.children_ids,
            user_id: req.body.user_id ? req.body.user_id : null,
            column_id: req.body.column_id ? req.body.column_id : null,
            status: req.body.status,
            type: req.body.type
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
            var columnForStatus = await BoardColumn.find().where({ persistentName: taskStateMachine.state }).exec();
            propertiesForUpdate.column_id = columnForStatus[0].id;
        }

        var result = await Task.update({ _id: id }, { $set: propertiesForUpdate }).exec();
        res.status(200).json({ updatedProperties: propertiesForUpdate });
    } catch (error) {
        next(error);
    }
};

exports.delete_task = (req, res, next) => {
    const id = req.params.taskId;

    let preDeletePromise = Promise;

    if (req.query.deleteAllChilds === "true") {
        preDeletePromise = deleteAllChildrens(id, next);
    } else {
        Task.findById(id).exec().then((result) => {
            preDeletePromise = updateAllChildrens(result._id, result.parent_id, next);
        });
    }

    preDeletePromise.then(() => {
        Task.remove({ _id: id }).exec().then(() => {
            res.status(200).json({ id: id, massage: "Deleted success!" });
        });
    })

    function updateAllChildrens(currentId, parentId, next) {
        return Task.find().where()
            .update({ 'parent_id': currentId }, { $set: { parent_id: parentId } }, { multi: true })
            .exec().catch(error => {
                next(error)
            });
    }

    function deleteAllChildrens(currentId, next) {
        return Task.find().where({ parent_id: currentId }).exec().then((childrens) => {
            if (childrens.length) {
                childrens.forEach(async child => {
                    return deleteAllChildrens(child._id, next);
                });
                return Task.remove({ _id: { $in: childrens.map(child => child._id) } }).exec().catch(error => next(error));
            }
        });
    }
};