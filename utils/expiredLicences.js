const companyModels = require('../models/company');
const registerLicensesModels = require('../models/registerLicenses');
const botContainerCompanysModels = require('../models/botContainerCompanys');
const botContainerModels = require('../models/botContainer');
var mongoose = require('mongoose');

const desactiveRegisterLicenceComp = async (id) => {
    try {
        const dataLicense = await registerLicensesModels.findOne({_id: id})
        if (!dataLicense) {
            return console.log("registro no encontrado");
        }
        dataLicense.isActive=false;
        await dataLicense.save();

        const dataC = await companyModels.findOne({_id: dataLicense.companys_idCompany})
        if (!dataC) {
            return console.log("Compnañia no encontrada");
        }
        let newArray=[]
        let ArrayF=[]
        dataC.registerLicensesArray.map(data => {
            newArray.push(String(data._id))
        })
        const i = newArray.indexOf(String(id))
        if (i !== -1) {
            newArray.splice(i, 1)
            newArray.map(data => {
                ArrayF.push(mongoose.Types.ObjectId(data))
            })
            dataC.registerLicensesArray=ArrayF
            await dataC.save()
        }
        const dataRl = await botContainerCompanysModels.find({registerLicenses: id})
        if (!dataRl) {
            return console.log("registros botContainerCompany no encontrados");
        }
        for (let index = 0; index < dataRl.length; index++) {
            const dataB = await botContainerModels.findOne({_id: dataRl[index].botContainer_idBotContainer._id})
            let newArrayBot=[]
            let ArrayFBot=[]
            dataB.CompanysArray.map(data => {
                newArrayBot.push(String(data._id))
            })
            const i = newArrayBot.indexOf(String(dataRl[index]._id))
            if (i !== -1) {
                newArrayBot.splice(i, 1)
                newArrayBot.map(data => {
                    ArrayFBot.push(mongoose.Types.ObjectId(data))
                })
                dataB.CompanysArray=ArrayFBot
                dataB.accountsFree=dataB.accountsFree+dataRl[index].acctsUsed;
                await dataB.save()
            }
            await botContainerCompanysModels.deleteOne({_id: dataRl[index]._id})
        }
        return console.log("Registro de licencia desactivado correctamente");
    } catch (error) {
        return console.log(error.message);
    }
}

module.exports = {desactiveRegisterLicenceComp}