var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;

var _env = 'windows';//alternatives are ''

var balsamiqPath = _env === 'linux' ? "/opt/Balsamiq Mockups/bin/Balsamiq Mockups" :
	'C:\\Program Files (x86)\\Balsamiq Mockups\\Balsamiq Mockups.exe';

var exportCmd = '"' + balsamiqPath + '" export';

var _getDir = _env === 'linux' ? 
	function(str){ return  __dirname.replace('/Routes',''); } :
	function(str){ return  __dirname.replace('Routes',''); };

exports.saveWireframe = function(req, res){
	console.log('saving wireframe file "' + req.params.name + '" for ' + req.params.project);
	var success = true;
	var errors = [];

	var content = '';

	try{
		content = req.body.content;
	}catch(err){
		console.log(err);
		success = false;		
		errors.push(err);
	}

	if(success){

		var projectName = req.params.project;
		var wireframeName = req.params.name;
		var wireframePath = _getDir() + '/Projects/' + projectName + '/ProjectFiles/' + wireframeName + '.bmml';
		console.log(wireframePath);

		try{
			fs.writeFileSync(wireframePath,content.toString());
		}catch(err){
			console.log(err);
			success = false;		
			errors.push(err);
		}


		if(success){
			var outAssetPath = _getDir() + '/Projects/' + projectName + '/' + wireframeName + '.png';


			var _cmd = exportCmd + ' "' + wireframePath + '" "' + outAssetPath + '"';

			child = exec(_cmd, function (error, stdout, stderr) {
				if(error === null){
					res.send({
						IsSuccess: true,
						Errors: errors
					});
				}else{
					res.send({
						IsSuccess: false,
						Errors: errors
					});					
				}
			});
		}
		
	}	
};


exports.saveDocumentation = function(req, res){
	console.log('saving documentation file "' + req.params.name + '" for ' + req.params.project);
	var success = true;
	var errors = [];

	var content = '';

	try{
		content = req.body.content;
	}catch(err){
		console.log(err);
		success = false;		
		errors.push(err);
	}

	if(success){

		var projectName = req.params.project;
		var documentName = req.params.name;
		var documentPath = _getDir() + '/Projects/' + projectName + '/' + documentName + '.html';
		console.log(documentPath);

		try{
			fs.writeFileSync(documentPath,content.toString());
		}catch(err){
			console.log(err);
			success = false;		
			errors.push(err);
		}
	}	

	res.send({
		IsSuccess: success,
		Errors: errors
	});
};