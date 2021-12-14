const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
})

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
        required: false
    },
    playlists: [playlistSchema]


}, { timestamps: true });

const Guild = mongoose.model('Guild', guildSchema);


module.exports = Guild;