let taskService = new TaskService();

// ko.applyBindings(homeViewModel);


ko.bindingHandlers.treeView = {

    createNodes: function (rootElement, options) {

        let rootTmpl = '<script id="ko-treeview-root-tmpl"><div class="column-header"><p class="brand" data-bind="text:$data.title"></p><div class="container"><form class="navbar-form pull-right col-sm-4"><div class="input-append"><input class="span4" type="text" placeholder="Search" data-bind="value:$data.search, valueUpdate: \'afterkeydown\'"/><span class="add-on"><i class="icon-search"></i></span></div></form></div></div><ul class="ko-treeview-list" data-bind="template:{foreach:$data.data,name:\'ko-treeview-node-tmpl\'}"></ul></script>';

        let nodeTmpl = '<script id="ko-treeview-node-tmpl"><li class="ko-treeview-listitem"><div data-bind="template:{name:\'ko-treeview-item-tmpl\',data:$data}"></div><ul class="ko-treeview-list" data-bind="template:{name:\'ko-treeview-node-tmpl\',foreach:$data[$root.childNode]}"></div></li></script>';

        let itemTmpl = '<script id="ko-treeview-item-tmpl"><div data-bind="visible:$data[$root.label].indexOf($root.search()) > -1, click: $root.onClickTaskFn" class="tree-view-task"><div data-bind="text:$data[$root.id]"></div><label  class="ko-treeview-label" data-bind="text:$data[$root.label], attr:{for:$data[$root.label]}"></label></div></script>'

        //append templates
        document.body.insertAdjacentHTML('beforeend', rootTmpl);
        document.body.insertAdjacentHTML('beforeend', nodeTmpl);
        document.body.insertAdjacentHTML('beforeend', itemTmpl);

        //apply first binding
        ko.applyBindingsToNode(rootElement, {template: {name: "ko-treeview-root-tmpl"}}, options);

    },
    init: function (element, valueAccessor, allBindings, viewModel) {
        //extend options with search
        let options = valueAccessor();
        options.search = ko.observable("");

        //set default data values
        options.label = 'name';
        options.childNode = 'childrens';
        options.id = "_id";
        options.onClickTaskFn = function(data) {
            viewModel.selectedNode(data);
            viewModel.showSelectedNode(true);
        };

        //create the tree
        ko.bindingHandlers.treeView.createNodes(element, options);
        let list = valueAccessor().data;
        list.subscribe(function () {
            ko.bindingHandlers.treeView.createNodes(element, options);
        });


        //let this handler control its descendants.
        return {controlsDescendantBindings: true};
    },

};

ko.bindingHandlers.htmlUrl = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        let value = ko.unwrap(valueAccessor());
        markupLoader.loadMarkup(element, value, bindingContext);
        return { controlsDescendantBindings: true };
    }
};

function ViewModelBoard() {
    let that = this;
    this.data = ko.observableArray([]);
    this.showSelectedNode = ko.observable(false);
    this.selectedNode = ko.observable({});
    this.data = ko.observableArray([]);
    taskService.getAllTasks().then((response) => {
        that.data(response);
    }, (error) => {
        console.log(error);
    });

}
let viewModelBoard = new ViewModelBoard();
ko.applyBindings(viewModelBoard);