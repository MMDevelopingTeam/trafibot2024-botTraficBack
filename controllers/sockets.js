const { Server } = require('../classes/server');
const superUserModels = require('../models/grantFullAdmin');
const socketsModels = require('../models/sockets');
const userModels = require('../models/user');
const userAdminModels = require('../models/userAdmin');
const notificationsModels = require('../models/notifications');
const botContainerModels = require('../models/botContainer');
const companyModels = require('../models/company');
var mongoose = require('mongoose');

const server = Server.instance;

// send Message private
const sendMessage = async (req, res) => {
    const { range, description } = req.body;
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    // const server = Server.instance;
    try {
        server.io.in(id).emit('mensaje-privado', 'hola')
        return res.status(200).send({
            success: true,
            message: "Mensaje enviado correctamente"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// send Message private superUser
const sendMessageForSuperUser = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const date = new Date()
        const dataS = await superUserModels.findOne()
        if (!dataS) {
            return res.status(400).send({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const dataU = await userModels.findOne({_id: id})
        const dataUa = await userAdminModels.findOne({_id: id})

        if (!dataU && !dataUa) {
            return res.status(400).send({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        user= dataU || dataUa
        const newNotf = new notificationsModels({
            from: user._id,
            to: dataS._id,
            payload: JSON.stringify(req.body),
            description: req.body.description,
            date
        })
        const newNotfy = await newNotf.save();

        const dataSc = await socketsModels.findOne({userID: dataS._id})
        if (dataSc) {
            server.io.in(dataSc.socketID).emit('mensaje-privado', newNotfy)
        }
        return res.status(200).send({
            success: true,
            message: "Mensaje enviado correctamente"
        });


    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}
// send Message private superUser by bot
const sendMessageForSuperUserByBot = async (req, res) => {
    const { ip } = req.params
    if (ip === ':ip') {
        return res.status(400).send({
            success: false,
            message: "ip es requerido"
        });
    }
    try {
        const date = new Date()
        const dataB = await botContainerModels.findOne({ip: ip})
        if (!dataB) {
            return res.status(400).send({
                success: false,
                message: "Bot no encontrado"
            });
        }
        const dataS = await superUserModels.findOne()
        if (!dataS) {
            return res.status(400).send({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const newNotf = new notificationsModels({
            from: dataB._id,
            to: dataS._id,
            payload: JSON.stringify(req.body),
            description: req.body.description,
            date
        })
        const newNotfy = await newNotf.save();

        const dataSc = await socketsModels.findOne({userID: dataS._id})
        if (dataSc) {
            server.io.in(dataSc.socketID).emit('mensaje-privado', newNotfy)
        }
        return res.status(200).send({
            success: true,
            message: "Mensaje enviado correctamente"
        });


    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// send Message private userAdmin
const sendMessageForUserAdmin = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const date = new Date()
        const dataU = await userModels.findOne({_id: id})
        if (!dataU) {
            return res.status(400).send({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const dataUa = await userAdminModels.find({company_idCompany: dataU.company_idCompany})
        if (!dataUa) {
            return res.status(400).send({
                success: false,
                message: "Usuarios admin no encontrados"
            });
        }
        let arrayUserAdmin=[]
        dataUa.map(data => {
            arrayUserAdmin.push(data._id)
        })
        const newNot = new notificationsModels({
            fromUser: dataU._id,
            to: mongoose.Types.Array(arrayUserAdmin),
            payload: JSON.stringify(req.body),
            description: req.body.description,
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
        return res.status(200).send({
            success: true,
            message: "Mensaje enviado correctamente"
        });


    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// get clients
const getClients = async (req, res) => {
    try {
        // server.io.clients( (err, clientes) => {
        //     if (err) {
        //         return res.status(400).send({
        //             success: false,
        //             message: err.message
        //         }); 
        //     }
        //     return res.status(200).send({
        //         success: true,
        //         message: "Clientes traidos correctamente",
        //         clientes
        //     });
        // })
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get Notifications By Id User
const getNotificationsByIdUser = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataN = await notificationsModels.find({to: id, state: false}).sort({date: -1})
        if (!dataN) {
            return res.status(400).send({
                success: false,
                message: "notificaciones no encontradas"
            });
        }
        return res.status(200).send({
            success: true,
            message: "notificaciones encontradas correctamente",
            dataN
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// get Notifications By Id User state 
const getNotificationsByIdUserState = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataN = await notificationsModels.find({to: id}).sort({date: -1})
        if (!dataN) {
            return res.status(400).send({
                success: false,
                message: "notificaciones no encontradas"
            });
        }
        // console.log(dataN);
        return res.status(200).send({
            success: true,
            message: "notificaciones encontradas correctamente",
            dataN
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// update Notifications
const updateNotifications = async (req, res) => {
    const { state } = req.body;
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataN = await notificationsModels.findOne({_id: id})
        if (!dataN) {
            return res.status(400).send({
                success: false,
                message: "Notificación no encotrada"
            });
        }
        if (state != undefined) {
            dataN.state=state
        }
        await dataN.save()
        return res.status(200).send({
            success: true,
            message: "Notificación actualizada correctamente"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// notification mac Exe
const sendNotificationExe = async (req, res) => {
    const { company_idCompany, mac, user } = req.body;
    console.log(company_idCompany, mac, user);
    const dataC = await companyModels.findOne({nameCompany: company_idCompany})
    if (!dataC) {
        return res.status(400).send({
            success: false,
            message: "Compañia no encotrada"
        });
    }
    const dataU = await userModels.findOne({user})
    const dataUa = await userAdminModels.findOne({user})
    userfind= dataU || dataUa
    if (!userfind) {
        return res.status(400).send({
            success: false,
            message: "Usuario no encontrado"
        });
    }
    if (dataUa) {
        try {
            const date = new Date()
            const dataS = await superUserModels.findOne()
            if (!dataS) {
                return res.status(400).send({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }
            const data = {
                mac: mac,
                description: "Acceso a un dispositivo nuevo"
            }
            const newNotf = new notificationsModels({
                from: user._id,
                to: dataS._id,
                payload: JSON.stringify(data),
                description: req.body.description,
                date
            })
            const newNotfy = await newNotf.save();
    
            const dataSc = await socketsModels.findOne({userID: dataS._id})
            if (dataSc) {
                server.io.in(dataSc.socketID).emit('mensaje-privado', newNotfy)
            }
            return res.status(200).send({
                success: true,
                message: "Mensaje enviado correctamente"
            });
    
    
        } catch (error) {
            return res.status(400).send({
                success: false,
                message: error.message
            });
        }
    }
    if (dataU) {
        try {
            const date = new Date()
            const dataUa = await userAdminModels.find({company_idCompany: dataC._id})
            if (!dataUa) {
                return res.status(400).send({
                    success: false,
                    message: "Usuarios admin no encontrados"
                });
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
                description: req.body.description,
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
            return res.status(200).send({
                success: true,
                message: "Mensaje enviado correctamente"
            });
    
    
        } catch (error) {
            return res.status(400).send({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = {sendMessage, getClients, sendMessageForSuperUser, sendMessageForSuperUserByBot, updateNotifications, sendMessageForUserAdmin, sendNotificationExe, getNotificationsByIdUser, getNotificationsByIdUserState};