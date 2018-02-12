function TaskService() {
    this.tasks = [];
    this.tasksTree = [];
}

TaskService.prototype.getAllTreeTasks = function() {
    return $.get(Constants.SERVER_URL + "tasks", function(response) {
        return response.promise;
    }).fail(function(error) {
        console.log(error);
    })
};

TaskService.prototype.getAllTasks = function() {
    return $.get(Constants.SERVER_URL + "tasks?getTree=true", function(response) {
        return response.promise;
    }).fail(function(error) {
        console.log(error);
    })
};