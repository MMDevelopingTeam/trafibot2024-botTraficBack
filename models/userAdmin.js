const mongoose = require('mongoose');

const UserAdminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, maxlength: 45 },
        user: { type: String, required: true, maxlength: 45 },
        email: { type: String, required: true, unique: true, maxlength: 150 },
        password: { type: String, required: true, maxlength: 65 },
        userType: { type: String, default: 'admin'},
        company_idCompany: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company', autopopulate: true }
    }
)

UserAdminSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('UserAdmin', UserAdminSchema)