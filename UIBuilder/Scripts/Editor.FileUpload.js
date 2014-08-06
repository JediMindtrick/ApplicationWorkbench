define([	
    'Lib/knockout',
	'Editor.ViewModel-1',
    'Lib/jquery'
], function (ko,vm,$) {

	var instantiatedVm = null;

	vm.prototype._postInit.push(function(self){

		instantiatedVm = self;

    });

    var _loadFileIntoView = function(balsamiq,name){
        console.log('');
        console.log('');
        console.log('LOADING FILE ' + name);

        if(instantiatedVm.moduleList.indexOf(name) >= 0){
            instantiatedVm.currentModule(name);
        }else{
            instantiatedVm.currentModule('New...');
        }

        instantiatedVm.balsamiqCode(balsamiq);
        instantiatedVm.balsamiqName(name);
        instantiatedVm.loadBalsamiqIntoModel();
        instantiatedVm.currentModule(name);

        $.ajax({
            async: false,
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            url: '/Projects/' + self.currentProject() + '/Wireframe/' + name,
            data: JSON.stringify({
                name: name,
                content: balsamiq
            }),
            success: function(data, textStatus, jqXHR){
                console.log(JSON.stringify(data),undefined, 2);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.error(errorThrown);
            }
        });

    };

    var dropArea = document.getElementById("dropArea");
        
    function traverseFiles (files) {                        
        for (var i = 0, l = files.length; i < l; i++) {
            file = files[i];
            console.log('');
            console.log('');
            console.log('FILE FOUND');
            console.log('Name: ' + file.name);
            console.log('Size: ' + file.size);
            console.log('Type: ' + file.type);

            if(file.name.indexOf('.bmml') >= 0){

	            var _reader = new FileReader();
                var _name = file.name.replace('.bmml','');

	            _reader.onload = function(data){
                    _loadFileIntoView(data.currentTarget.result,_name);
	            };

            _reader.readAsText(file);
            }else{
            	console.error('Unable to handle file: ' + file.name);
            }

        };
    };

    dropArea.ondragenter = function () {
        return false;
    };
    
    dropArea.ondragover = function () {
        return false;
    };
    
    dropArea.ondrop = function (evt) {
        traverseFiles(evt.dataTransfer.files);
        return false;
    };

});