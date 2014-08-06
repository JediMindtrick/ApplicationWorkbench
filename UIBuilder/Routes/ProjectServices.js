var fs = require('fs');

exports.saveProject = function(req, res){
	console.log('saving project file for ' + req.params.project);
	var success = true;
	var errors = [];

	var content = '';

	try{
		content = JSON.stringify(req.body,undefined,4);
	}catch(err){
		console.log(err);
		success = false;		
		errors.push(err);
	}

	if(success){

		var projectName = req.params.project;
		var projectFilePath = './Projects/' + projectName + '/ProjectFiles/project.json';

		try{
			fs.writeFile(projectFilePath,content);
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

exports.saveGlobalModel = function(req, res){
	console.log('saving global model for project ' + req.params.project);
	var success = true;
	var errors = [];

	var content = '';

	try{
		content = JSON.stringify(req.body,undefined,4);
	}catch(err){
		console.log(err);
		success = false;		
		errors.push(err);
	}

	if(success){

		var projectName = req.params.project;
		var projectFilePath = './Projects/' + projectName + '/ProjectFiles/globalModel.json';

		try{
			fs.writeFile(projectFilePath,content);
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