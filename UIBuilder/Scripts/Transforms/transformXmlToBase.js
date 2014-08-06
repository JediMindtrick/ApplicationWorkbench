define([
	'Lib/jquery',
	'Transforms/LayoutRectangle',
	'Transforms/Transform.Utils'
	],function($,Rectangle,util){
		var _decode = util.customDataDecoder;

		//singleton id incrementor
		var _IDs = 0;

		return function(ctrl){
			_IDs++;

			var toReturn = {
				balsamiq:{
					raw: $.XmlToStr(ctrl),
					controlTypeID: $(ctrl).attr('controlTypeID'),
					src: ($(ctrl).find('src').length > 0 ? 
						_decode($(ctrl).find('src').text()) :
						''),
					customData: ($(ctrl).find('customData').length > 0 ?
						_decode($(ctrl).find('customData').text()) :
						''),
					customID: ($(ctrl).find('customID').length > 0 ?
						$(ctrl).find('customID').text() :
						'')
				},
				globalID: _IDs,
				ui: {
					rectangleLayout: Rectangle.fromXml(ctrl)
				},
				refs:{
					self: _IDs,
					parent: null
				}
			};

			return toReturn;
		};
});