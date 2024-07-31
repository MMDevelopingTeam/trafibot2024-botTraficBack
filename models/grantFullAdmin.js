const mongoose = require('mongoose');

const GrantFullAdminSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, maxlength: 45 },
        password: { type: String, required: true, maxlength: 60 },
        lastConnection: { type: String, maxlength: 45 },
        last2Connection: { type: String, maxlength: 45 },
        last3Connection: { type: String, maxlength: 45 },
        ipFrom: { type: String, maxlength: 45 },
        latFrom: { type: String, maxlength: 45 },
        lonFrom: { type: String, maxlength: 45 }
    }
)

module.exports = mongoose.model('GrantFullAdmin', GrantFullAdminSchema)