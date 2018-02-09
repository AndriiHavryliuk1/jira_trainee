const StateMachine = require('javascript-state-machine');


class TaskStateMachine {
    constructor(currentState) {
        this.taskStateMachine = null;
        this.currentState = currentState
    }

    init() {
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
        this.taskStateMachine.init();
    }
}