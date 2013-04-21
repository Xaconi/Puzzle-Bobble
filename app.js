
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req,res){
    res.render('inici');
});
app.get('/users', user.findAll);
app.get('/users/:name', user.findByName);
app.post('/users', function(req, res){
    console.log("He fet un POST.");
    res.render('user', { title: req.body.name});
});
app.get('/joc', function(req, res){
    res.render('joc');
});
app.post('/nameAvailable', user.nameAvailable);

app.post('/register', user.register);
app.post('/login', user.login);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
