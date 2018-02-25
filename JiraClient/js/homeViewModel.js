let taskService = new TaskService();
let userService = new UserService();
let boardColumnsService = new BoardColumnsService();


function ViewModelMain() {
    let that = this;

    boardColumnsService.getColumns().then((res) => {
        this.availableColumns = ko.observableArray(res);
        that.showAvailableColumns = ko.observable(true);
    }, (error) => {
        console.log(error);
    });

    userService.getAllUsers().then((res) => {
        that.availableUsers = ko.observableArray(res);
        that.showAvailableUser(true);
    });

    this.initTasks();


    this.data = ko.observableArray([]);
    this.showSelectedNode = ko.observable(false);
    this.selectedNode = ko.observable({});
    this.data = ko.observableArray([]);
    this.availableParents = ko.observableArray([]);
    this.searchTickets = ko.observable("");
    this.showAvailableUser = ko.observable(false);
    this.showAvailableParents = ko.observable(false);

    this.showCreateNewTask = ko.observable(false);


    this.newTask = {
        name: ko.observable(""),
        description: ko.observable(""),
        status: ko.observable(""),
        user_id: ko.observable(null),
        parent_id: ko.observable(null),
        column_id: ko.observable(null),
        type: ko.observable(null)
    };

}

ViewModelMain.prototype.createNewTask = function() {
    let that = this;
    taskService.createTask(ko.toJS(this.newTask)).then(() => { that.initTasks(true); }, () => console.log("error"));
    this.newTask.name("");
    this.newTask.description("");
    this.newTask.status("");
    this.newTask.user_id(null);
    this.newTask.parent_id(null);
    this.newTask.column_id(null);
    this.newTask.type(null);
    $('#myModal').modal('hide');
};

ViewModelMain.prototype.initTasks = function (forceUpdate) {
    let allTaskPromise = taskService.getAllTasks(forceUpdate);
    let allTreeTaskPromise = taskService.getAllTreeTasks(forceUpdate);
    return Promise.all([allTaskPromise, allTreeTaskPromise]).then(values => {
        this.availableParents(values[0]);
        this.showAvailableParents(true);
        this.data(values[1]);
        return Promise.resolve();
    }, (error) => console.log(error));
};

ViewModelMain.prototype.deleteTask = function() {
    const id = this.selectedNode()._id;
    taskService.deleteTask(id).then(() => {
        this.initTasks(true).then(() => {
            this.showSelectedNode(false);
        });
    });
};

ko.applyBindings(new ViewModelMain(), document.getElementById('main-vm'));