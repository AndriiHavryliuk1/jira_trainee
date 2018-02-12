class Task {
    constructor(id, task_id, name, description, parent_id, user_id, column_id, status) {
        this.id = id;
        this.task_id = task_id;
        this.name = name;
        this.description = description;
        this.parent_id = parent_id;
        this.user_id = user_id;
        this.column_id = column_id;
        this.status = status;
    }

}

export default Task;