/**
 * Created with JetBrains WebStorm.
 * User: Nico
 * Date: 4/04/13
 * Time: 17:31
 * To change this template use File | Settings | File Templates.
 */
/** Javascript functions for the users **/

var min_chars = 4;      // Mínim de caràcters que fan falta per comprovar la disponibilitat del nom de l'usuari

$(document).ready(function() {
    $('#nik').keyup(function(event){
        //run the character number check
        if($('#nik').val().length < min_chars){
            // ...
        }else{
            mirarDisponibilitat($('#nik').val());
        }
    });
});

function mirarDisponibilitat(user){
    $.ajax({
        url: encodeURI('/nameAvailable'),
        type: 'POST',
        data: {name: user},
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            if(data.name != ""){
                alert(data.name);
            }
        },
        error: function () { }
    });


};