define([
	'Lib/jquery'
	],function($){
		
    /*http://cyber-tutorials.blogspot.com/2009/07/jquery-xml-to-string.html*/
    $.XmlToStr = function(xmlData) {
        if (window.ActiveXObject) {
            return xmlData.xml;
        } else {
            return (new XMLSerializer()).serializeToString(xmlData);
        }
    }

    var _customDataDecoder = function(_txtEncoded){
        return decodeURIComponent(decodeURIComponent(_txtEncoded).replace(/%0D/gi,'\n'));
    };

    return {
        customDataDecoder: _customDataDecoder
    };
});