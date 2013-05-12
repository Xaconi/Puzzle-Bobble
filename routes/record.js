/**
 * Created with JetBrains WebStorm.
 * User: Nico
 * Date: 25/04/13
 * Time: 17:57
 * To change this template use File | Settings | File Templates.
 */

// Dades de connexió i gestió amb la base de dades local
var mongo = require('mongodb');
var crypto = require('crypto');
var ObjectID = require('mongodb').ObjectID;
var algorithm = 'aes256';
var key = 'La vida 42';

// Registre d'un nou record d'usuari
exports.inserirRecord = function(req, res){
    db.collection('user', function(err, collection) {                                //es mira la seva disponibilitat
        var objectID = new ObjectID(req.session.idUsuari);
        collection.findOne({'_id': objectID}, function(err, item) {
            if(item != null){
                db.collection('record', function(err, collection) {
                    collection.insert({ 'score': parseInt(req.body.record), 'user_id' : req.session.idUsuari, 'user_name' : item.name, 'date' : new Date() });
                    console.log("He entrat");
                });
            }
        });
    });
};

// Select dels millors records - FALTA PROVAR
exports.recollirRecordsTotals = function(req, res){
    db.collection('record', function(err, collection) {
        collection.find().limit(10).sort({ "score" : -1 }).toArray(function(err, items){
            res.jsonp(items);
        });
    });
};

// Select dels millors records personals de l'usuari
exports.recollirRecordsPersonals = function(req, res){
    db.collection('record', function(err, collection) {
        collection.find({'user_id' : req.session.idUsuari}).limit(10).sort({ "score" : -1 }).toArray(function(err, items){
            res.jsonp(items);
        });
    });
};

// Select dels millors records totals de la setmana
exports.recollirRecordsSetmana = function(req, res){
    db.collection('record', function(err, collection) {
        var d = new Date(new Date());
        var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        var start = new Date(d.setDate(diff));
        var end = new Date();
        collection.find({date : {$gte: start, $lt: end}}).limit(10).sort({ "score" : -1 }).toArray(function(err, items){
            res.jsonp(items);
        });
    });
};