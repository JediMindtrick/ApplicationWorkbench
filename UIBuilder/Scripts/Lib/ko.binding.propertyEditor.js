//This is a knockout binder and example code that creates a 
//"property editor" type of widget.  The widget iterates all of the properties
//of a pojo (not an observable object, just 'plain old javascript object') 
//and creates ui labels and inputs and provides two-way binding between the 
//ui and the pojo.

/*
<!--
    <div id="propertyEditor" style="float: right; width:18%; height: 820px; margin-left:0px; border: solid thin black;">
        <button data-bind="click: displayControls">Display</button>
        <select data-bind="options: controls, value: currentControl"></select>
        <div  data-bind="propertyEditor: null, value: activeProps">
        </div>
    </div>    
-->

*/


            var getUpdateFunc = function(val,prop){

                return function(){
                    $('[data-prop=' + prop + ']').change(function(){
                        var newVal = $('[data-prop=' + prop + ']').val();
                        val[prop] = newVal;
                    });
                };
            };



            ko.bindingHandlers.propertyEditor = {
                init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                    var val = allBindingsAccessor().value();

                    $(element).find('input').unbind('change');
                    $(element).html('');

                    for(var property in val){
                        if(val.hasOwnProperty(property)){
                            var propEdit = $('<div>');
                            $(propEdit).append('<label>' + property + '</label>'
                                + '<input data-prop="' + property + '" type="text" value="' + val[property] + '" />'
                            );

                            $(element).append(propEdit);

                            getUpdateFunc(val,property)();                            
                        }
                    }
                },
                update: function(element, valueAccessor, allBindingsAccessor) { 
                    var val = typeof allBindingsAccessor().value === 'object' ?   allBindingsAccessor().value
                        : allBindingsAccessor().value();

                    $(element).find('input').unbind('change');
                    $(element).html('');

                    for(var property in val){
                        if(val.hasOwnProperty(property)){
                            var propEdit = $('<div>');

                            $(propEdit).append('<label>' + property + '</label>'
                                + '<input data-prop="' + property + '" type="text" value="' + val[property] + '" />'
                            );

                            $(element).append(propEdit);

                            getUpdateFunc(val,property)();
                        }
                    }

                }
            };

            var propEditor = function(controls){
                var self = this;

                this.ctrl = controls;

                var propArray = [];
                for(var prop in controls){
                    if(controls.hasOwnProperty(prop)){
                        propArray.push(prop);
                    }
                }

                this.controls = ko.observableArray(propArray);
                this.currentControl = ko.observable(propArray[0]);

                this.activeProps = ko.observable(controls[propArray[0]].EditableProps);

                this.currentControl.subscribe(function(newValue){
                    self.activeProps(controls[newValue].EditableProps);
                });

                this.displayControls = function(){
                    console.log(JSON.stringify(self.ctrl));
                };
            };

            var editableProps = {
                Ctrl1: {
                    EditableProps:{
                        Prop1:5,
                        Prop2:'hello'
                    }
                },
                Ctrl2: {
                    EditableProps:{
                        Prop3:'yogi',
                        Prop4:true
                    }
                }
            };

            var editor = new propEditor(editableProps);

            ko.applyBindings(editor);
