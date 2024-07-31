const mongoose = require('mongoose');

const RegisterLicensesSchema = new mongoose.Schema(
    {
        initialDateLicense: {type: Date, required: true},
        finishedDateLicense: {type: Date},
        monthsDuration: {type: String, required: true},
        isActive: { type: Boolean, default: true },
        licenses_idLicense: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Licenses', autopopulate: true},
        companys_idCompany: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'companys_idCompany' }
    }
)

RegisterLicensesSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('RegisterLicenses', RegisterLicensesSchema)