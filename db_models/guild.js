const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    },
    modRole: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Guild = mongoose.model('Guild', guildSchema);


module.exports = Guild;