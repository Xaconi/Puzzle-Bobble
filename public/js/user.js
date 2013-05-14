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
        if($("[name='register-user']").val().length < min_chars){
            // ...
        }else{
            //mirarDisponibilitat($("[name='register-user']").val());
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

function ferLogin(user){
    $.ajax({
        url: encodeURI('/login'),
        type: 'POST',
        data: {loginUser : $('#login-user').val(), loginPass : $('#login-pass').val()},
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            if(typeof data.error == 'undefined'){
                window.location.href = 'http://localhost:3000/game';
            }else{
                if(typeof data.error != 'undefined' && data.error != null && data.error == 'user'){
                    $('#login-user').css('background-color','rgb(247, 89, 89)');
                }else if(typeof data.error != 'undefined' && data.error != null && data.error == 'password'){
                    $('#login-pass').css('background-color','rgb(247, 89, 89)');
                }
            }
        },
        error: function () { }
    });
};

function ferRegistre(user){
    $.ajax({
        url: encodeURI('/register'),
        type: 'POST',
        data: {registerUser : $('#register-user').val(), registerPass2 : $('#register-pass2').val(), registerPass : $('#register-pass').val(), registerEmail : $('#register-email').val(), registerBirth : $('#register-birth').val()},
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            if(typeof data.error == 'undefined'){
                window.location.href = 'http://localhost:3000/game';
            }else{
                $('#register-pass').css('background-color','#FFFFFF');
                $('#register-pass2').css('background-color','#FFFFFF');
                $('#register-user').css('background-color','#FFFFFF');
                $('#register-email').css('background-color','#FFFFFF');
                if(typeof data.error != 'undefined' && data.error != null && data.error == 'userName'){
                    $('#register-user').css('background-color','rgb(247, 89, 89)');
                }else if(typeof data.error != 'undefined' && data.error != null && data.error == 'passLength'){
                    $('#register-pass').css('background-color','rgb(247, 89, 89)');
                    $('#register-pass2').css('background-color','rgb(247, 89, 89)');
                }else if(typeof data.error != 'undefined' && data.error != null && data.error == 'email'){
                    $('#register-email').css('background-color','rgb(247, 89, 89)');
                }
            }
        },
        error: function () { }
    });
};