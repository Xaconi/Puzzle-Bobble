
/**
 * Created with JetBrains WebStorm.
 * User: Nico
 * Date: 26/03/13
 * Time: 16:04
 * To change this template use File | Settings | File Templates.
 */

var mongo = require('mongodb');

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