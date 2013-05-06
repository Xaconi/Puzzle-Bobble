/**
 * Created with JetBrains WebStorm.
 * User: Nico
 * Date: 25/04/13
 * Time: 16:34
 * To change this template use File | Settings | File Templates.
 */

// Funció ajax per inserir el record una vegada l'usuari ha perdut en el joc
function tractarRecord(score){
    var date = new Date();
    $.ajax({
        url: encodeURI('/inserirRecord'),
        type: 'POST',
        data: {record: score, time : date},
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            if(data.name != ""){
                alert(data.name);
            }
        },
        error: function () { }
    });
};

// Funció ajax per recollir els millors records de base de dades
function recollirRecordsTotals(score){
    var date = new Date();
    $.ajax({
        url: encodeURI('/recollirRecordsTotals'),
        type: 'GET',
        data: {record: score, time : date},
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            if(data.name != ""){
                alert(data.name);
            }
        },
        error: function () { }
    });
};
