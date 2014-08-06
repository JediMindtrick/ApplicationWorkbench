define([
	'Lib/jquery',
    'Controls/Controls.Library'
	],function($,util){

	var getType = util.determineType;
	var controls = util.controls;

	var addTesting = function(globalModel){
		/*this is where the final transform output will go*/
		globalModel.test = {
			sentences: []
		};

		$.each(globalModel.nodes,function(idx,node){

			var _type = getType(node);
			node.test = {};

			if(controls[_type].Test && controls[_type].Test.getSentences){
	          	node.test.sentences = controls[_type].Test.getSentences(node);
	          	//always need a ref to global ID
	          	$.each(node.test.sentences,function(i,sentence){
	          		sentence.ID = node.globalID;
	          	});
			}

			//add non-duplicate sentences to global test sentence
			//hash-map
			if(node.test.sentences && node.test.sentences.length > 0){
				$.each(node.test.sentences,function(i,sentence){
					globalModel.test.sentences.push(sentence);
				});
			}
		});

		//console.log(JSON.stringify(globalModel.test.sentences));

		return globalModel;
	};

	return addTesting;
});