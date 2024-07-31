const mongoose = require('mongoose');

const tableLogLaunchSchema = new mongoose.Schema(
    {
        nameModel: { type: String, required: true, maxlength: 45 },
        nBots: { type: Number, required: true, maxlength: 45 },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user_idUser' }
    }
)

module.exports = mongoose.model('tableLogLaunch', tableLogLaunchSchema)