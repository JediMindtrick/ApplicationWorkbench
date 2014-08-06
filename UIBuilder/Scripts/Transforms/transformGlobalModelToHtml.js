define([
    'Lib/jquery',
	'Transforms/LayoutRectangle',
    'Controls/Controls.Library',
    'Transforms/Transform.Utils'
	],function($,Rectangle,controlsModule){

    var controls = controlsModule.controls;

    var transformModelToHtml = function(globalModel){

    	if(typeof globalModel.ui === 'undefined'){
    		globalModel.ui = {};
    	}

        var toReturnHtml = 'ERROR';

        var containerEl = $('<div x="0" y="0" w="10000" h="10000"></div>');

        $.each(globalModel.nodes,function(idx,node){
             var _toAppend = '';

            var _type = controlsModule.determineType(node);

            console.log('detected "' + _type + '" control.')

            if(typeof controls[_type] === 'undefined'){                
                console.error('Unable to find control "' + _type + '"');
                console.error('Original xml: ');
                console.error($.XmlToStr(node.balsamiq.raw));
                return;
            }            

            if(typeof controls[_type].UI === 'undefined'
                || typeof controls[_type].UI.render === 'undefined'){
                console.error('Unable to render control "' + _type + '"');
                return;
            }

            _toAppend = controls[_type].UI.render(node);

            _addElement(node,containerEl,_toAppend);
        });

        $(containerEl).find('[x]').removeAttr('x');
        $(containerEl).find('[y]').removeAttr('y');
        $(containerEl).find('[w]').removeAttr('w');
        $(containerEl).find('[h]').removeAttr('h');
        $(containerEl).find('[measuredH]').removeAttr('measuredH');
        $(containerEl).find('[measuredW]').removeAttr('measuredW');

        toReturnHtml = $(containerEl).html();

        globalModel.ui.html = toReturnHtml;

        return globalModel;
    };

    var _addElement = function(node,top,newEl){
        var found = false;

        //null case
        if(!found && $(top).children('*').length < 1){
            $(top).append(newEl);
            found = true;
            return;
        }

        var topRectangle = new Rectangle(top);
        var newRectangle = new Rectangle($(newEl));

        var escapeNestingLoop = false;
        //first look for nesting
        if(!found){
            $(top).children('*').each(function(idx,ctrl){

                var currRectangle = new Rectangle(ctrl);
                var isWithin = newRectangle.isWithin(currRectangle); 
                if(isWithin && !escapeNestingLoop){
                    escapeNestingLoop = true;
                    found = true;
                    return _addElement(node,ctrl,newEl);
                }

            });                
        }                                 

        //second look for ordering
        var escapeOrderingLoop = false;
        if(!found){

            var arr = $(top).children('*');
            
            for(var i = 0, l = arr.length; i < l; i++){
                var ctrl = arr[i];
                var currRectangle = new Rectangle(ctrl);
                var nextRectangle =
                    i + 1 < arr.length ?
                    new Rectangle(arr[i+1]) :
                    null;

                if(newRectangle.isAfter(currRectangle)){
                    //case end of list, append
                    if(i >= arr.length){
                        $(top).append(newEl);
                        found = true;
                        escapeOrderingLoop = true;
                        return;

                    //case before next, insert
                    }else if(nextRectangle !== null && 
                        newRectangle.isBefore(nextRectangle)){

                        $(newEl).insertAfter(ctrl);
                        found = true;
                        escapeOrderingLoop = true;
                        return;

                    //case after next, continue
                    }else if(nextRectangle !== null && 
                        newRectangle.isAfter(nextRectangle)){

                        continue;
                    }
                //if before, insert before
                }else if(newRectangle.isBefore(currRectangle)){
                    $(newEl).insertBefore(ctrl);
                    found = true;
                    escapeOrderingLoop = true;

                    return;
                }
                
            }

            //case newEl is the first one to be added
            if(!found){
                $(top).append(newEl);
                found = true;
                escapeOrderingLoop = true;
                return;
            }                
        }            
    };

    return transformModelToHtml;
});