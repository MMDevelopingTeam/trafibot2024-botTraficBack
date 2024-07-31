const botContainerModels = require('../models/botContainer');
const userModels = require('../models/user');
const userAdminModels = require('../models/userAdmin');
const botContainerCompanysModels = require('../models/botContainerCompanys');
const licensesModels = require('../models/licenses');
const companyModels = require('../models/company');
const modelsModels = require('../models/models');
const platformModels = require('../models/platform');
const accessLogModels = require('../models/accessLog');
const accessLogAdminModels = require('../models/accessLogAdmin');
const axios = require('axios');

// get # All Acts
const getAllActs = async (req, res) => {
    try {
        const dataB = await botContainerModels.find()
        let allActs=null;        
        let allActsFree=null;        
        let allproxys=null;        
        let allproxysFree=null;
        let botContainers=[];
        let logsBotContainers=[];
        for (let index = 0; index < dataB.length; index++) {
            let url = `http://${dataB[index].ip}:3000/api/storage/getInfoBot`;
            const dataA = await axios(url)
            allActs=allActs+dataA.data.acctsLength
            allActsFree=allActsFree+dataA.data.acctsFreeLength
            allproxys=allproxys+dataA.data.proxyLength
            allproxysFree=allproxysFree+dataA.data.proxyFreeLength
            for (let index = 0; index < dataA.data.log.length; index++) {
                let log = dataA.data.log[index]
                const dataU = await userModels.findById({_id: dataA.data.log[index].userId})
                const dataR = await botContainerCompanysModels.findById({_id: dataA.data.log[index].registerCompanyBotContainer})
                log.userId=dataU
                log.registerCompanyBotContainer=dataR
                logsBotContainers.push(log)
            }
            dataA.data.log=logsBotContainers
            botContainers.push(dataA.data)
            logsBotContainers=[];
        }
        return res.status(200).send({
            success: true,
            message: "Estadisticas creadas correctamente.",
            NbotsContainers: dataB.length,
            allActs,
            allActsFree,
            allproxys,
            allproxysFree,
            botContainers
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// get # All comp
const getAllComp = async (req, res) => {
    try {
        const data = await companyModels.find()
        return res.status(200).send({
            success: true,
            message: "Estadisticas creadas correctamente.",
            data,
            length: data.length,
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// get # All licences
const getAllLicences = async (req, res) => {
    try {
        const data = await licensesModels.find()
        return res.status(200).send({
            success: true,
            message: "Estadisticas creadas correctamente.",
            data,
            length: data.length,
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// get # All models
const getAllModels = async (req, res) => {
    try {
        const data = await modelsModels.find()
        return res.status(200).send({
            success: true,
            message: "Estadisticas creadas correctamente.",
            data,
            length: data.length,
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// get # All platforms
const getAllplatforms = async (req, res) => {
    try {
        const data = await platformModels.find()
        return res.status(200).send({
            success: true,
            message: "Estadisticas creadas correctamente.",
            data,
            length: data.length,
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// get # All users
const getAllusers = async (req, res) => {
    try {
        const data = await userModels.find()
        return res.status(200).send({
            success: true,
            message: "Estadisticas creadas correctamente.",
            data,
            length: data.length,
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// get # All usersAdmin
const getAllusersAdmin = async (req, res) => {
    try {
        const data = await userAdminModels.find()
        return res.status(200).send({
            success: true,
            message: "Estadisticas creadas correctamente.",
            data,
            length: data.length,
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
//////////       stats user admin      /////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

// get stats 
const getAllStatsAdmin = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        let logsBotContainers=[];
        const fechaI = new Date()
        const fechaD = new Date()
        fechaD.setMonth(fechaD.getMonth()-1);
        const dataU = await userModels.find({company_idCompany: id})
        const dataUa = await userAdminModels.find({company_idCompany: id})
        const dataL = await botContainerCompanysModels.find({companys_idCompany: id})
        const dataAcsA = await accessLogAdminModels.find({companys_idCompany: id, hadAccess: true, loginDate: {
            $gte: fechaD,
            $lt: fechaI
        }}).sort({loginDate: -1})
        const dataAcs = await accessLogModels.find({companys_idCompany: id, hadAccess: true, loginDate: {
            $gte: fechaD,
            $lt: fechaI
        }}).sort({loginDate: -1})

        const dataB = await botContainerModels.find()
        for (let index = 0; index < dataB.length; index++) {
            let url = `http://${dataB[index].ip}:3000/api/storage/getStatsAdmin/${id}`;
            const dataA = await axios(url)
            dataA.data.logBotsByCompany.map(
                data => {
                    logsBotContainers.push(data)
                }
            )
        }
        for (let index = 0; index < logsBotContainers.length; index++) {
            const dataUR = await userModels.findById({_id: logsBotContainers[index].userId});
            logsBotContainers[index].userId=dataUR
        }
        return res.status(200).send({
            success: true,
            message: "Estadisticas creadas correctamente.",
            users :dataU,
            usersAdmin :dataUa,
            registerLicences :dataL,
            accessLogLastMonth :dataAcs,
            accessLogAdminLastMonth :dataAcsA,
            registerBots: logsBotContainers
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = {getAllActs, getAllComp, getAllLicences, getAllModels ,getAllplatforms, getAllusers, getAllStatsAdmin, getAllusersAdmin};