const mongoose = require('mongoose');

const PlatformSchema = new mongoose.Schema(
    {
        namePlatform: {type: String, maxlength: 45, required: true},
        urlPlatform: {type: String, maxlength: 45}
    }
)

module.exports = mongoose.model('Platform', PlatformSchema)