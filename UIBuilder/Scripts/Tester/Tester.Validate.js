define([
	'Lib/jquery'
	],function($){

	/*gets all sentences from the model that match a specific line of
	code.  can be used later for autocomplete support*/
	var _getMatches = function(globalModel,codeLine){
		var toReturn = [];

		//get all sentences that match the codeLine
		$.each(globalModel.test.sentences,function(idx,sentence){
			var _reg = new RegExp(sentence.dslRegex,'gi');
			if(_reg.test(codeLine)){
				toReturn.push(sentence);
			}
		});

		return toReturn;
	};

	/*checks written test code (spec) and tries to determine whether or not
	it's supported*/
	var _validate = function(globalModel,testCode){
		var toReturn = [];

		$.each(testCode.split('\n'),function(idx,line){
			var _matches = _getMatches(globalModel,line);

			toReturn.push({
				sentence: line,
				support: ( _matches.length === 0 ?
					'unsupported' : _matches.length === 1 ? 
					'supported' : 
					'ambiguous'
					),
				matched: _matches.length === 1 ?
					_matches[0] :
					'' 
			});
		});

		return toReturn;
	};

	return {
		validate: _validate,
		getMatches: _getMatches
	};
});