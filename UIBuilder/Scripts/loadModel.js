define([
    'Lib/jquery',
    'Transforms/Transform.Library'
	],function($,transforms){

/*get everything from balsamiq that we are interested in working with
AND then send it through the transformation pipeline*/
    var _processXml = function(x){
        var globalModel = {
            ui: {},
            nodes: []
        };

        //first step is always base transformation
        $(x).find('control').each(function(idx,ctrl){

            var toAdd = transforms[0].func(ctrl,globalModel);

            globalModel.nodes.push(toAdd);
        });

        //all other transforms in sequence
        for(var i = 1, l = transforms.length; i < l; i++){
            try{
                globalModel = transforms[i].func(globalModel);

            }catch(err){
                console.error('transform "' + transforms[i].name + 'failed with "' + err + '"');
                continue;
            }
        }

        return globalModel;
    };

    return _processXml;
});