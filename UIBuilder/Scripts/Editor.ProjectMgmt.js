define([	
    'Lib/knockout',
	'Editor.ViewModel-1',
    'Lib/jquery'
], function (ko,vm,$) {


	var _get = function(url,onSuccess){

		$.ajax({
			async: false,
			type: "GET",
			contentType: "application/json",
			dataType: "json",
			url: url,
			success: function(data, textStatus, jqXHR){
				
				if(onSuccess){
					onSuccess(data,textStatus,jqXHR);
				}	
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.error(errorThrown);
			}
		});

	};

	vm.prototype._postInit.push(function(self){

	    _get('/Projects/' + self.currentProject() +'/ProjectFiles/project.json',
	    	function(projectFile, textStatus, jqXHR){

				self.projectFile = projectFile;
				console.log('');
				console.log('');
				console.log("PROJECT LOADED");
				console.log(JSON.stringify(self.projectFile));
    	});

    	_get('/Projects/' + self.currentProject() + '/ProjectFiles/globalModel.json',
    		function(globalModel, textStatus, jqXHR){

				console.log('');
				console.log('');
				console.log("GLOBAL MODEL LOADED");

				self.model = globalModel;

				_addModules(self,globalModel);

				if(globalModel.currentModule){
					self.loadCurrentModule(globalModel.currentModule);
					self.currentModule(globalModel.currentModule);
				}
   		});

   		self.currentModule.subscribe(function(newValue) {
   			if(newValue === 'New...'){
   				self.model.currentModule = '';
   				self.reset();
   				return;
   			}

		    self.loadCurrentModule(newValue);
		});
	});

	vm.prototype.loadCurrentModule = function(name){
		var self = this;

		var _currentModule = self.model[name];

		if(_currentModule){

			self.reset();

			self.balsamiqName(_currentModule.source.balsamiqName);
        	self.balsamiqCode(_currentModule.source.balsamiq);
        	self.htmlGen(_currentModule.ui.html);

        	if(_currentModule.test){

	        	if(_currentModule.test.code){
		        	self.scenario(_currentModule.test.code);
	        	}
	        	if(_currentModule.test.validatedTest){
		        	self.scenarioValidation(_currentModule.test.validatedTest);
	        	}
	        	if(_currentModule.test.generatedSupport){
		        	self.testSupportGen(_currentModule.test.generatedSupport);
	        	}
        	}

			if(_currentModule.source && _currentModule.source.balsamiq){
				self.loadBalsamiqIntoModel(_currentModule.source.balsamiq,_currentModule.source.balsamiqName);
			}

			if(_currentModule.source && _currentModule.source.test){
				self.loadTestIntoModel(_currentModule.source.test);
			}

			if(_currentModule.source && _currentModule.source.balsamiqName){
				self.currentModule(_currentModule.source.balsamiqName);
			}					
		}

		self.runHooks(self._postModuleLoad,'_postModuleLoad');

		self.refresh();
	};

	vm.prototype._postModuleLoad = [];

	var _addModules = function(self,globalModel){
		for(var property in globalModel){
			if(property !== 'currentModule'){
				self.moduleList.push(property);
			}
		}
	};

	vm.prototype.moduleList = ko.observableArray(['New...']);
	vm.prototype.currentModule = ko.observable('');

	vm.prototype.publish = function(){
		var self = this;

		console.log('');
		console.log('');
		console.log('PUBLISHING MODEL');

		$.ajax({
			async: false,
			type: "POST",
			contentType: "application/json",
			dataType: "json",
			url: '/Projects/' + self.currentProject(),
			data: JSON.stringify(self.projectFile),
			success: function(data, textStatus, jqXHR){
				console.log(JSON.stringify(data),undefined, 2);
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.error(errorThrown);
			}
		});

		$.ajax({
			async: false,
			type: "POST",
			contentType: "application/json",
			dataType: "json",
			url: '/Projects/' + self.currentProject() + '/Model',
			data: JSON.stringify(self.model),
			success: function(data, textStatus, jqXHR){
				console.log(JSON.stringify(data),undefined, 2);
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.error(errorThrown);
			}
		});

		self.runHooks(self._postPublish,'_postPublish');
		
	};

	vm.prototype._postPublish = [];

});