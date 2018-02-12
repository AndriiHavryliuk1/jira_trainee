const StateMachine = require('javascript-state-machine');


class TaskStateMachine {
    constructor(currentState) {
        this.currentState = currentState || "To_Do";
        this.taskStateMachine = new StateMachine({
            init: this.currentState,
            transitions: [
                { name: 'startDoing', from: 'To_Do', to: 'In_Progress' },
                { name: 'toClarification', from: 'To_Do', to: 'On_Hold' },
                { name: 'toClarification', from: 'In_Progress', to: 'On_Hold' },
                { name: 'toForReview', from: 'In_Progress', to: 'For_Review' },
                { name: 'toInReview', from: 'In_Progress', to: 'In_Review' },
                { name: 'toDone', from: 'To_Do', to: 'Done' },
                { name: 'toDone', from: 'On_Hold', to: 'Done' },
                { name: 'toDone', from: 'In_Progress', to: 'Done' },
                { name: 'toDone', from: 'In_Review', to: 'Done' },
                { name: 'reject', from: ['In_Progress', 'On_Hold', 'For_Review', 'In_Review', 'Done'], to: 'To_Do' }
            ],
            methods: {
                onStartDoing: function () { console.log('I startDoing') },
                onToClarification: function () { console.log('I toClarification') },
                onToForReview: function () { console.log('I toForReview') },
                onToInReview: function () { console.log('I toInReview') },
                onToDone: function () { console.log('I toDone') },
                onReject: function () { console.log('I reject') }
            }
        });
    }

    get stateMachine() {
        return this.taskStateMachine;
    }

    get state() {
        return this.taskStateMachine.state;
    }

    setNewState(newTransactionName) {
        switch (newTransactionName) {
            case 'startDoing':
                this.taskStateMachine.startDoing();
                break;
            case 'toClarification':
                this.taskStateMachine.toClarification();
                break;
            case 'toForReview':
                this.taskStateMachine.toForReview();
                break;
            case 'toInReview':
                this.taskStateMachine.toInReview();
                break;
            case 'toDone':
                this.taskStateMachine.toDone();
                break;
            case 'reject':
                this.taskStateMachine.reject();
                break;
            default:
                this.taskStateMachine.reject();

        }
    }
}

module.exports = TaskStateMachine;