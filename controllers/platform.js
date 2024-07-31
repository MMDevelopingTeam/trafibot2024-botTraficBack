const platformModels = require('../models/platform');

// create platform
const createPlatform = async (req, res) => {
    const { namePlatform, urlPlatform } = req.body;
    try {
        const dataPlatfm = await platformModels.findOne({namePlatform})
        if (dataPlatfm) {
            return res.status(403).send({
                success: false,
                message: "La plataforma ya existe"
            });
        }
        const newPlatform = new platformModels({
            namePlatform, urlPlatform
        })
        await newPlatform.save()
        return res.status(200).send({
            success: true,
            message: "Plataforma creada correctamente."
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// get platform
const getPlatform = async (req, res) => {
    try {
        const dataPlatfm = await platformModels.find()
        if (dataPlatfm) {
            return res.status(200).send({
                success: true,
                message: "Plataformas traidas correctamente.",
                dataPlatfm
            });
        }
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by id platform
const getPlatformByID = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataPlatfm = await platformModels.findOne({_id: id})
        if (!dataPlatfm) {
            return res.status(400).send({
                success: false,
                message: "Plataforma no encontrada"
            });
        }
        return res.status(200).send({
            success: true,
            message: "Plataforma traida correctamente.",
            dataPlatfm
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by name platform
const getPlatformByName = async (req, res) => {
    const { name } = req.params
    if (name === ':name') {
        return res.status(400).send({
            success: false,
            message: "name es requerido"
        });
    }
    try {
        const dataPlatfm = await platformModels.findOne({namePlatform: name})
        if (!dataPlatfm) {
            return res.status(400).send({
                success: false,
                message: "Plataforma no encontrada"
            });
        }
        return res.status(200).send({
            success: true,
            message: "Plataforma traida correctamente.",
            dataPlatfm
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// update platform
const updatePlatform = async (req, res) => {
    const { namePlatform, urlPlatform } = req.body;
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataPlatfm = await platformModels.findOne({_id: id})
        if (!dataPlatfm) {
            return res.status(400).send({
                success: false,
                message: "Plataforma no encotrada"
            });
        }
        if (namePlatform != undefined) {
            dataPlatfm.namePlatform=namePlatform
        }
        if (urlPlatform != undefined) {
            dataPlatfm.urlPlatform=urlPlatform
        }
        await dataPlatfm.save()
        return res.status(200).send({
            success: true,
            message: "Plataforma actualizada correctamente"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

const deletePlatform = async (req, res) => {
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataPlatfm = await platformModels.findOne({_id: id})
        if (!dataPlatfm) {
            return res.status(400).send({
                success: false,
                message: "Plataforma no encotrada"
            });
        }
        await platformModels.deleteOne({_id: id})
        return res.status(200).send({
            success: true,
            message: "Plataforma eliminada correctamente"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}


module.exports = {createPlatform, getPlatform, getPlatformByID, getPlatformByName, updatePlatform, deletePlatform};