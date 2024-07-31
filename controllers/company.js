const companyModels = require('../models/company');
const registerLicensesModels = require('../models/registerLicenses');
const botContainerCompanysModels = require('../models/botContainerCompanys');
const licensesModels = require('../models/licenses');
const botContainerModels = require('../models/botContainer');

// create company
const createCompany = async (req, res) => {
    const { nameCompany, typeCompany, addressCompany, telephoneCompany,  logo, isConfigFull, registerLicensesArray, license_idLicense } = req.body;
    try {
        const dataCompany = await companyModels.findOne({nameCompany})
        if (dataCompany) {
            return res.status(403).send({
                success: false,
                message: "La compañia ya existe."
            });
        }
        const dataL = await licensesModels.findOne({_id: license_idLicense})
        if (!dataL) {
            return res.status(403).send({
                success: false,
                message: "Licencia no encontrada"
            });
        }
        const dateI = new Date()
        const dateF = new Date()
        dateF.setMonth(dateF.getMonth()+parseInt(dataL.monthsDuration))

        let acctFree=null
        const dataBotContainers = await botContainerModels.find()
        for (let index = 0; index < dataBotContainers.length; index++) {
            acctFree=acctFree+dataBotContainers[index].accountsFree
        }
        if (acctFree < dataL.numberAccts) {
            return res.status(404).send({
                success: false,
                message: "Cuentas de los bots insuficientes"
            });
        }

        const newCompany = new companyModels({
            nameCompany, typeCompany, addressCompany, telephoneCompany, logo, isConfigFull, registerLicensesArray
        })
        const newComp = await newCompany.save()
        const newRegLicense = new registerLicensesModels({
            initialDateLicense: dateI,
            finishedDateLicense: dateF,
            monthsDuration: dataL.monthsDuration,
            licenses_idLicense: dataL._id,
            companys_idCompany: newComp._id
        })
        const dataReg = await newRegLicense.save()
        const dataC = await companyModels.findOne({_id: newComp._id})
        dataC.registerLicensesArray = dataC.registerLicensesArray.concat(dataReg._id)
        await dataC.save();

        let acctRest=dataL.numberAccts

        for (let index = 0; index < dataBotContainers.length; index++) {
            if (dataBotContainers[index].accountsFree === 0) {
                continue
            }
            if (dataBotContainers[index].accountsFree > acctRest) {
                const dataB = await botContainerModels.findOne({_id:dataBotContainers[index]._id})
                const newRegister = new botContainerCompanysModels({
                    companys_idCompany: newComp._id,
                    botContainer_idBotContainer: dataB._id,
                    registerLicenses: dataReg._id,
                    acctsUsed: parseInt(acctRest),
                    acctsFree: parseInt(acctRest)
                })
                const saveRegister = await newRegister.save()
                dataB.CompanysArray=dataB.CompanysArray.concat(saveRegister._id)
                dataB.accountsFree=dataBotContainers[index].accountsFree-acctRest
                await dataB.save()
                break;
            }
            if (dataBotContainers[index].accountsFree < acctRest) {
                acctRest=acctRest-dataBotContainers[index].accountsFree
                const dataB = await botContainerModels.findOne({_id:dataBotContainers[index]._id})
                const newRegisterD = new botContainerCompanysModels({
                    companys_idCompany: newComp._id,
                    botContainer_idBotContainer: dataB._id,
                    registerLicenses: dataReg._id,
                    acctsUsed: parseInt(dataBotContainers[index].accountsFree),
                    acctsFree: parseInt(dataBotContainers[index].accountsFree)
                })
                const saveRegisterD = await newRegisterD.save()
                dataB.CompanysArray=dataB.CompanysArray.concat(saveRegisterD._id)
                dataB.accountsFree=0
                await dataB.save()
            }
        }
        return res.status(200).send({
            success: true,
            message: "Compañia creado correctamente.",
            newComp
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// get companys
const getCompanys = async (req, res) => {
    try {
        const dataCompany = await companyModels.find()
        if (dataCompany) {
            return res.status(200).send({
                success: true,
                message: "Compañias traidas correctamente.",
                dataCompany
            });
        }
        if (dataCompany) {
            return res.status(200).send({
                success: true,
                message: "Compañias traidas correctamente.",
                dataCompany
            });
        }
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by id company
const getCompanyByID = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataCompany = await companyModels.findOne({_id: id}).populate({path: 'registerLicensesArray'})
        if (!dataCompany) {
            return res.status(400).send({
                success: false,
                message: "Compañia no encontrada"
            });
        }
        return res.status(200).send({
            success: true,
            message: "Compañia traida correctamente.",
            dataCompany
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// update company
const updateCompany = async (req, res) => {
    const { nameCompany, typeCompany, addressCompany, telephoneCompany, logo, isConfigFull, registerLicensesArray, botContainerArray } = req.body;
    const { id } = req.params;
    let newArray=[]
    let newArrayL=[]
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataCompany = await companyModels.findOne({_id: id})
        if (!dataCompany) {
            return res.status(400).send({
                success: false,
                message: "Compañia no encotrada"
            });
        }
        if (nameCompany != undefined) {
            dataCompany.nameCompany=nameCompany
        }
        if (typeCompany != undefined) {
            dataCompany.typeCompany=typeCompany
        }
        if (addressCompany != undefined) {
            dataCompany.addressCompany=addressCompany
        }
        if (telephoneCompany != undefined) {
            dataCompany.telephoneCompany=telephoneCompany
        }
        if (logo != undefined) {
            dataCompany.logo=logo
        }
        if (isConfigFull != undefined) {
            dataCompany.isConfigFull=isConfigFull
        }
        if (registerLicensesArray != undefined) {
            try {
              for (let index = 0; index < registerLicensesArray.length; index++) {
                const dataUserL = await registerLicensesModels.findOne({_id: registerLicensesArray[index]})
                if (!dataUserL) {
                  return res.status(403).send({
                    success: false,
                    message: `La licencia_id ${registerLicensesArray[index]} no existe`
                  });
                }
                dataCompany.registerLicensesArray.map(
                    data => {
                        newArrayL.push(String(data._id))
                    }
                )
                let i = newArrayL.indexOf(registerLicensesArray[index])
                if (i === -1) {
                    dataCompany.registerLicensesArray=dataCompany.registerLicensesArray.concat(registerLicensesArray[index])
                }else{
                    return res.status(403).send({
                        success: false,
                        message: `La licencia ya esta registrada`
                    });
                }
              }
            } catch (error) {
              return res.status(400).send({
                  success: false,
                  message: error.message  
              });
            }
        }
        await dataCompany.save()
        return res.status(200).send({
            success: true,
            message: "Compañia actualizada correctamente"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// delete company
const deleteCompany = async (req, res) => {
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataCompany = await companyModels.findOne({_id: id})
        if (!dataCompany) {
            return res.status(400).send({
                success: false,
                message: "Compañia no encotrada"
            });
        }
        await companyModels.deleteOne({_id: id})
        return res.status(200).send({
            success: true,
            message: "Compañia eliminada correctamente"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}


module.exports = {createCompany, getCompanys, getCompanyByID, updateCompany, deleteCompany};