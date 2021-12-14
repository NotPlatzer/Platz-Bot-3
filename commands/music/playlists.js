const Discord = require("discord.js");
const mongoose = require('mongoose');
const { Permissions } = require('discord.js');
const Guild = require('/app/db_models/guild.js');

module.exports = {
    name: "playlists",
    aliases: ['plist'],
    cooldown: 1000 * 3,
    description: "Adds a selected Playlist to the Queue",
    usage: "playlist {playlist to play}",


    async run(client, message, args, GuildPrefix) {

        const result = await Guild.findOne({
            'playlists.name': 'test'
        })

        console.log('Result:', result);
        console.log('Result playlists:', result.playlists[0]);
    }

}

//, plist add remove oder nichts
//bei ,plist add {nome} {link}
// ,plist remove {nome} {link}
// ,plist {nome} spielt di playlist