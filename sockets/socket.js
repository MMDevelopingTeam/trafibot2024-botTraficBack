const { UserList } = require("../classes/userList");
const { Usuario } = require("../classes/user");

const usuariosConect = new UserList();

// escuchar desconexion
const desconectar = ( socket ) => {
    socket.on('disconnect', (data) => {
        console.log("cliente desconectado");
        usuariosConect.deleteUser(socket.id)
    })
}

// escuchar mensaje
const mensaje = ( socket, io ) => {
    socket.on('mensaje', ( payload) => {
        console.log(payload);
        io.emit('mensaje-nuevo', payload)
    })
}

// configurar usuario
const configUsuario = ( socket ) => {
    socket.on('configurar-usuario', (payload) => {
        console.log("configurando usuario", payload);
        usuariosConect.actualizarId_user(socket.id, payload.userId)
    })
} 

// conectar cliente
const conectarCliente = ( socket ) => {
    const user = new Usuario(socket.id);
    usuariosConect.agregar(user)
}

module.exports = { desconectar, mensaje, configUsuario, conectarCliente };