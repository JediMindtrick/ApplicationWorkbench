define([//comment
            
            CDNpath + '/knockout/knockout-2.2.0.min.js',
/*            '/Advisor/Scripts/CA.Perspective.Util-2.js',*/
            CDNpath + '/CA/CA.Enterprise.Context-2.js'
    ],
    
    //run the app!!
    function (
        ko,
  /*      pUtil,*/
        eContext) {
       

        var toReturn = function () {
            
            //register plugin
            var pluginInterface = {
                Name: 'Example',
                init: function () {
                },
                reset: function () {
                },
                dumpState: function () {
                    //this is where we would dump a state to be saved
                },
                rehydrateState: function (state) {
                    //this is where we would reload a state that was previously saved
                },
                notifyClientSelected: function (client) {
                    
                    //get config information
                    var EnterpriseContext = eContext.EnterpriseContext;
                    
                    EnterpriseContext.getData({
                        endpoint: '/Question/getTopPerspective?clientId=' + client.Guid + '&perspectiveName=Budget Perspective v1&env=prod',

                        onSuccess: function (answers) {     
                            var vm = {};

                            //each answer
                            for (var i = 0, l = answers.length; i < l; i++) {
                                var curr = answers[i];
                                try{
                                    vm[curr.QuestionName] = ko.observable(curr.Response);
                                } catch (err) {
                                    log.error(err);
                                }
                            }
                            ko.applyBindings(vm);
                        }
                    });

                }
            };

            var pluginNS = CA.namespace('Plugins');
            pluginNS.registerPlugin(pluginInterface);
            $('body').show();

           var ensureTemplates = function(list) {
                var loadedTemplates = [];
                ko.utils.arrayForEach(list, function(name) {
                    $.get("./KOTemplates/" + name + ".html", function(template) {
                        $("body").append("<script id=\"" + name + "\" type=\"text/html\">" + template + "<\/script>");
                        loadedTemplates.push(name);
                        if (list.length === loadedTemplates.length) {
                            ko.applyBindings({
                                MortgRentExps:500,
                                CCDebtBudg:200
                            });
                        }
                    });
                });
            }

            ensureTemplates(['plugin']);
        };

        return toReturn;
    }
);