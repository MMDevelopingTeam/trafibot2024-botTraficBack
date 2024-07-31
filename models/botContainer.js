const mongoose = require('mongoose');

const BotContainerSchema = new mongoose.Schema(
    {
        ip: {type: String, maxlength: 45, unique: true, required: true},
        typeBot: {type: String, maxlength: 45, required: true},
        descriptionBot: {type: String, maxlength: 100},
        latBot: {type: String, maxlength: 10},
        lonBot: {type: String, maxlength: 10},
        addressBot: {type: String, maxlength: 45},
        averageDownloadSpeed: {type: String, maxlength: 45},
        averageUploadSpeed: {type: String, maxlength: 45},
        accountsAll: {type: Number, maxlength: 90},
        accountsFree: {type: Number, default: 0, maxlength: 90},
        isp: {type: String, maxlength: 90},
        isActive: {type: Boolean, default: true},
        CompanysArray: [{type: mongoose.Schema.Types.ObjectId, ref: 'botContainerCompanys', autopopulate: true}]
    }
)

BotContainerSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('BotContainer', BotContainerSchema)