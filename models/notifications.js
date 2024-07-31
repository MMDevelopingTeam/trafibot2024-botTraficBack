const mongoose = require('mongoose');

const NotificationsSchema = new mongoose.Schema(
    {
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAdmin', autopopulate: true },
        fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
        to: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
        payload: { type: String, required: true, maxlength: 400 },
        description: { type: String, maxlength: 200 },
        state: { type: Boolean, default: false },
        date: { type: Date, required: true }
    }
)

NotificationsSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Notifications', NotificationsSchema)