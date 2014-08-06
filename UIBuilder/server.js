console.log('running from:');
console.log(__dirname);

var express = require('express')
  , routes = require('./Routes')
  , ProjectServices = require('./Routes/ProjectServices.js')
  , AssetServices = require('./Routes/AssetServices.js');

var app = module.exports = express.createServer();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


app.configure(function(){

  app.set('views', __dirname + '/Views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  app.use(express.static(__dirname));
});

app.get('/Test',routes.test);
app.post('/Projects/:project', ProjectServices.saveProject);
app.post('/Projects/:project/Model', ProjectServices.saveGlobalModel);
app.post('/Projects/:project/Wireframe/:name',AssetServices.saveWireframe);
app.post('/Projects/:project/Documentation/:name',AssetServices.saveDocumentation);

var port = process.env.PORT || 3000;

app.listen(port);

console.log("Main page at at http://localhost:%d/index.html", port);
console.log("Test page at at http://localhost:%d/test.html", port);