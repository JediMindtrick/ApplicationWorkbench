define([
    'Lib/jquery',
    'Lib/knockout'
	],function($,ko){

        /*
modified from 
http://stackoverflow.com/questions/13375612/how-to-integrate-codemirror-into-knockoutjs
*/
    ko.bindingHandlers.codemirror = {

        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {

            var options = $.extend(valueAccessor(), {
                onChange: function(cm) {
                    allBindingsAccessor().value(cm.getValue());
                }
            });

            options.viewportMargin = Infinity;

            var editor = CodeMirror.fromTextArea(element, options);
            element.editor = editor;
            editor.setValue(allBindingsAccessor().value());
            editor.refresh();

            var wrapperElement = $(editor.getWrapperElement()); 
                
            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                wrapperElement.remove();
            });

//see analytics-dsl for example of resizable, which doesn't seem to work here
//a focus binding might need to be implemented through a custom binding, since 
//the hasfocus binding would be on the textarea...this causes problems when 
//trying to programmatically change the focus            

            CodeMirror.on(editor, "change", function(){
                    editor.isChanging = true;
                    allBindingsAccessor().value(editor.getValue());
                    editor.isChanging = false;                          
            });
        },
        update: function(element, valueAccessor, allBindingsAccessor) { 
            var editor = element.editor;
            if(!editor.isChanging){
                editor.setValue(allBindingsAccessor().value());
                editor.refresh();
            }
        } 
    };

    return {};
});