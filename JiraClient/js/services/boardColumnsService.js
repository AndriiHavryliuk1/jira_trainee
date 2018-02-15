class BoardColumnsService {
    constructor() {
        this.boardColumns = [];
    }

    getColumns() {
        if (!this.boardColumns.length) {
            this.boardColumns = $.get(Constants.SERVER_URL + "boardColumns", function (response) {
                this.boardColumns = response;
                return response.promise;
            }.bind(this)).fail(function (error) {
                console.log(error);
            })
        }

        return this.boardColumns;
    }
}
