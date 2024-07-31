const modelModels = require('../models/models');
const companyModels = require('../models/company');
const platformModels = require('../models/platform');
const botContainerModels = require('../models/botContainer');
const axios = require('axios');

// create model
const createModel = async (req, res) => {
    const { nickname, isAllowed, isActive, platforms_idPlatform, company_idCompany } = req.body;
    try {
        const dataModel = await modelModels.findOne({nickname})
        if (dataModel) {
            return res.status(403).send({
                success: false,
                message: "La modelo ya existe"
            });
        }

        const dataPlatform = await platformModels.findOne({_id: platforms_idPlatform})
        if (!dataPlatform) {
            return res.status(403).send({
                success: false,
                message: "Plataforma no encontrada"
            });
        }
        const dataC = await companyModels.findOne({_id: company_idCompany})
        if (!dataC) {
            return res.status(403).send({
                success: false,
                message: "Sede no encontrada"
            });
        }
        let newNickname = null;
        if (dataPlatform.namePlatform === "chaturbate") {
            newNickname=nickname.toLowerCase()
        }else{
            newNickname=nickname
        }
        const newModel = new modelModels({
            nickname: newNickname, 
            isAllowed, 
            isActive,
            platforms_idPlatform,
            company_idCompany
        })
        await newModel.save()
        return res.status(200).send({
            success: true,
            message: "Modelo creada correctamente"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// get models
const getModel = async (req, res) => {
    try {
        const dataModel = await modelModels.find()
        if (dataModel) {
            return res.status(200).send({
                success: true,
                message: "Modelos traidas correctamente",
                dataModel
            });
        }
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by id model
const getModelByID = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataModel = await modelModels.findOne({_id: id})
        if (!dataModel) {
            return res.status(400).send({
                success: false,
                message: "modelo no encontrada"
            });
        }
        return res.status(200).send({
            success: true,
            message: "modelo traida correctamente.",
            dataModel
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}
// get by id company model
const getModelsByIDCompany = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataModel = await modelModels.find({company_idCompany: id})
        if (!dataModel) {
            return res.status(400).send({
                success: false,
                message: "modelo no encontrada"
            });
        }
        return res.status(200).send({
            success: true,
            message: "modelos traidas correctamente.",
            dataModel
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get killbots by model
const getKillbotsByModel = async (req, res) => {

    const {nameModel} = req.body
    if (!nameModel) {
        return res.status(400).send({
            success: false,
            message: "nameModel es requerido"
        });
    }

    let acctsModelsLength=0

    const dataB = await botContainerModels.find({isActive: true})
    for (let index = 0; index < dataB.length; index++) {
        let url = `http://${process.env.LCH}/api/storage/getKillBotsByModel`;
        const dataK = await axios.post(url, {nameModel})
        acctsModelsLength=acctsModelsLength+dataK.data.acctsModelsLength
    }
    return res.status(200).send({
        success: true,
        message: "killsBots encontrados exitosamente",
        acctsModelsLength
    });
}

// get by id platform model
const getModelByIDPlatform = async (req, res) => {
    const { id } = req.params
    const { nickname } = req.body
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataModel = await modelModels.findOne({platforms_idPlatform: id, nickname})
        if (!dataModel) {
            return res.status(400).send({
                success: false,
                message: "modelo no encontrada"
            });
        }
        return res.status(200).send({
            success: true,
            message: "modelos traidas correctamente.",
            dataModel
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get model by id platform, id company and nickname
const getModelFull = async (req, res) => {
    const { nickname, platforms_idPlatform, company_idCompany } = req.body
    try {
        const dataModel = await modelModels.findOne({nickname, platforms_idPlatform, company_idCompany})
        if (!dataModel) {
            return res.status(400).send({
                success: false,
                message: "modelo no encontrada"
            });
        }
        return res.status(200).send({
            success: true,
            message: "modelo traida correctamente.",
            dataModel
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// update model
const updateModel = async (req, res) => {
    const { nickname, isAllowed, isActive, platforms_idPlatform, company_idCompany } = req.body;
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataModel = await modelModels.findOne({_id: id})
        if (!dataModel) {
            return res.status(400).send({
                success: false,
                message: "modelo no encotrada"
            });
        }
        if (nickname != undefined) {
            dataModel.nickname=nickname
        }
        if (isAllowed != undefined) {
            dataModel.isAllowed=isAllowed
        }
        if (isActive != undefined) {
            dataModel.isActive=isActive
        }
        if (platforms_idPlatform != undefined) {
            dataModel.platforms_idPlatform=platforms_idPlatform
        }
        if (company_idCompany != undefined) {
            dataModel.company_idCompany=company_idCompany
        }
        await dataModel.save()
        return res.status(200).send({
            success: true,
            message: "modelo actualizada correctamente"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}
// delete model
const deleteModel = async (req, res) => {
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataModel = await modelModels.findOne({_id: id})
        if (!dataModel) {
            return res.status(400).send({
                success: false,
                message: "modelo no encotrada"
            });
        }
        await modelModels.deleteOne({_id: id})
        return res.status(200).send({
            success: true,
            message: "modelo eliminada correctamente"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}


module.exports = {createModel, getModel, getModelByID, getModelsByIDCompany, getModelFull, getModelByIDPlatform, getKillbotsByModel, updateModel, deleteModel};