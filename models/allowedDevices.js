const mongoose = require('mongoose');

const AllowedDevicesSchema = new mongoose.Schema(
    {
        lastConnection: {type: Date, default: Date.now},
        User_idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true, unique: false},
        // mac: { type: String, maxlength: 45, required: true, unique: true },
        mac: { type: String, maxlength: 45, required: true },
        userAgent: { type: String, maxlength: 45, default: '' },
        company_idCompany: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'company_idCompany' }
    }
)

AllowedDevicesSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('AllowedDevices', AllowedDevicesSchema)