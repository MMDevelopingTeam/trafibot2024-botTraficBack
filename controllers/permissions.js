const permissionsModels = require('../models/permissions');

// create permission
const createPermission = async (req, res) => {
    const { namePermission, PermissionDescription } = req.body;
    try {
        const dataPermission = await permissionsModels.findOne({namePermission})
        if (dataPermission) {
            return res.status(403).send({
                success: false,
                message: "El permiso ya existe."
            });
        }
        const newPermission = new permissionsModels({
            namePermission,
            PermissionDescription
        })
        await newPermission.save()
        return res.status(200).send({
            success: true,
            message: "Permiso creado correctamente."
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
    
}

// get permissions
const getPermissions = async (req, res) => {
    try {
        const dataPermissions = await permissionsModels.find()
        if (dataPermissions) {
            return res.status(200).send({
                success: true,
                message: "Permisos traidos correctamente.",
                dataPermissions
            });
        }
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// get by id permission
const getPermissionByID = async (req, res) => {
    const { id } = req.params
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataPermission = await permissionsModels.findOne({_id: id})
        if (!dataPermission) {
            return res.status(400).send({
                success: false,
                message: "Permiso no encontrado"
            });
        }
        return res.status(200).send({
            success: true,
            message: "Permiso traido correctamente.",
            dataPermission
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
        
    }
}

// update permission
const updatePermission = async (req, res) => {
    const { namePermission, PermissionDescription } = req.body;
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataPermission = await permissionsModels.findOne({_id: id})
        if (!dataPermission) {
            return res.status(400).send({
                success: false,
                message: "Permiso no encotrado"
            });
        }
        if (namePermission != undefined) {
            dataPermission.namePermission=namePermission
        }
        if (PermissionDescription != undefined) {
            dataPermission.PermissionDescription=PermissionDescription
        }
        await dataPermission.save()
        return res.status(200).send({
            success: true,
            message: "Permiso actualizado correctamente"
        });
        
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}

// delete permission
const deletePermission = async (req, res) => {
    const { id } = req.params;
    if (id === ':id') {
        return res.status(400).send({
            success: false,
            message: "id es requerido"
        });
    }
    try {
        const dataPermission = await permissionsModels.findOne({_id: id})
        if (!dataPermission) {
            return res.status(400).send({
                success: false,
                message: "Permiso no encotrado"
            });
        }
        await permissionsModels.deleteOne({_id: id})
        return res.status(200).send({
            success: true,
            message: "Permiso eliminado correctamente"
        });
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message
        });
    }
}


module.exports = {createPermission, getPermissions, getPermissionByID, updatePermission, deletePermission};