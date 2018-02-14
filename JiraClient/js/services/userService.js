function UserService() {
    this.users = [];
}

UserService.prototype.getAllUsers = function() {
    return $.get(Constants.SERVER_URL + "users", function(response) {
        this.users = response;
        return response.promise;
    }.bind(this)).fail(function(error) {
        console.log(error);
    })
};