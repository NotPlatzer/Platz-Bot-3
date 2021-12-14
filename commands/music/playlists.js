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

        switch (args.join(" ")) {

            case "add":

                if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("You dont have permission to do this!");
                break;

            case "remove":

                if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("You dont have permission to do this!");
                break;

            default:
                const playlistName = args[0];
                //trys to find the playlist by name
                const result = await Guild.findOne({
                    'playlists.name': playlistName
                })
                console.log(result)
                //if there is no result
                if (result === null) {
                    return message.reply("No such playlist")
                }
                else {
                    //if there is a result, result is the whole guild
                    message.reply(result.playlists[0].link);
                }
        }

    }

}
//, plist add remove oder nichts
//bei ,plist add {nome} {link}
// ,plist remove {nome} {link}
// ,plist {nome} spielt di playlist
