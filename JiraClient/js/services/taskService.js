function TaskService() {
    this.tasks = [];
    this.tasksTree = [];
}

TaskService.prototype.getAllTasks = function() {
    if (this.tasks.length) {
        return Promise.resolve(this.tasks);
    }
    return $.get(Constants.SERVER_URL + "tasks", function(response) {
        this.tasks = response;
        return response;
    }.bind(this)).fail(function(error) {
        console.log(error);
    })
};

TaskService.prototype.getAllTreeTasks = function() {
    if (this.tasksTree.length) {
        return Promise.resolve(this.tasksTree);
    }
    return $.get(Constants.SERVER_URL + "tasks/tree", function(response) {
        this.tasksTree = response;
        return response;
    }.bind(this)).fail(function(error) {
        console.log(error);
    })
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