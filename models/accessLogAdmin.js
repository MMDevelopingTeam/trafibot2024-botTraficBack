const mongoose = require('mongoose');

const AccessLogAdminSchema = new mongoose.Schema(
    {
        loginDate: {type: Date, default: Date.now},
        user: { type: String, maxlength: 45, required: true },
        address: { type: String, maxlength: 45, required: true },
        userAgent: { type: String, maxlength: 45 },
        hadAccess: { type: Boolean, required: true },
        UserAdmin_idUserAdmin: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserAdmin', autopopulate: true },
        company_idCompany: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company', autopopulate: true }
    }
)

AccessLogAdminSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('AccessLogAdmin', AccessLogAdminSchema)