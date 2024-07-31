class Usuario {
    socketID="";
    userID="";
    room="";
    
    constructor(id) {
        this.socketID=id;
        this.userID="sin-id";
        this.room="sin-sala";
    }
}

module.exports = { Usuario };