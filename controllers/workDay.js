const workDayModels = require('../models/workDay');

// create WorkDay
const createWorkDay = async (req, res) => {
    const { range, description } = req.body;
    try {
        const dataWorkDay = await workDayModels.findOne({range})
        if (dataWorkDay) {
            return res.status(403).send({
                success: false,
                message: "El workDay ya existe."
            });
        }
        const newUserType = new workDayModels({
            range, description
        })
        await newUserType.save()
        return res.status(200).send({
            success: true,
            message: "workDay creado correctamente."
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// get WorkDay
const getWorkDay = async (req, res) => {
    try {
        const dataWorkDay = await workDayModels.find()
        if (dataWorkDay) {
            return res.status(200).send({
                success: true,
                message: "WorkDays traidos correctamente.",
                dataWorkDay
            });
        }
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by id WorkDay
const getWorkDayByID = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataWorkDay = await workDayModels.findOne({_id: id})
        if (!dataWorkDay) {
            return res.status(400).send({
                success: false,
                message: "WorkDay no encontrado"
            });
        }
        return res.status(200).send({
            success: true,
            message: "WorkDay traido correctamente.",
            dataWorkDay
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// update WorkDay
const updateWorkDay = async (req, res) => {
    const { range, description } = req.body;
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataWorkDay = await workDayModels.findOne({_id: id})
        if (!dataWorkDay) {
            return res.status(400).send({
                success: false,
                message: "WorkDay no encotrado"
            });
        }
        if (range != undefined) {
            dataWorkDay.range=range
        }
        if (description != undefined) {
            dataWorkDay.description=description
        }
        await dataWorkDay.save()
        return res.status(200).send({
            success: true,
            message: "WorkDay actualizado correctamente"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

const deleteWorkDay = async (req, res) => {
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataWorkDay = await workDayModels.findOne({_id: id})
        if (!dataWorkDay) {
            return res.status(400).send({
                success: false,
                message: "WorkDay no encotrado"
            });
        }
        await workDayModels.deleteOne({_id: id})
        return res.status(200).send({
            success: true,
            message: "WorkDay eliminado correctamente"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}


module.exports = {createWorkDay, getWorkDay, getWorkDayByID, updateWorkDay, deleteWorkDay};