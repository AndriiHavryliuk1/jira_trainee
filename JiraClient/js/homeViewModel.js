

const homeViewModel = {
    url: ko.observable("index.html"),
    message: ko.observable("hjgkjhkl вную страницу")
};

let taskService = new TaskService();
let l = taskService.getAllTasks().then((response) => {
    console.log(response);
}, (error) => {
    console.log(error);
});
console.log(l);

 // ko.applyBindings(homeViewModel);



ko.bindingHandlers.treeView = {

    createNodes: function(rootElement, options){

        var rootTmpl = '<script id="ko-treeview-root-tmpl"><div class="navbar"><p class="brand" data-bind="text:$data.title">Title</p><div class="container"><form class="navbar-form pull-right col-sm-4"><div class="input-append"><input class="span4" type="text" placeholder="Search" data-bind="value:$data.search, valueUpdate: \'afterkeydown\'"/><span class="add-on"><i class="icon-search"></i></span></div></form></div></div><ul class="ko-treeview-list" data-bind="template:{foreach:$data.data,name:\'ko-treeview-node-tmpl\'}"></ul></script>';

        var nodeTmpl = '<script id="ko-treeview-node-tmpl"><li class="ko-treeview-listitem"><div data-bind="template:{name:\'ko-treeview-item-tmpl\',data:$data}"></div><ul class="ko-treeview-list" data-bind="template:{name:\'ko-treeview-node-tmpl\',foreach:$data[$root.childNode]}"></div></li></script>';

        var itemTmpl ='<script id="ko-treeview-item-tmpl"><div data-bind="visible:$data[$root.label].indexOf($root.search()) > -1"><input type="checkbox" class="ko-treeview-cb" data-bind="checked: $root.selected, attr:{value:$data[$root.label], id:$data[$root.label]}"  /><label  class="ko-treeview-label" data-bind="text:$data[$root.label], attr:{for:$data[$root.label]}"></label></div></script>'

        //append templates
        document.body.insertAdjacentHTML('beforeend', rootTmpl);
        document.body.insertAdjacentHTML('beforeend', nodeTmpl);
        document.body.insertAdjacentHTML('beforeend', itemTmpl);

        //apply first binding
        ko.applyBindingsToNode(rootElement, {template:{name:"ko-treeview-root-tmpl"}},options);

    },
    init: function(element, valueAccessor) {

        //style element
        element.className = "ko-treeview-container";

        //extend options with search
        var options = valueAccessor();
        options.search = ko.observable("");

        //set default data values
        if(!options.label) options.label = 'id';
        if(!options.childNode) options.childNode = 'children';

        //create the tree
        ko.bindingHandlers.treeView.createNodes(element,options);
        valueAccessor().data.subscribe(function(){
            ko.bindingHandlers.treeView.createNodes(element,options);
        });


        //let this handler control its descendants.
        return { controlsDescendantBindings: true };
    }

};

function vm(){
    this.selectedNodes = ko.observableArray([]);

    this.data = ko.observableArray([
        {
            id:"Level 1",
            children:[
                {id:"Level 1-1",children:[
                    {id:"Level 1-1-1",children:[
                        {id:"Level 1-1-1-1"}
                    ]}
                ]},
                {id:"Level 1-2"},
            ]
        },
        {
            id:"Level 2",
            children:[
                {id:"Level 2-1",children:[
                    {id:"Level 2-1-1"}
                ]},
                {id:"Level 2-2"},
            ]
        },

    ]);

}
var myVM = new vm();
ko.applyBindings(myVM);