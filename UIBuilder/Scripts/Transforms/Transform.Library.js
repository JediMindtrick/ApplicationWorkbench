define([
	'Transforms/transformXmlToBase',
	'Transforms/transformGlobalModelToHtml',
	'Transforms/Transform.Utils'
	],function(toBase,toHtml){
	return [
		{name: 'transformXmlToBase', func: toBase},
		{name: 'transformGlobalModelToHtml', func: toHtml}
	];
});