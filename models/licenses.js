const mongoose = require('mongoose');

const LicensesSchema = new mongoose.Schema(
    {
        nameLicense: {type: String, maxlength: 45, required: true},
        descriptionLicense: {type: String, maxlength: 200},
        monthsDuration: {type: String, maxlength: 45, required: true},
        type: {type: String, maxlength: 45, required: true},
        platform_idPlatform: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Platform', autopopulate: true},
        numberAccts:{type: String, required:true}
    }
)

LicensesSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Licenses', LicensesSchema)