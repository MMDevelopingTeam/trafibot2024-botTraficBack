const { Server } = require('../classes/server');
const superUserModels = require('../models/grantFullAdmin');
const socketsModels = require('../models/sockets');
const userModels = require('../models/user');
const userAdminModels = require('../models/userAdmin');
const notificationsModels = require('../models/notifications');
const companyModels = require('../models/company');
var mongoose = require('mongoose');

const server = Server.instance;

const sendNotificationsAccs = async (id, company_idCompany, mac) => {
    const dataC = await companyModels.findOne({_id: company_idCompany})
    if (!dataC) {
        return console.log("Compañia no encotrada");
    }
    const dataU = await userModels.findOne({_id: id})
    const dataUa = await userAdminModels.findOne({_id: id})
    userfind= dataU || dataUa
    if (!userfind) {
        return console.log("Usuario no encontrado");
    }
    if (dataUa) {
        try {
            const date = new Date()
            const dataS = await superUserModels.findOne()
            if (!dataS) {
                return console.log("Usuario no encontrado");
            }
            const data = {
                mac,
                description: "Acceso a un dispositivo nuevo"
            }
            const newNotf = new notificationsModels({
                from: dataUa._id,
                to: dataS._id,
                payload: JSON.stringify(data),
                description: data.description,
                date
            })
            const newNotfy = await newNotf.save();
    
            const dataSc = await socketsModels.findOne({userID: dataS._id})
            if (dataSc) {
                server.io.in(dataSc.socketID).emit('mensaje-privado', newNotfy)
            }
            return console.log("Mensaje enviado correctamente");
    
    
        } catch (error) {
            return console.log(error.message);
        }
    }
    if (dataU) {
        try {
            const date = new Date()
            const dataUa = await userAdminModels.find({company_idCompany: dataC._id})
            if (!dataUa) {
                return console.log("Usuarios admin no encontrados");
            }
            let arrayUserAdmin=[]
            dataUa.map(data => {
                arrayUserAdmin.push(data._id)
            })
            const data = {
                mac: mac,
                description: "Acceso a un dispositivo nuevo"
            }
            const newNot = new notificationsModels({
                fromUser: dataU._id,
                to: mongoose.Types.Array(arrayUserAdmin),
                payload: JSON.stringify(data),
                description: data.description,
                date
            })
            const newNotfy = await newNot.save();
            arrayUserAdmin.map(data => {
                socketsModels.findOne({userID: data}, (err, data) => {
                if (data) {
                    server.io.in(data.socketID).emit('mensaje-privado', newNotfy)
                }
                })
    
            })
            return console.log("Mensaje usuario enviado correctamente");
    
    
        } catch (error) {
            return console.log(error.message);
        }
    }
}

module.exports = {sendNotificationsAccs}