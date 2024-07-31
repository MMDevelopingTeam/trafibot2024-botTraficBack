const mongoose = require('mongoose');

const AccessLogSchema = new mongoose.Schema(
    {
        loginDate: {type: Date, default: Date.now},
        user: { type: String, maxlength: 45, required: true },
        address: { type: String, maxlength: 45, required: true },
        userAgent: { type: String, maxlength: 45 },
        hadAccess: { type: Boolean, required: true },
        User_idUser: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', autopopulate: true },
        company_idCompany: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company', autopopulate: true }
    }
)

AccessLogSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('AccessLog', AccessLogSchema)