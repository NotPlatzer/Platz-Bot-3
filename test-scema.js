const mongoose = require('mongoose')

const scema = new mongoose.Schema({

    message: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('testing', scema);