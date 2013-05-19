/*
* Funcions JavaScript dedicades al control i gestió de les dades de l'usuari
* */

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


/*
 * Funció de Login per tal que l'usuari pugui accedir al joc i pugui registrar els seus records.
 * */
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

/*
 * Funció de Registre per l'usuari, amb les dades introduides per aquest al formulari de registre. redirigeix la web
 * directament a la pantalla de joc.
 * */
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

/*
 * Funció de Logout per tal que l'usuari pugui esborrar les seves dades de les cookies i pugui tornar a la pantalla
 * d'inici del joc.
 * */
function ferLogout(){
    $.ajax({
        url: encodeURI('/logout'),
        type: 'GET',
        data: {},
        contentType: 'application/x-www-form-urlencoded',
        success: function () {
            window.location.href = 'http://localhost:3000';
        },
        error: function () { }
    });
}