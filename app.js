
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , record = require('./routes/record')
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
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({secret: 'La vida 42'}));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Web principal de projecte
app.get('/', function(req,res){
    res.render('inici');
});

//Registre d'un usuari
app.post('/register', user.register);

//Login d'un usuari
app.post('/login', user.login);

//Mira si un nom d'usuari està disponible
app.post('/nameAvailable', user.nameAvailable);

//Mira si un nom d'usuari està disponible
app.post('/inserirRecord', record.inserirRecord);

// Torna els 10 millors records globals de l'Ultimate Puzzle Bobble
app.get('/recollirRecordsTotals', record.recollirRecordsTotals);

// Torna els 10 millors records personals de l'Ultimate Puzzle Bobble
app.get('/recollirRecordsPersonals', record.recollirRecordsPersonals);

// Torna els 10 millors records de la setmana de l'Ultimate Puzzle Bobble
app.get('/recollirRecordsSetmanals', record.recollirRecordsSetmanals);

//Web del joc
app.get('/game', function(req, res){
    res.render('game');
});

//Web del joc per fer test (sense css)
app.get('/joc', function(req, res){
    res.render('joc');
});

//Proves
app.get('/users', user.findAll);
app.get('/users/:name', user.findByName);
app.post('/users', function(req, res){
    console.log("He fet un POST.");
    res.render('user', { title: req.body.name});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
