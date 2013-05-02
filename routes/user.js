
/**
 * Created with JetBrains WebStorm.
 * User: Nico
 * Date: 26/03/13
 * Time: 16:04
 * To change this template use File | Settings | File Templates.
 */

var mongo = require('mongodb');
var crypto = require('crypto');
var algorithm = 'aes256';
var key = 'La vida 42';
var user_ID;

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var hostDB = 'localhost';
var portDB = 27017;
var nameDB = 'test';

var server = new Server(hostDB, portDB, {auto_reconnect: true});
db = new Db(nameDB, server);


// Funció per obrir la base de dades i inserir dades automàticament per tal de fer proves.
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'test' database");
        db.collection('user', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'user' collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

exports.register = function(req, res){ // Registre d'usuari nou

    // Mirem si el que ens han entrat es correcte
    var correctData = {};
    correctData.email = isEmail(req.body.registerEmail);                      // Verifiquem si es una direccio de correu

    correctData.passLength = req.body.registerPass.length >= 8;        // Mirem que el password tingui 8 caràcters o més

    var cipher = crypto.createCipher(algorithm,key);    // Mirem que el password i la repetició de password coincideixin
    var encPass = cipher.update(req.body.registerPass, 'utf8','hex')+cipher.final('hex'); //Per fer-ho, abans els
    cipher = crypto.createCipher(algorithm,key);            //encriptem per no treballar amb el password sense encriptar
    var encPassc = cipher.update(req.body.registerPass2, 'utf8','hex')+cipher.final('hex');
    correctData.pass = encPass == encPassc;
    // console.log(correctData.pass);

    // Crides a base de dades
    if(correctData.pass && correctData.email && correctData.passLength) {  //Si és correcte inserim l'usuari a la bdd
        db.collection('user', function(err, collection) {
            collection.findOne({'name': req.body.registerUser}, function(err, item) {
                if(item == null){
                    collection.insert({'name': req.body.registerUser, 'password' : encPassc, 'email' : req.body.registerEmail, 'date' : req.body.registerBirth});
                    collection.findOne({'name': req.body.registerUser}, function(err, item) {
                        req.session.id = item._id;
                        console.log(item._id);
                        console.log(req.session.id);
                        res.render('game');
                    });
                }
            });
        });
    }
};

function isEmail(email) { //expressió regular que comprova que un email ho és
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

exports.login = function(req, res) {  //Funcio que inicia sessio d'un usuari registrat
    var cipher = crypto.createCipher(algorithm,key);    // Mirem que el password i la repetició de password coincideixin
    var encPass = cipher.update(req.body.loginPass, 'utf8','hex')+cipher.final('hex'); //Ho encriptem perque a la bdd
    db.collection('user', function(err, collection) {                                           //també està encriptat
        collection.findOne({'name': req.body.loginUser}, function(err, item) {
            if(item == null){
                // Cas nom malament
                res.send({ error: 'Nom d\'usuari no trobat. Si us plau, mira que sigui correcte.' });
            }
            else
            {
                if(item.password == encPass){
                    req.session.id = item._id;
                    console.log(item._id);
                    console.log(req.session.id);
                    res.render('game');
                    // Cas correcte
                    //console.log(item._id);
                }
                else
                {
                    // Cas contrasenya malament
                    res.send({ error: 'Contrasenya incorrecta. Si us plau, mira que sigui correcte.' });
                }
            }
            db.close();
        });
    });
};

exports.nameAvailable = function(req, res) { //Funció que en serveix per que a mesura que es posa un nou nom d'usuari
    db.collection('user', function(err, collection) {                                //es mira la seva disponibilitat
        collection.findOne({'name':req.body.name}, function(err, item) {
            if(item != null){
                res.send({ name: item.name });
            }
            else
            {
                res.send({ name: "" });
            }
        });
    });
};


/*************************************/
/*************************************/
/**************TEST*******************/
/*************************************/
/*************************************/
/*
 * GET users listing.
 */

exports.findAll = function(req, res) {
    db.collection('user', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.render('user', { title: items.length });
        });
    });
};

// Funció per comprovar les dades dels usuaris...
exports.findByName = function(req, res) {
    var name = req.params.name;
    console.log('Retrieving user: ' + name);
    db.collection('user', function(err, collection) {
        collection.findOne({'name': name}, function(err, item) {
            if(item != null){
                res.render('user', { name: item.name });
            }
        });
    });
};

exports.list = function(req, res){
  res.send("respond with a resource");
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var user = [
        {
            name: "Xaconi",
            password: "xaconi"
        },
        {
            name: "Skar",
            password: "skar"
        }];

    db.collection('user', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {});
    });

};