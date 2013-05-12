/**
 * Created with JetBrains WebStorm.
 * User: Nico
 * Date: 25/04/13
 * Time: 16:34
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
    $.ajax({
        url: encodeURI('/recollirRecordsPersonals'),
        type: 'GET',
        data: {},
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            netejaTaula();
            $(data).each(function(i,item){
                var taula = $('.recordTable tr').get(i);
                $('td:nth-child(1)',taula).text(item.user_name);
                $('td:nth-child(2)',taula).text(item.score);
            });
        },
        error: function () { }
    });
})

// Funció ajax per inserir el record una vegada l'usuari ha perdut en el joc
function tractarRecord(score){
    var date = new Date();
    $.ajax({
        url: encodeURI('/inserirRecord'),
        type: 'POST',
        data: {record: score},
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
function recollirRecordsTotals(){
    $.ajax({
        url: encodeURI('/recollirRecordsTotals'),
        type: 'GET',
        data: {},
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            netejaTaula();
            $(data).each(function(i,item){
                var taula = $('.recordTable tr').get(i);
                $('td:nth-child(1)',taula).text(item.user_name);
                $('td:nth-child(2)',taula).text(item.score);
            });
        },
        error: function () { }
    });
};

// Funció ajax per recollir els millors records de base de dades
function recollirRecordsPersonals(){
    $.ajax({
        url: encodeURI('/recollirRecordsPersonals'),
        type: 'GET',
        data: {},
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            netejaTaula();
            $(data).each(function(i,item){
                var taula = $('.recordTable tr').get(i);
                $('td:nth-child(1)',taula).text(item.user_name);
                $('td:nth-child(2)',taula).text(item.score);
            });
        },
        error: function () { }
    });
};

// Funció ajax per recollir els millors records de base de dades
function recollirRecordsSetmanals(){
    $.ajax({
        url: encodeURI('/recollirRecordsSetmanals'),
        type: 'GET',
        data: {},
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            netejaTaula();
            $(data).each(function(i,item){
                var taula = $('.recordTable tr').get(i);
                $('td:nth-child(1)',taula).text(item.user_name);
                $('td:nth-child(2)',taula).text(item.score);
            });
        },
        error: function () { }
    });
};

// Funció per netejar la taula de records, i estalviar així possibles malentessos
function netejaTaula(){
    $('.recordTable tr td:nth-child(1)').text('NOT ADDED');
    $('.recordTable tr td:nth-child(2)').text('0');
}
