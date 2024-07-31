const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
    {
        nameCompany: {type: String, required: true, maxlength:40},
        typeCompany: {type: String, required: true, maxlength:45},
        addressCompany: {type: String, maxlength:45},
        telephoneCompany: {type: String, maxlength:25},
        logo: {type: String, maxlength:100},
        isConfigFull: {type: Boolean, default: false},
        registerLicensesArray: [{type: mongoose.Schema.Types.ObjectId, ref: 'RegisterLicenses', autopopulate: true}],
        devicesArray: [{type: mongoose.Schema.Types.ObjectId, ref: 'AllowedDevices', autopopulate: true, unique: false}],
        devicesUserAdminArray: [{type: mongoose.Schema.Types.ObjectId, ref: 'AllowedDevicesUserAdmin', autopopulate: true, unique: false}],
    }
)

CompanySchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Company', CompanySchema)