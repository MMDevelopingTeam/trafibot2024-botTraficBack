const mongoose = require('mongoose');

const SocketsSchema = new mongoose.Schema(
    {
        socketID: { type: String, required: true, unique: true, maxlength: 60 },
        userID: { type: String, ref: 'User' },
        room: { type: String, default: 'sin-room' }
    }
)

module.exports = mongoose.model('Sockets', SocketsSchema)