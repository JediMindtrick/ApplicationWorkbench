define([
    'Lib/jquery',
    'Controls/Controls.Library',
    'Transforms/Transform.Library',
    'Editor.ViewModel-1'/*,
    'Lib/knockout'*/
], function ($,controlLib,transformLib,ViewModel/*,ko*/) {

	var _model = null;

	return function(){

	    console.log('Loaded Controls:')
	    for(var control in controlLib.controls){
	        if(controlLib.controls.hasOwnProperty(control)){
	            console.log('Loaded "' + control + '".');
	        }
	    }

	    console.log('Loaded Transforms will run in the following order:')
	    for(var i = 0, l = transformLib.length; i < l; i++){
	        console.log((i + 1) + ' "' + transformLib[i].name + '".');
	    }


	    var vm = new ViewModel();
/*	    ko.applyBindings(vm);
	    */

	};

});