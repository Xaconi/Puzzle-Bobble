/**
 * Created with JetBrains WebStorm.
 * User: Nico
 * Date: 25/04/13
 * Time: 17:57
 * To change this template use File | Settings | File Templates.
 */

// Registre d'un nou record d'usuari
exports.inserirRecord = function(req, res){
    db.collection('record', function(err, collection) {
        collection.insert({ 'score': req.body.record, 'user_id' : req.session.id, 'date' : req.body.time });
        console.log("He entrat");
    });
};

// Select dels millors records - NO ACABAT
exports.recollirRecordsTotals = function(req, res){
    db.collection('record', function(err, collection) {
        collection.find({ 'score': req.body.record, 'user_id' : req.session.id, 'date' : req.body.time });
        console.log("He entrat");
    });
};