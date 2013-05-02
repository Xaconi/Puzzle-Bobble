/**
 * Created with JetBrains WebStorm.
 * User: Nico
 * Date: 25/04/13
 * Time: 16:34
 * To change this template use File | Settings | File Templates.
 */

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
