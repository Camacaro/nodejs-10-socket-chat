const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');

const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    // =====================================
    // El callback es un parametro opcional si no se va a enviar algo como respuesta
    // el primer parametro es lo que recibo
    // =====================================
    client.on('entrarChat', (data, callback)=>{
        //console.log(data);
        if( !data.nombre || !data.sala ){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        // ===============================================
        // Unir cliente a una sala, o grupo de chat
        // join()
        // primer parametro = nombre de la sala
        // ===============================================
        client.join(data.sala);

        let personas =  usuarios.agregarPersona( client.id, data.nombre, data.sala );

        // ===============================================
        // enviar mensajes a todos los que esten a una misma sala
        // ===============================================
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        // ===============================================
        // Notificar que se unio
        // ===============================================
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió el chat`) );

        callback( usuarios.getPersonasPorSala(data.sala) ); 
        //console.log(client.id, data.nombre, personas);
    });

    client.on('crearMensaje', (data, callback)=>{

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        // ==============================
        // Luego de enviar el mensaje a todos, lo voy a regrear
        // ==============================
        callback( mensaje );

    });


    client.on('disconnect', ()=>{
        let personaBorrada =  usuarios.borrarPersona( client.id );

        /*client.broadcast.emit('crearMensaje', {
            usuario: 'Administrador',
            mensaje: `${personaBorrada.nombre} abandonó el chat`
        } );*/
        console.log(personaBorrada);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`) );


        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

    });


    // ===============================================
    // Mensaje Privado
    // ===============================================
    client.on('mensajePrivado', data =>{

        // ===============================================
        // Hay que validar que venga un mensaje en data
        // ===============================================

        let persona = usuarios.getPersona( client.id );
        
        // ===============================================
        // con el to, especificamos a quien le enviaremos el mensaje
        // con el id del client
        // ===============================================        
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje) );
    });



    
});