const allowedDevicesModels = require('../models/allowedDevices');
const allowedDevicesUserAdminModels = require('../models/allowedDevicesUserAdmin');
const userModels = require('../models/user');
const userAdminModels = require('../models/userAdmin');
const companyModels = require('../models/company');
var mongoose = require('mongoose');

// create allowedDevices
const createAllowedDevices = async (req, res) => {
    const { lastConnection, User_idUser, mac, userAgent, company_idCompany } = req.body;
    try {
        const dataA = await allowedDevicesModels.findOne({User_idUser})
        if (dataA) {
            return res.status(403).send({
                success: false,
                message: "El dispositivo ya existe."
            });
        }
        // const dataIp = await allowedDevicesModels.findOne({mac})
        // const dataUIp = await allowedDevicesUserAdminModels.findOne({mac})
        // if (dataUIp) {
        //     return res.status(403).send({
        //         success: false,
        //         message: "El IP ya existe."
        //     });
        // }
        // if (dataIp) {
        //     return res.status(403).send({
        //         success: false,
        //         message: "El IP ya existe."
        //     });
        // }
        const dataU = await userModels.findOne({_id: User_idUser})
        if (!dataU) {
            return res.status(403).send({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const dataC = await companyModels.findOne({_id: company_idCompany})
        if (!dataC) {
            return res.status(403).send({
                success: false,
                message: "Compañia no encontrada"
            });
        }
        const newAllowedDevice = new allowedDevicesModels({
            lastConnection, User_idUser, mac, userAgent, company_idCompany
        })
        const saveRegister = await newAllowedDevice.save()
        dataC.devicesArray=dataC.devicesArray.concat(saveRegister._id)
        await dataC.save()
        return res.status(200).send({
            success: true,
            message: "Dispositivo creado correctamente."
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// create allowedDevices userAdmin
const createAllowedDevicesUserAdmin = async (req, res) => {
    const { lastConnection, User_idUser, mac, userAgent, company_idCompany } = req.body;
    try {
        const dataA = await allowedDevicesUserAdminModels.findOne({UserAdmin_idUserAdmin: User_idUser})
        if (dataA) {
            return res.status(403).send({
                success: false,
                message: "El dispositivo ya existe."
            });
        }
        // const dataIp = await allowedDevicesModels.findOne({mac})
        // const dataUIp = await allowedDevicesUserAdminModels.findOne({mac})
        // if (dataIp) {
        //     return res.status(403).send({
        //         success: false,
        //         message: "El IP ya existe."
        //     });
        // }
        // if (dataUIp) {
        //     return res.status(403).send({
        //         success: false,
        //         message: "El IP ya existe."
        //     });
        // }
        const dataU = await userAdminModels.findOne({_id: User_idUser})
        if (!dataU) {
            return res.status(403).send({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        const dataC = await companyModels.findOne({_id: company_idCompany})
        if (!dataC) {
            return res.status(403).send({
                success: false,
                message: "Compañia no encontrada"
            });
        }
        const newAllowedDevice = new allowedDevicesUserAdminModels({
            lastConnection, UserAdmin_idUserAdmin: User_idUser, mac, userAgent, company_idCompany
        })
        const saveRegister = await newAllowedDevice.save()
        dataC.devicesUserAdminArray=dataC.devicesUserAdminArray.concat(saveRegister._id)
        await dataC.save()
        return res.status(200).send({
            success: true,
            message: "Dispositivo creado correctamente."
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// Allow Access
const AllowAccess = async (req, res) => {
    const { lastConnection, User_idUser, mac, userAgent, company_idCompany } = req.body;
    try {
        const dataA = await allowedDevicesModels.findOne({User_idUser})
        if (dataA) {
            // const dataIp = await allowedDevicesModels.findOne({mac})
            // const datauA = await allowedDevicesUserAdminModels.findOne({mac})
            // if (dataIp) {
            //     return res.status(403).send({
            //         success: false,
            //         message: "IP ya registrada"
            //     });
            // }
            // if (datauA) {
            //     return res.status(403).send({
            //         success: false,
            //         message: "IP ya registrada"
            //     });
            // }
            dataA.mac=mac
            await dataA.save()
        }else{
            // const dataIp = await allowedDevicesModels.findOne({mac})
            // if (dataIp) {
            //     return res.status(403).send({
            //         success: false,
            //         message: "IP ya registrada"
            //     });
            // }
            const dataU = await userModels.findOne({_id: User_idUser})
            if (!dataU) {
                return res.status(403).send({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }
            const dataC = await companyModels.findOne({_id: company_idCompany})
            if (!dataC) {
                return res.status(403).send({
                    success: false,
                    message: "Compañia no encontrada"
                });
            }
    
            const newAllowedDevice = new allowedDevicesModels({
                lastConnection, User_idUser, mac, userAgent, company_idCompany
            })
            const saveRegister = await newAllowedDevice.save()
            dataC.devicesArray=dataC.devicesArray.concat(saveRegister._id)
            await dataC.save()
        }
        return res.status(200).send({
            success: true,
            message: "Dispositivo permitido correctamente."
        });
        
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// Allow Access user admin
const AllowAccessUSerA = async (req, res) => {
    const { lastConnection, User_idUser, mac, userAgent, company_idCompany } = req.body;
    try {
        const dataA = await allowedDevicesUserAdminModels.findOne({UserAdmin_idUserAdmin: User_idUser})
        if (dataA) {
            // const dataIp = await allowedDevicesUserAdminModels.findOne({mac})
            // const dataUIp = await allowedDevicesModels.findOne({mac})
            // if (dataIp) {
            //     return res.status(403).send({
            //         success: false,
            //         message: "IP ya registrada"
            //     });
            // }
            // if (dataUIp) {
            //     return res.status(403).send({
            //         success: false,
            //         message: "IP ya registrada"
            //     });
            // }
            dataA.mac=mac
            await dataA.save()
        }else{
            // const dataIp = await allowedDevicesUserAdminModels.findOne({mac})
            // if (dataIp) {
            //     return res.status(403).send({
            //         success: false,
            //         message: "IP ya registrada"
            //     });
            // }
            const dataUa = await userAdminModels.findOne({_id: User_idUser})
            if (!dataUa) {
                return res.status(403).send({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }
            const dataC = await companyModels.findOne({_id: company_idCompany})
            if (!dataC) {
                return res.status(403).send({
                    success: false,
                    message: "Compañia no encontrada"
                });
            }
    
            const newAllowedDevice = new allowedDevicesUserAdminModels({
                lastConnection, UserAdmin_idUserAdmin: User_idUser, mac, userAgent, company_idCompany
            })
            const saveRegister = await newAllowedDevice.save()
            dataC.devicesUserAdminArray=dataC.devicesUserAdminArray.concat(saveRegister._id)
            await dataC.save()
        }
        return res.status(200).send({
            success: true,
            message: "Dispositivo permitido correctamente."
        });
        
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// get allowedDevices
const getAllowedDevices = async (req, res) => {
    try {
        const dataA = await allowedDevicesModels.find()
        if (dataA) {
            return res.status(200).send({
                success: true,
                message: "Dispositivos traidos correctamente.",
                dataA
            });
        }
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by id allowedDevices
const getAllowedDevicesByID = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataA = await allowedDevicesModels.findOne({_id: id})
        if (!dataA) {
            return res.status(400).send({
                success: false,
                message: "Dispositivo no encontrado"
            });
        }
        return res.status(200).send({
            success: true,
            message: "Dispositivo traido correctamente.",
            dataA
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by ip allowedDevices
const getAllowedDevicesByIp = async (req, res) => {
    const { ip } = req.params
    if (ip === ':ip') {
        return res.status(400).send({
            success: false,
            message: "ip es requerido"
        });
    }
    try {
        const dataA = await allowedDevicesModels.findOne({mac: ip})
        if (!dataA) {
            return res.status(400).send({
                success: false,
                message: "Dispositivo no encontrado"
            });
        }
        return res.status(200).send({
            success: true,
            message: "Dispositivo traido correctamente.",
            dataA
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by id user allowedDevices
const getAllowedDevicesByIdUser = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataAu = await allowedDevicesModels.findOne({User_idUser: id})
        const dataAuA = await allowedDevicesUserAdminModels.findOne({UserAdmin_idUserAdmin: id})
        if (!dataAu && !dataAuA) {
            return res.status(400).send({
                success: false,
                message: "Dispositivo no encontrado"
            });
        }
        dataA=dataAu || dataAuA
        return res.status(200).send({
            success: true,
            message: "Dispositivo traido correctamente.",
            dataA
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// update allowedDevices
const updateAllowedDevices = async (req, res) => {
    const { lastConnection, User_idUser, mac, userAgent, company_idCompany } = req.body;
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataA = await allowedDevicesModels.findOne({_id: id})
        if (!dataA) {
            return res.status(400).send({
                success: false,
                message: "Dispositivo no encotrado"
            });
        }
        if (lastConnection != undefined) {
            dataA.lastConnection=lastConnection
        }
        if (User_idUser != undefined) {
            const dataU = await userModels.findOne({_id: User_idUser})
            if (dataU) {
                dataA.User_idUser=User_idUser
            }
        }
        if (mac != undefined) {
            dataA.mac=mac
        }
        if (userAgent != undefined) {
            dataA.userAgent=userAgent
        }
        if (company_idCompany != undefined) {
            const dataC = await companyModels.findOne({_id: company_idCompany})
            if (dataC) {
                dataA.company_idCompany=company_idCompany
            }
        }
        await dataA.save()
        return res.status(200).send({
            success: true,
            message: "Dispositivo actualizado correctamente"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

const deleteAllowedDevices = async (req, res) => {
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataA = await allowedDevicesModels.findOne({_id: id})
        if (!dataA) {
            return res.status(400).send({
                success: false,
                message: "Dispositivo no encotrado"
            });
        }
        const dataC = await companyModels.findOne({_id: dataA.company_idCompany})
        if (!dataC) {
            return res.status(400).send({
                success: false,
                message: "Compañia no encotrado"
            });
        }

        let newArray=[]
        let ArrayF=[]
        dataC.devicesArray.map(data => {
            newArray.push(String(data._id))
        })
        const i = newArray.indexOf(id)
        if (i !== -1) {
            newArray.splice(i, 1)
            newArray.map(data => {
                ArrayF.push(mongoose.Types.ObjectId(data))
            })
            dataC.devicesArray=ArrayF
            await dataC.save()
        }

        await allowedDevicesModels.deleteOne({_id: id})
        return res.status(200).send({
            success: true,
            message: "Dispositivo eliminado correctamente"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}


module.exports = {createAllowedDevices, createAllowedDevicesUserAdmin, getAllowedDevices, getAllowedDevicesByID, AllowAccess, AllowAccessUSerA, updateAllowedDevices, getAllowedDevicesByIdUser, getAllowedDevicesByIp, deleteAllowedDevices};