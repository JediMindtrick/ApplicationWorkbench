define([
	'Lib/jquery'
	],function($){


		var _get = function(url,onSuccess){
			$.ajax({
				async: false,
				type: "GET",
				dataType: 'html',
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

		return function(list,func,sync) {

	        var loadedTemplates = [];
	        
	        $.each(list, function(idx,tmpl) {
	            var name = tmpl.name;
	            var path = "./Templates/" + name + '.mustache';

	            _get(path, function(template) {

	                if($('#' + name).length === 1){
	                    $('#' + name).text(template);
	                }else{
	                    $("body").append("<script id=\"" + name + "\" type=\"text/html\">" + template + "<\/script>");
	                }

	                loadedTemplates.push(name);

	                if (list.length === loadedTemplates.length) {
	                    func();
	                }
	            });
	        });
	    };   	
});