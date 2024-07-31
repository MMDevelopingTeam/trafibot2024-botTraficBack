const mongoose = require('mongoose');

const PermissionsSchema = new mongoose.Schema(
    {
        namePermission: {type: String, maxlength: 45, required: true},
        PermissionDescription: {type: String, maxlength: 200}
    }
)

module.exports = mongoose.model('Permissions', PermissionsSchema)