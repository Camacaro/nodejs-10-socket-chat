var socket = io();

// =====================================
// Sirve para buscar varibales en la url
// =====================================
var params = new URLSearchParams( window.location.search );
if( !params.has('nombre') || !params.has('sala') ){
	window.location = 'index.html';
	// =====================================
	// Sirve para detener el codigo de js
	// =====================================
	throw new Error('El nombre y sala son necesario');	
}

var usuario = {
	nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    // ===============================================
    // Enviar informacion de la persona que se conecto
    // ===============================================
    //socket.emit('entrarChat', {usuario: 'Jesus'});
    // Haciendo un callback con function
    socket.emit('entrarChat', usuario, function( respServidor ){
    	console.log( 'Usuarios conectados', respServidor  );
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/*socket.emit('crearMensaje', {
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});*/

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

// ===============================================
// Escuchar Cambios de usuarios, cuando entra o sale
// ===============================================
socket.on('listaPersona', function(personas) {
    console.log(personas);
});

// ===============================================
// Mensajes Privados
// ===============================================
socket.on('mensajePrivado', function(mensaje){
	console.log('Mensaje Privado: ', mensaje);
});