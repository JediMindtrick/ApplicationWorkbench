define([
	'Controls/Controls.Base'
	],function(Controls){

	var controls = Controls.controls;
	var koBindGen = Controls.koDataBindGen;
	var commonGen = Controls.commonGen;

	controls['Plugin Container'] = {
		UI: {
			render: function(node){
                var ctrl = node.balsamiq.raw;
				var toReturn = $('<div>');

		        commonGen(node,toReturn);

		        koBindGen(node,toReturn);

				return $('<div>').append(toReturn).html();
			}
		}
	};
	
});