const mongoose = require('mongoose');

const parseId = (id) => {
    return mongoose.Types.ObjectId(id)
}

module.exports = {parseId}