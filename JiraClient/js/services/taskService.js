function TaskService() {
    this.tasks = [];
    this.tasksTree = [];
}

TaskService.prototype.getAllTasks = function(forceUpdate) {
    if (this.tasks.length && !forceUpdate) {
        return Promise.resolve(this.tasks);
    }
    return $.get(Constants.SERVER_URL + "tasks", function(response) {
        this.tasks = response;
        return response;
    }.bind(this)).fail(function(error) {
        console.log(error);
    })
};

TaskService.prototype.getAllTreeTasks = function(forceUpdate) {
    if (this.tasksTree.length && !forceUpdate) {
        return Promise.resolve(this.tasksTree);
    }
    return $.get(Constants.SERVER_URL + "tasks/tree", function(response) {
        this.tasksTree = response;
        return response;
    }.bind(this)).fail(function(error) {
        console.log(error);
    })
};

TaskService.prototype.getTaskById = function(id) {
    return $.get(Constants.SERVER_URL + "tasks/" + id);
};

TaskService.prototype.updateTask = function(value) {
    return $.put(Constants.SERVER_URL + "tasks", value, function(response) {
        if (this.tasks.length) {
            this.tasks.push(response);
        }

        return response.promise;
    }.bind(this)).fail(function(error) {
        console.log(error);
    });
};

TaskService.prototype.createTask = function(value) {
    return $.post(Constants.SERVER_URL + "tasks", value, function(response) {
        delete response.result.__v;
        if (this.tasks.length) {
            this.tasks.push(response.result);
        }
        this.updateTaskTreeAfterCreate(response.result);

        return response.promise;
    }.bind(this)).fail(function(error) {
        console.log(error);
    });
};

TaskService.prototype.deleteTask = function(id) {
    return $.ajax({
        url: Constants.SERVER_URL + "tasks/" + id,
        type: 'DELETE',
        success: function(response) {
            return response.promise;
        }.bind(this)
    });
};

TaskService.prototype.deleteTaskWithChield = function(id) {
    return $.ajax({
        url: Constants.SERVER_URL + "tasks/" + id + "?deleteAllChilds=true",
        type: 'DELETE',
        success: function(response) {
            return response.promise;
        }.bind(this)
    });
};

TaskService.prototype.updateTaskTreeAfterCreate = function(createResult) {
    let that = this;
    if (!createResult.parent_id) {
        this.tasksTree.push(createResult);
    } else {
        updateTree(this.tasksTree);
    }

    function updateTree(children) {
        let parentIndex = children.findIndex(x => x._id === createResult.parent_id);
        if (parentIndex !== -1) {
            children[parentIndex].childrens = children[parentIndex].childrens || [];
            children[parentIndex].childrens.push(createResult);
        } else {
            children.forEach(child => {
                if (child.childrens && child.childrens.length) {
                    updateTree(child.childrens) ;
                }
            });
        }
    }
};

TaskService.prototype.updateTaskTreeAfterDelete = function(deletedId, deleteChields) {
    let that = this;
    updateTree(this.tasksTree);


    function updateTree(tasksTree) {
        let taskIndex = tasksTree.findIndex(x => x._id === deletedId);
        if (taskIndex !== -1) {
            if (deleteChields) {
                tasksTree.splice(taskIndex, 1);
            } else {
                let parentId = tasksTree[taskIndex].parent_id;
                tasksTree.childrens.forEach(child => {
                    if (child.childrens && child.childrens.length) {
                        updateTree(child.childrens) ;
                    }
                });
            }
        } else {
            tasksTree.forEach(child => {
                if (child.childrens && child.childrens.length) {
                    updateTree(child.childrens) ;
                }
            });
        }
    }
};