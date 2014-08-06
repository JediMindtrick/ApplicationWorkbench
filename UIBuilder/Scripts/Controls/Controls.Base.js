define([
    'Lib/jquery'
    ],function($){

    var _customDataDecoder = function(_txtEncoded){
        return decodeURIComponent(decodeURIComponent(_txtEncoded).replace(/%0D/gi,'\n'));
    };

    var _koDataBindGen = function(node,toReturn){

        var customData = node.balsamiq.customData;
        if(customData && customData !== ''){

            var _meta = customData.replace(/\n/,',');
            toReturn.attr('data-bind',_meta);
        }
    };

    var _commonGen = function(node,toReturn){            
        var ctrl = node.balsamiq.raw;

        toReturn.attr('id',node.balsamiq.customID);

//carry all co-ordinate information through to the newly rendered control
//this is because the ordering algorithm currently works by parsing the 
//html as it is built and navigating it.  to do this, the algorithm needs
//the co-ordinates inside the html.  later the algorithm may work off of the 
//refs that are set in the model
        toReturn.attr('x',$(ctrl).attr('x'));
        toReturn.attr('y',$(ctrl).attr('y'));
        toReturn.attr('measuredW',$(ctrl).attr('measuredW'));
        toReturn.attr('measuredH',$(ctrl).attr('measuredH'));
        toReturn.attr('w',$(ctrl).attr('w'));
        toReturn.attr('h',$(ctrl).attr('h'));
    }


    var _determineType = function(node){
        var _bqType = node.balsamiq.controlTypeID;

        //"Balsamiq Components" have the name of the custom symbol
        //stored in a child 'src' node
        if(_bqType == 'com.balsamiq.mockups::Component'){
            var _src = node.balsamiq.src.split('#')
            if(_src.length < 2){
                console.error('Problem determining control type from balsamiq source:');
                console.error(node.balsamiq.raw);
                return undefined;
            }

            _bqType = _src[1];
        }        

        if(typeof _controls[_bqType] === 'undefined'){
            return undefined;
        }

        return _bqType;
    };

    var _controls = {
        'com.balsamiq.mockups::TextInput':{
            UI: {
                render: function(node){
                    var ctrl = node.balsamiq.raw;
                    var toReturn = $('<input style="float:right; text-align:right;" type="text" />');

                    _commonGen(node,toReturn);

                    _koDataBindGen(node,toReturn);

                    return $('<div>').append(toReturn).html();
                }
            }
        }, 
        'com.balsamiq.mockups::Canvas':{
            UI: {
                render: function(node){
                    var ctrl = node.balsamiq.raw;
                    var toReturn = $('<div style="width: 400px;">');

                    _commonGen(node,toReturn);

                    _koDataBindGen(node,toReturn);

                    return $('<div>').append(toReturn).html();
                }
            }
        },
        'com.balsamiq.mockups::Label':{
            UI: {
                render: function(node){
                    var ctrl = node.balsamiq.raw;
                    var toReturn = $('<label style="margin-top: 20px; float:left;" class="small"></label>');

                    _commonGen(node,toReturn);

                    _koDataBindGen(node,toReturn);

                    var _text = decodeURIComponent($(ctrl).find('text').text());
                    $(toReturn).html(_text);

                    return $('<div>').append(toReturn).html();
                }
            }
        } 
    };

    return {
        controls: _controls,
        koDataBindGen: _koDataBindGen,
        customDataDecoder: _customDataDecoder,
        commonGen: _commonGen,
        determineType: _determineType
    };
});