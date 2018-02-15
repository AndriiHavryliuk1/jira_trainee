function TaskService() {
    this.tasks = [];
    this.tasksTree = [];
}

TaskService.prototype.getAllTasks = function() {
    return $.get(Constants.SERVER_URL + "tasks", function(response) {
        return response.promise;
    }).fail(function(error) {
        console.log(error);
    })
};

TaskService.prototype.getAllTreeTasks = function() {
    return $.get(Constants.SERVER_URL + "tasks/tree", function(response) {
        return response.promise;
    }).fail(function(error) {
        console.log(error);
    })
};

TaskService.prototype.updateTask = function(value) {
    return $.put(Constants.SERVER_URL + "tasks", value, function(response) {
        return response.promise;
    }).fail(function(error) {
        console.log(error);
    })
};

TaskService.prototype.createTask = function(value) {
    return $.post(Constants.SERVER_URL + "tasks", value, function(response) {
        return response.promise;
    }).fail(function(error) {
        console.log(error);
    })
};