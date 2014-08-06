define([
	'Controls/Controls.Base'
	],function(Controls){

	var controls = Controls.controls;
	var koBindGen = Controls.koDataBindGen;
	var commonGen = Controls.commonGen;

	controls['Text Input Set'] = {

		UI: {
			render: function(node){
                var ctrl = node.balsamiq.raw;
				var toReturn = $('<input style="float:right; text-align:right;" type="text" />');

		        commonGen(node,toReturn);

		        koBindGen(node,toReturn);

		        node.balsamiq.customID = $(ctrl).find('[controlID=1] text').text();
		        $(toReturn).attr('id',node.balsamiq.customID);

		        return $('<div>').append(toReturn).html();
			}
		},
		Test: {
			getSentences: function(node){
				var toReturn = [];
				var _id = node.balsamiq.customID;

				/*
				example of a working regex match:
				'I foo for bar'.match(new RegExp('I (\\S+) for (\\S+)'));
				returns
				["I foo for bar", "foo", "bar"]

				here's a different method:
				'I enter "param1" and "param2"'.match(/"param\d+"/gi);
				[""param1"", ""param2""]
				*/
				toReturn.push({
					text: 'I enter a value of param1 for ' + _id,
					selector: '#' + _id,
					dslRegex: '(given|when|then|and|but|or) I enter a value of (\\S+) for ' + _id,
					/*Note: this last type of regex should be extracted out into their own separate file
					and should be 'monkeky-patched' onto a config object.  so refactor steps are:
					1. extract getSentences configs into a separate object
					2. expose that object as part of this module
					3. create a separate file called something like 
						'Tester.Support.CSharpSpecflow.TargetRegexes.js
					4. manipulate the config objects created in #1 in this file
					5. use the file :)*/
					targetRegex: "I enter a value of '(\\S+)' for " + _id
					/*assert-oriented field should go here.  likely we can re-use
					the expression language developed for Analytics-DSL*/
				});
				toReturn.push({
					text: _id + ' should be param1',
					selector: '#' + _id,
					dslRegex: '(given|when|then|and|but|or) ' + _id + ' should be "(\\S+)"',
					targetRegex: _id + " should be '(\\S+)'"
				});
				toReturn.push({
					text: _id + ' should not be param1',
					selector: '#' + _id,
					dslRegex: '(given|when|then|and|but|or) ' + _id + ' should not be "(\\S+)"',
					targetRegex: _id + " should not be '(\\S+)'"
				});

				return toReturn;
			}
		}
	};
});