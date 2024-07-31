const licencesModels = require('../models/licenses');
const platformModels = require('../models/platform');
const registerLicensesModels = require('../models/registerLicenses');
const botContainerCompanysModels = require('../models/botContainerCompanys');

// create license
const createLicense = async (req, res) => {
    const { nameLicense, descriptionLicense , monthsDuration, type, platform_idPlatform, numberAccts } = req.body;
    try {
        const dataP = await platformModels.findOne({_id: platform_idPlatform})
        if (!dataP) {
            return res.status(403).send({
                success: false,
                message: "Plataforma no encontrada"
            });
        }
        
        const newLicense = new licencesModels({
            nameLicense, descriptionLicense, monthsDuration, type, platform_idPlatform, numberAccts
        })
        await newLicense.save()
        return res.status(200).send({
            success: true,
            message: "licencia creada correctamente"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// get licenses
const getLicenses = async (req, res) => {
    try {
        const dataLicenses = await licencesModels.find()
        if (dataLicenses) {
            return res.status(200).send({
                success: true,
                message: "licencias traidas correctamente",
                dataLicenses
            });
        }
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by id license
const getLicenseByID = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataLicense = await licencesModels.findOne({_id: id})
        if (!dataLicense) {
            return res.status(400).send({
                success: false,
                message: "licencia no encontrada"
            });
        }
        return res.status(200).send({
            success: true,
            message: "licencia traida correctamente.",
            dataLicense
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// update license
const updateLicense = async (req, res) => {
    const { nameLicense, descriptionLicense , monthsDuration, type, platform_idPlatform, numberAccts } = req.body;
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataLicense = await licencesModels.findOne({_id: id})
        if (!dataLicense) {
            return res.status(400).send({
                success: false,
                message: "licencia no encotrada"
            });
        }
        if (nameLicense != undefined) {
            dataLicense.nameLicense=nameLicense
        }
        if (descriptionLicense != undefined) {
            dataLicense.descriptionLicense=descriptionLicense
        }
        if (monthsDuration != undefined) {
            dataLicense.monthsDuration=monthsDuration
            const dataR = await registerLicensesModels.find({licenses_idLicense: id})
            if (dataR) {
                for (let index = 0; index < dataR.length; index++) {
                    const dataRl = await registerLicensesModels.findOne({_id: dataR[index]._id})
                    dataRl.monthsDuration=monthsDuration
                    var currentF = new Date(dataRl.initialDateLicense);
                    currentF.setMonth(currentF.getMonth()+parseInt(monthsDuration))
                    dataRl.finishedDateLicense=currentF
                    await dataRl.save()
                }
            }
        }
        if (type != undefined) {
            dataLicense.type=type
        }
        if (platform_idPlatform != undefined) {
            const dataP = await platformModels.findOne({_id: platform_idPlatform})
            if (!dataP) {
                return res.status(403).send({
                    success: false,
                    message: "Plataforma no encontrada"
                });
            }
            dataLicense.platform_idPlatform=platform_idPlatform
        }
        if (numberAccts != undefined) {
            dataLicense.numberAccts=numberAccts
        }
        await dataLicense.save()
        return res.status(200).send({
            success: true,
            message: "licencia actualizada correctamente"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}
// delete license
const deleteLicense = async (req, res) => {
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataLicense = await licencesModels.findOne({_id: id})
        if (!dataLicense) {
            return res.status(400).send({
                success: false,
                message: "licencia no encotrada"
            });
        }
        await licencesModels.deleteOne({_id: id})
        return res.status(200).send({
            success: true,
            message: "licencia eliminada correctamente"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}


module.exports = {createLicense, getLicenses, getLicenseByID, updateLicense, deleteLicense};