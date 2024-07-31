const mongoose = require('mongoose');

const botContainerCompanysSchema = new mongoose.Schema(
    {
        companys_idCompany: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company', autopopulate: true },
        botContainer_idBotContainer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BotContainer', autopopulate: true},
        registerLicenses: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'RegisterLicenses', autopopulate: true},
        acctsUsed: {type: Number, required: true},
        acctsFree: {type: Number, required: true},
    }
)

botContainerCompanysSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('botContainerCompanys', botContainerCompanysSchema)