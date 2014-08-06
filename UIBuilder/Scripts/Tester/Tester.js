define([
	'Tester/Tester.Validate',
	'Tester/Tester.Support.CSharpSpecflow'
	],function(validateLib,generateSupport){

	var validate = validateLib.validate;

	var produceOutput = function(globalModel,testText){
		globalModel.test.code = testText;

		for(var prop in globalModel.test.sentences){
			console.log(globalModel.test.sentences[prop].text);
		}

		//validate sentences
		var _validatedSentences = validate(globalModel,testText);
		globalModel.test.validatedSentences = _validatedSentences;
		var validated = '#This is generated test code';
		$.each(_validatedSentences,function(idx,sentence){
			validated = validated + '\n' + sentence.sentence + ' #' + sentence.support;
		});
		globalModel.test.validatedTest = validated;

		//generate support code
		var _support = generateSupport(globalModel,_validatedSentences);
		globalModel.test.generatedSupport = _support;

		return globalModel;
	};

	return produceOutput;
});