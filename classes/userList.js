const sockets = require("../models/sockets");

class UserList {

    constructor () {}

    async agregar(usuario) {
        const newSk = new sockets({
            socketID: usuario.socketID,
            userID: usuario.userID,
            room: usuario.room
        })
        await newSk.save()
        return usuario;
    }

    async actualizarId_user(id, id_User) {
        const dataS = await sockets.findOne({socketID: id})
        if (dataS) {
            dataS.userID=id_User
            await dataS.save()
            console.log("========= Actualizando usuario ===========");
        }
    }

    async getList(){
        const dataS = await sockets.find()
        return dataS
    }
    async getUser(id){
        const dataS = await sockets.findOne({socketID: id})
        if (dataS) {
            return dataS
        }
    }

    async deleteUser(id){
        const dataS = await sockets.findOne({socketID: id})
        if (dataS) {
            await sockets.deleteOne({socketID: id})
        }
    }

    async getUSersRoom(room){
        const dataS = await sockets.find({room})
        if (dataS) {
            return dataS
        }
    }
}

module.exports = { UserList };