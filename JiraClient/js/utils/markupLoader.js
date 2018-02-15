markupLoader = {
    templateDictionary: {},
    loadMarkup: function (element, value, bindingContext) {
        if (!this.templateDictionary[value]) {
            this.templateDictionary[value] = $.get(value);
        }
        this.templateDictionary[value].done(function (template) {
            $(element).html(template);
            $(element).children().each(function (index, child) {
                ko.applyBindings(bindingContext, child);
            });
        });
    }
};


ko.bindingHandlers.htmlUrl = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        let value = ko.unwrap(valueAccessor());
        markupLoader.loadMarkup(element, value, bindingContext);
        return {controlsDescendantBindings: true};
    }
};