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

    taskService.getAllTasks().then((response) => {
        that.availableParents = ko.observableArray(response);
        that.showAvailableParents(true);
    }, (error) => {
        console.log(error);
    });

    taskService.getAllTreeTasks().then((response) => {
        that.data(response);
    }, (error) => {
        console.log(error);
    });

    userService.getAllUsers().then((res) => {
        that.availableUsers = ko.observableArray(res);
        that.showAvailableUser(true);
    });


    this.data = ko.observableArray([]);
    this.showSelectedNode = ko.observable(false);
    this.selectedNode = ko.observable({});
    this.data = ko.observableArray([]);
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


    this.createNewTask = function () {
        taskService.createTask(ko.toJS(this.newTask)).then(() => console.log("success"), () => console.log("error"))
        $('#myModal').modal('hide');
        that.newTask = {
            name: ko.observable(""),
            description: ko.observable(""),
            status: ko.observable(""),
            user_id: ko.observable(null),
            parent_id: ko.observable(null),
            column_id: ko.observable(null),
            type: ko.observable(null)
        };
    };

}
ko.applyBindings(new ViewModelMain(), document.getElementById('main-vm'));