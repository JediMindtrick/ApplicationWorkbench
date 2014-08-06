define([	
    'Lib/knockout',
	'Editor.ViewModel-1',
    'Lib/jquery',
    'Lib/knockout.mapping',
    'Lib/mustache',
    'TemplateLoader'
], function (ko,vm,$,mapping,mustache,ensureTemplates) {
	var useCaseTemplate = '';

	ensureTemplates([
        {name:'basicUseCase',type:'mustache/html'}
        ],function(){

        useCaseTemplate = $('#basicUseCase').text();
    });

	ko.mapping = mapping;
	vm.prototype.useCases = ko.observableArray();

	vm.prototype._preBind.push(function(self){
		self.documentLocation = ko.computed(function(){
			var toReturn = '';

			toReturn = window.location.origin +  
				'/Projects/' + self.currentProject() + '/' + 
				self.balsamiqName() + '.html';

			return toReturn;
		});
	});

	var _ID_Counter = 0;
	var _blankUseCase = {
		ID: null,
		Description: '',
		CSR: false,
		Counselor: false,
		Advisor: false,
		Manager: false	
	};

	var UseCase = function(opts){

		for(var prop in _blankUseCase){

			this[prop] = !opts || typeof opts[prop] === 'undefined' ?
				_blankUseCase[prop] :
				opts[prop];

		}

		if(typeof this.ID === 'undefined' || this.ID === null){

			_ID_Counter++;
			this.ID = _ID_Counter;
		}else if(this.ID > _ID_Counter){
			_ID_Counter = this.ID;
		}
	};

	vm.prototype.newUseCase = function(opts){
		var self = this;
		var toPush = new UseCase(opts);


		toPush = ko.mapping.fromJS(toPush);

		for(var prop in toPush){
			if(toPush[prop].subscribe){
				toPush[prop].subscribe(function(newValue){
					self._updateGlobalModelWithUseCase();
				});				
			}
		}		

		this.useCases.push(toPush);
	};

	vm.prototype._updateGlobalModelWithUseCase = function(){
		var self = this;

		var _model = self.getCurrentModule();
		if(_model !== null){
			_model['use-cases'] = self._serializeUseCases();
		}
	};

	vm.prototype._serializeUseCases = function(){
		var self = this;

		return ko.mapping.toJS(self.useCases);
	};

	vm.prototype._postReset.push(function(self){
		//reset
		self.useCases([]);
		_ID_Counter = 0;
	});

	vm.prototype._postModuleLoad.push(function(self){
		//reset
		self.useCases([]);
		_ID_Counter = 0;

		var _model = self.getCurrentModule();
		var _useCases = null;

		if(_model !== null){
			_useCases = _model['use-cases'];
		}

		if(typeof _useCases !== 'undefined' && _useCases !== null && _useCases.length > 0){
			for(var i = 0, l = _useCases.length; i < l; i++){
				self.newUseCase(_useCases[i]);
			}
		}
	});

	vm.prototype._postPublish.push(function(self){

		var _toRender = {
			useCases: [],
			componentName: './' + self.model.currentModule + '.png'
		};


		$('.tabletwo tbody tr').each(function(idx,val){ 
			var _toAdd = {
				id: $(val).find('[name="ID"]').html(),
				description: $(val).find('[name="Description"]').val(),
				csr: ($(val).find('[name="CSR"]').is(':checked') ?
					'checked="checked"' :
					false),
				counselor: ($(val).find('[name="Counselor"]').is(':checked') ?
					'checked="checked"' :
					false),
				advisor: ($(val).find('[name="Advisor"]').is(':checked') ?
					'checked="checked"' :
					false),
				manager: ($(val).find('[name="Manager"]').is(':checked') ?
					'checked="checked"' :
					false)
			};
			_toRender.useCases.push(_toAdd);
		});

		var _html = mustache.render(useCaseTemplate,_toRender);

		console.log(_html);

        $.ajax({
            async: false,
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            url: '/Projects/' + self.currentProject() + '/Documentation/' + self.model.currentModule,
            data: JSON.stringify({
                name: name,
                content: _html
            }),
            success: function(data, textStatus, jqXHR){
                console.log(JSON.stringify(data),undefined, 2);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.error(errorThrown);
            }
        });
	});
});