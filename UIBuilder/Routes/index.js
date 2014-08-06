exports.test = function(req, res){
	var success = true;
	var errors = [];

	res.send({
		IsSuccess: success,
		Errors: errors
	});
};

exports.list = function(req, res){
  var walk = require('walk'), fs = require('fs'), options, walker;
  var walker = walk.walk('documentation');
  var fs = new Array();
  walker.on("file", function(root,file,next){
    var f = root + "/" + file['name'].substring(0, file['name'].lastIndexOf('.'));
    // push without /documentation prefix
    fs.push('Documentation' +  f.substring(f.indexOf('/')));

    next();
  });
  walker.on("end", function() {
    res.render('documents', { title: 'Documents', files: fs })
  });
};