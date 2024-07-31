const mongoose = require('mongoose');

const AllowedDevicesUserAdminSchema = new mongoose.Schema(
    {
        lastConnection: {type: Date, default: Date.now},
        UserAdmin_idUserAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAdmin', autopopulate: true, unique: false },
        // mac: { type: String, maxlength: 45, required: true, unique: true },
        mac: { type: String, maxlength: 45, required: true },
        userAgent: { type: String, maxlength: 45 },
        company_idCompany: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'company_idCompany' }
    }
)

AllowedDevicesUserAdminSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('AllowedDevicesUserAdmin', AllowedDevicesUserAdminSchema)