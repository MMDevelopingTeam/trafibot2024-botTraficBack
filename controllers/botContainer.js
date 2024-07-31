const botContainerModels = require('../models/botContainer');
const companyModels = require('../models/company');
const botContainerCompanysModels = require('../models/botContainerCompanys');
const axios = require('axios');

// create botContainer
const createBotContainer = async (req, res) => {
    const { ip, typeBot, descriptionBot, latBot, lonBot, addressBot, averageDownloadSpeed, averageUploadSpeed, isp } = req.body;
    try {
        const dataBotContainer = await botContainerModels.findOne({ip})
        if (dataBotContainer) {
            return res.status(403).send({
                success: false,
                message: "El IP ya existe."
            });
        }
        try {
            let url = `http://${ip}:3000/api/storage/getaccts`;
            const dataA = await axios(url)
            let allACt=dataA.data.acctslength
            console.log(allACt);
            const newBotContainer = new botContainerModels({
                ip, typeBot, descriptionBot, latBot, lonBot, addressBot, averageDownloadSpeed, averageUploadSpeed, isp, accountsAll: allACt, accountsFree: allACt
            })
            await newBotContainer.save()
        } catch (error) {
            if (error.code === "ETIMEDOUT") {
                return res.status(400).send({
                    success: false,
                    message: "Inposible conectar al bot por IP"
                });
            }
            return res.status(400).send({
                success: false,
                message: error.message
            });
        }
        return res.status(200).send({
            success: true,
            message: "BotContainer creado correctamente."
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// get botContainer
const getBotContainer = async (req, res) => {
    try {
        const dataBotContainer = await botContainerModels.find()
        if (dataBotContainer) {
            return res.status(200).send({
                success: true,
                message: "BotContainers traídos correctamente.",
                dataBotContainer
            });
        }
        data
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by id botContainer
const getBotContainerByID = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataBotContainer = await botContainerModels.findOne({_id: id})
        if (!dataBotContainer) {
            return res.status(400).send({
                success: false,
                message: "BotContainer no encontrado"
            });
        }
        return res.status(200).send({
            success: true,
            message: "BotContainer traído correctamente.",
            dataBotContainer
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by id botContainer
const getBotContainerByIP = async (req, res) => {
    const { ip } = req.params
    if (ip === ':ip') {
        return res.status(400).send({
            success: false,
            message: "ip es requerido"
        });
    }
    try {
        const dataBotContainer = await botContainerModels.findOne({ip})
        if (!dataBotContainer) {
            return res.status(400).send({
                success: false,
                message: "BotContainer no encontrado"
            });
        }
        return res.status(200).send({
            success: true,
            message: "BotContainer traído correctamente.",
            dataBotContainer
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by id botContainer for id company
const getBotContainerByIDCompany = async (req, res) => {
    let botContainers = []
    let state=false
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataC = await companyModels.findOne({_id: id})
        if (!dataC) {
            return res.status(400).send({
                success: false,
                message: "Compania no encontrada"
            });
        }
        const dataBotContainer = await botContainerModels.find({isActive: true})
        dataBotContainer.map(data => {
            data.CompanysArray.map(dataD => {
                if (String(dataD.id) === String(id)) {
                    botContainers.push(data)
                }
            })
        })
        for (let index = 0; index < botContainers.length; index++) {
            try {
                const dataAX = await axios.get(`http://${botContainers[index].ip}:3000/api/bot`)
                if (dataAX.data.success === true) {
                    console.log(botContainers[index].ip);
                }
            } catch (error) {
                const dataB = await botContainerModels.findOne({_id: botContainers[index]._id})
                dataB.isActive=false
                await dataB.save()
                let i = botContainers.indexOf(botContainers[index])
                botContainers.splice(i,1)
            }
        }
        return res.status(200).send({
            success: true,
            message: "BotContainer traído correctamente.",
            botContainers
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// update botContainer
const updateBotContainer = async (req, res) => {
    const { ip, typeBot, descriptionBot, latBot, lonBot, addressBot, averageDownloadSpeed, averageUploadSpeed, isp, isActive } = req.body;
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataBotContainer = await botContainerModels.findOne({_id: id})
        if (!dataBotContainer) {
            return res.status(400).send({
                success: false,
                message: "BotContainer no encontrado"
            });
        }
        if (ip != undefined) {
            dataBotContainer.ip=ip
        }
        if (typeBot != undefined) {
            dataBotContainer.typeBot=typeBot
        }
        if (descriptionBot != undefined) {
            dataBotContainer.descriptionBot=descriptionBot
        }
        if (latBot != undefined) {
            dataBotContainer.latBot=latBot
        }
        if (lonBot != undefined) {
            dataBotContainer.lonBot=lonBot
        }
        if (addressBot != undefined) {
            dataBotContainer.addressBot=addressBot
        }
        if (averageDownloadSpeed != undefined) {
            dataBotContainer.averageDownloadSpeed=averageDownloadSpeed
        }
        if (averageUploadSpeed != undefined) {
            dataBotContainer.averageUploadSpeed=averageUploadSpeed
        }
        if (isp != undefined) {
            dataBotContainer.isp=isp
        }
        if (isActive != undefined) {
            dataBotContainer.isActive=isActive
        }
        await dataBotContainer.save()
        return res.status(200).send({
            success: true,
            message: "BotContainer actualizado correctamente"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// update botContainer ArrayComp
const updateBotContainerArrayComp = async (req, res) => {
    let state=true
    const { nBots, Launch, Kill } = req.body;
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataBotComp = await botContainerCompanysModels.findOne({_id: id})
        if (!dataBotComp) {
            return res.status(400).send({
                success: false,
                message: "registro no encotrado"
            });
        }
        const dataBotContainer = await botContainerModels.findOne({_id: dataBotComp.botContainer_idBotContainer._id})
        if (!dataBotContainer) {
            return res.status(400).send({
                success: false,
                message: "BotContainer no encontrado"
            });
        }

        if (Launch === true) {
            if (nBots <= dataBotComp.acctsFree) {
                dataBotComp.acctsFree=dataBotComp.acctsFree-parseInt(nBots)
            }else{
                return res.status(400).send({
                    success: false,
                    message: "No tiene disponible mas bots",
                });
            }
        }
        if (Kill === true) {
            if (dataBotComp.acctsFree+parseInt(nBots) <= dataBotComp.acctsUsed) {
                dataBotComp.acctsFree=dataBotComp.acctsFree+parseInt(nBots)
            }else{
                return res.status(400).send({
                    success: false,
                    message: "No es posible matar bots",
                });
            }
        }
        dataBotComp.save()
        return res.status(200).send({
            success: true,
            message: "BotContainer actualizado correctamente",
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// update botContainer
const updateBotContainerByIP = async (req, res) => {
    const { typeBot, descriptionBot, latBot, lonBot, addressBot, averageDownloadSpeed, averageUploadSpeed, isp, isActive } = req.body;
    const { ip } = req.params;
    if (ip === ':ip') {
        return res.status(400).send({
            success: false,
            message: "ip es requerido"
        });
    }
    try {
        const dataBotContainer = await botContainerModels.findOne({ip})
        if (!dataBotContainer) {
            return res.status(400).send({
                success: false,
                message: "BotContainer no encontrado"
            });
        }
        if (typeBot != undefined) {
            dataBotContainer.typeBot=typeBot
        }
        if (descriptionBot != undefined) {
            dataBotContainer.descriptionBot=descriptionBot
        }
        if (latBot != undefined) {
            dataBotContainer.latBot=latBot
        }
        if (lonBot != undefined) {
            dataBotContainer.lonBot=lonBot
        }
        if (addressBot != undefined) {
            dataBotContainer.addressBot=addressBot
        }
        if (averageDownloadSpeed != undefined) {
            dataBotContainer.averageDownloadSpeed=averageDownloadSpeed
        }
        if (averageUploadSpeed != undefined) {
            dataBotContainer.averageUploadSpeed=averageUploadSpeed
        }
        if (isp != undefined) {
            dataBotContainer.isp=isp
        }
        if (isActive != undefined) {
            dataBotContainer.isActive=isActive
        }
        await dataBotContainer.save()
        return res.status(200).send({
            success: true,
            message: "BotContainer actualizado correctamente"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}


const deleteBotContainer = async (req, res) => {
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataBotContainer = await botContainerModels.findOne({_id: id})
        if (!dataBotContainer) {
            return res.status(400).send({
                success: false,
                message: "userType no encontrado"
            });
        }
        await botContainerModels.deleteOne({_id: id})
        return res.status(200).send({
            success: true,
            message: "BotContainer eliminado correctamente"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// get register company botContainer
const getRegisterCompanyBotContainer = async (req, res) => {
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const data = await botContainerCompanysModels.findOne({registerLicenses: id})
        if (data) {
            return res.status(200).send({
                success: true,
                message: "registro traído correctamente.",
                data
            });
        }
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// validIdPackProxy
const validIdPackProxy = async (req, res) => {
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    const dataB = await botContainerModels.find()
    for (let index = 0; index < dataB.length; index++) {
        let url = `http://${dataB[index].ip}:3000/api/storage/verifyIdPackProxy/${id}`;
        const dataA = await axios(url)
        if (dataA.data.existe) {
            return res.status(400).send({
                success: false,
                message: "Paquete existente en bots Container"
            });
        }
    }
    return res.status(200).send({
        success: true,
        message: "Paquete no existente en bots Container"
    });

}

module.exports = {createBotContainer, validIdPackProxy, getBotContainer, getBotContainerByIP, getBotContainerByID, updateBotContainerArrayComp, updateBotContainer, getBotContainerByIDCompany, getRegisterCompanyBotContainer, updateBotContainerByIP, deleteBotContainer};