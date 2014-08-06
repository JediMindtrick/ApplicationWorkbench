define([
    'Lib/jquery',
	'Editor.ViewModel-1',
    'Tester/Tester',
    'Lib/knockout',
    'Transforms/Transform.Library',
    'Tester/addTestingSupport',
    'Lib/ko.binding.codemirror',
    'Lib/jquery-ui-custom.min'
], function ($,vm,produceTest,ko,transforms,addTesting) {

    transforms.push(
        {name: 'addTestingSupport', func: addTesting}
    );

	vm.prototype.scenario = ko.observable('');
    vm.prototype.scenarioValidation = ko.observable('');
    vm.prototype.testSupportGen = ko.observable('');

	vm.prototype._preReset.push(function(self){

        self.scenario('');
        self.scenarioValidation('');
        self.testSupportGen('');		

        $('#btnTest').button('disable');        

	});

    vm.prototype._preRefresh.push(function(self){

        //we can only write tests if we have a model to write against...
        if(!self.model || !self.model[self.model.currentModule]){
            self.disabledTabs.push(self.extensions.tabsCrossReference.Write);
        }

        //we can only display test gen output if we have it...
        if(self.scenarioValidation() === ''){
            self.disabledTabs.push(self.extensions.tabsCrossReference['Test Out']);
        }

    });

    vm.prototype._postRefresh.push(function(self){

        //if no model, then we certainly cannot write a test...
        if(self.isModelLoaded()){
            $('#btnTest').button('enable');
        }else{
            $('#btnTest').button('disable');                
        }
    });

    //this is actual a generation-phase function, the transformation-phase function
    //is found in 'addTestingSupport.js'
    vm.prototype.loadTestIntoModel = function(source){
        var self = this;

        if(typeof source === 'string'){
            self.scenario(source);
        }

        self._loadTest();

        self.refresh();
    };

	vm.prototype._loadTest = function(){
		var self = this;

        console.log('');
        console.log('');
        console.log('PRODUCING TEST');

        if(self.model[self.model.currentModule] === null){

            alert('You must load a model before you can write any tests.');
            return;
        }
        if(self.scenario() === ''){
            alert('You must write a test before you can generate it.')
            return;
        }

        //update the current node               
        var _curr = self.model[self.model.currentModule];

        produceTest(_curr, self.scenario());        

        self.scenarioValidation(_curr.test.validatedTest);
        self.testSupportGen(_curr.test.generatedSupport);
        _curr.source = _curr.source || {};
        _curr.source.test = self.scenario();         
	};
});