define([
	'Lib/jquery',
	'Lib/heredoc'
	],function($,heredoc){

	var _firstNewline = /^\n/;
	var _newline = /\n$/;
	var _firstTab = /^\t/;
	var _trailingComma = /,$/;

	var _getAmbiguous = function(sentence,funcName){

		var toReturn = heredoc(function(){/*
//Ambiguous step
	//{code}
*/});
		toReturn = toReturn.replace(_firstNewline,'');
		toReturn = toReturn.replace(_firstTab,'');
		toReturn = toReturn.replace(_newline,'');

		toReturn = toReturn.replace(/\{code\}/gi,sentence.sentence);

		return toReturn;	

	};

	var _getUnsupported = function(sentence,funcName){

		var toReturn = heredoc(function(){/*
//Unsupported step
	//{code}
*/});
		toReturn = toReturn.replace(_firstNewline,'');
		toReturn = toReturn.replace(_firstTab,'');
		toReturn = toReturn.replace(_firstTab,'');
		toReturn = toReturn.replace(_newline,'');

		toReturn = toReturn.replace(/\{code\}/gi,sentence.sentence);

		return toReturn;	

	};

	var _getParamsList = function(sentence){
		var _params = sentence.matched.text.match(/param\d+/gi);

		var toReturn = '';

		$.each(_params,function(idx,param){
			toReturn = toReturn + param + ',';
		});

		toReturn = toReturn.replace(_trailingComma,'');

		return toReturn;
	};

	var _getSupported = function(sentence,funcName,paramsList){

		var toReturn = heredoc(function(){/*
[Given(@"{targetRegex}")]
	[When(@"{targetRegex}")]
	[Then(@"{targetRegex}")]
	[And(@"{targetRegex}")]
	public void {funcName}({paramsList}){
		//{code}
	}
*/});
		toReturn = toReturn.replace(_firstTab,'');
		toReturn = toReturn.replace(_newline,'');

		toReturn = toReturn.replace(/\{targetRegex\}/gi,sentence.matched.targetRegex);
		toReturn = toReturn.replace(/\{code\}/gi,sentence.sentence);
		toReturn = toReturn.replace(/\{funcName\}/gi,funcName);
		toReturn = toReturn.replace(/\{paramsList\}/gi,paramsList);

		return toReturn;	

	};

	var _getBodyStatements = function(){
		var toReturn = heredoc(function(){/*
	{bodyStatement}
	{bodyStatement}
*/});
		toReturn = toReturn.replace(_newline,'');

		return toReturn;	
	};
	var _getClassDef = function(){

	var toReturn = heredoc(function(){/*
//Generated Class
[Binding]
public class AutoGeneratedTestSupport {
	{bodyStatement}
}
*/});
		toReturn = toReturn.replace(_newline,'');

		return toReturn;
	};

	return function(globalModel,sentences){
		var toReturn = _getClassDef();

		$.each(globalModel.test.validatedSentences,function(idx,validatedSentence){

			toReturn = toReturn.replace(/\{bodyStatement\}/gi,_getBodyStatements());

			if(validatedSentence.support === 'supported'){
				//leave off the 'g' because we only want to replace the first one
				var _paramsList = _getParamsList(validatedSentence);
				toReturn = toReturn.replace(/\{bodyStatement\}/i, _getSupported(validatedSentence, 'helper' + idx, _paramsList) + '\n');
			}else if(validatedSentence.support === 'unsupported'){
				toReturn = toReturn.replace(/\{bodyStatement\}/i, _getUnsupported(validatedSentence, 'helper' + idx) + '\n');
			}else if(validatedSentence.support === 'ambiguous'){
				toReturn = toReturn.replace(/\{bodyStatement\}/i, _getAmbiguous(validatedSentence, 'helper' + idx) + '\n');
			}

		});

		toReturn = toReturn.replace(/\{bodyStatement\}/gi,'');

		return toReturn;
	};

});