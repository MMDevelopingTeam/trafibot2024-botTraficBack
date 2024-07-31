const mongoose = require('mongoose');

const WorkDaySchema = new mongoose.Schema(
    {
        range: {type: String, maxlength: 45, required: true},
        description: {type: String, maxlength: 100}
    }
)

module.exports = mongoose.model('WorkDay', WorkDaySchema)