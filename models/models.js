const mongoose = require('mongoose');

const ModelsSchema = new mongoose.Schema(
    {
        nickname: {type: String, maxlength: 45, unique:true, required: true},
        isAllowed: {type: Boolean, default: true},
        isActive: {type: Boolean, default: true},
        platforms_idPlatform: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Platform', autopopulate: true },
        company_idCompany: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company', autopopulate: true }
    }
)

ModelsSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Models', ModelsSchema)