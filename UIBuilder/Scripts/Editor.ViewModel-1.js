define([
    'Lib/jquery',
    'loadModel',
    'Lib/knockout',
    'Lib/jquery-ui-custom.min',
    'Lib/knockout-jqueryui.min',
    'Transforms/Transform.Utils'
], function ($,loadModel,ko) {
	var viewModel = function(){
		var self = this;

		self.model = null;
        self.extensions = {
            tabsCrossReference: {
                'Define':0,
                'Describe':1,
                'Write': 2,
                'UI Out':3,
                'Test Out':4
            }
        };

        self.disabledTabs = [];
        self.runHooks(self._preInit,'_preInit');

        //toggle
        self.viewWireframe = ko.observable(true);
        self.showWireframe = function(){
            var _currView = self.viewWireframe();
            self.viewWireframe(!_currView);
        };

        self.currentProject = ko.observable('Test Project');

        self.initModelFunctions();

        self.displayHelp = ko.observable(false);        


        self.runHooks(self._preBind,'_preBind');
        ko.applyBindings(this);


        self.refresh();
        self.runHooks(self._postInit,'_postInit');
	};

    viewModel.prototype.getCurrentModule = function(){
        var self = this;
        var toReturn = null;

        if(self.model && self.model.currentModule && self.model[self.model.currentModule]){
            toReturn = self.model[self.model.currentModule];   
        }

        return toReturn;
    };

    viewModel.prototype.runHooks = function(hooks,evtName){
        var self = this;

        $.each(hooks,function(i,hook){
            try{
                hook(self);
            }catch(err){
                console.error(evtName + ': ' + err);
            }
        });
    };

    viewModel.prototype.showHelp = function(){
        this.displayHelp(true);
    };


    viewModel.prototype._preBind = [];
    viewModel.prototype._preInit = [];
    viewModel.prototype._postInit = [];

    viewModel.prototype.reset = function(){
        var self = this;

        self.runHooks(self._preReset,'_preReset');

        self.isModelLoaded(false);

        self.balsamiqName('');
        self.balsamiqCode('');
        self.htmlGen('');

        self.refresh();
        self.runHooks(self._postReset,'_postReset');

    };

    viewModel.prototype._preReset = [];
    viewModel.prototype._postReset = [];


    viewModel.prototype.refresh = function(){
        var self = this;
        //clear disabled tabs, so that extensions can determine via hook whether
        //or not they should be disabled
        self.disabledTabs = [];

        self.runHooks(self._preRefresh,'_preRefresh');        

        self.runHooks(self._postRefresh,'_postRefresh');        
    };

    viewModel.prototype._preRefresh = [
        function(self){

            //we can only show a ui gen if we have it...
            if(!self.model || !self.model[self.model.currentModule]){

                self.disabledTabs.push(self.extensions.tabsCrossReference['UI Out']);
            }            
        }
    ];
    viewModel.prototype._postRefresh = [
        function(self){

            $('#tabs').tabs('option','disabled',self.disabledTabs);
            $('#tabs').tabs('select',self.extensions.tabsCrossReference.Define);

            //make sure the "define" tab is always enabled
            $('#tabs').tabs('enable',self.extensions.tabsCrossReference.Define);            
        }
    ];

    viewModel.prototype.initModelFunctions = function(){
        var self = this;

        self.isModelLoaded = ko.observable(false);
        self.balsamiqName = ko.observable('');
        self.balsamiqCode = ko.observable('');
        self.isEditingBalsamiq = ko.observable(false);
        self.htmlGen = ko.observable('');


        self.loadBalsamiqIntoModel = function(source,name){

            if(typeof source === 'string'){
                self.balsamiqCode(source);
            }

            if(typeof name === 'string'){
                self.balsamiqName(name);
            }

            var xml = $.parseXML(self.balsamiqCode());
            var name = self.balsamiqName();

            self._loadModel(self,xml,name);

            self.refresh();
        };
    };

    /*
    This is actually a coordinating function which probably needs to 
    be written differently (mainly less knowledge of how things stich together),  

    the transformation-phase function is 'transformXmlToBase.js', and 
    the generation-phase function is 'transformGlobalModelToHtml'
    */
	viewModel.prototype._loadModel = function(self,xml,name){

        console.log('');
        console.log('');
        console.log('LOADING MODEL');
        console.log('Balsamiq xml parsed, Basic Counts...');
        console.log('Control count: ' + $(xml).find('control').length);
        console.log('Group count: ' + $(xml).find('control[controlTypeID="__group__"]').length);

        var _newModule = loadModel(xml);

        _newModule.source = _newModule.source || {};
        _newModule.source.balsamiq = $.XmlToStr(xml);
        _newModule.source.balsamiqName = name;

        //just copy over new values, do not destroy old ones
        self.model[name] = self.model[name] || {};
        for(var property in _newModule){
            self.model[name][property] = JSON.parse(JSON.stringify(_newModule[property]));
        }

        self.model.currentModule = name;

        //just updating the ui
        if(self.moduleList.indexOf(name) < 0){
            self.moduleList.push(name);
        }
        self.currentModule(name);

        var _html = markup_beauty({
            source: _newModule.ui.html,
            mode: 'beautify',
            html: true,
            force_indent: true
        });
        
        self.htmlGen(_html);
        self.isModelLoaded(true);
	};

	return viewModel;
});