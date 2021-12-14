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


    async run(client, message, args, GuildPrefix, messageGuild) {

        switch (args.join(" ")) {

            case "add":
                console.log(messageGuild.name)
                if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("You dont have permission to do this!");
                const nameOfPlaylist = args[0];
                const linkOfPlaylist = args[1];
                if(!nameOfPlaylist) return message.reply("Please provide a name for the playlist")
                if(nameOfPlaylist.includes("https://open.spotify.com/playlist/") || nameofPlaylist.includes("https://youtube.com/playlist")) return message.reply("The name cant be a link to a playlist")
                if(!linkOfPlaylist) return message.reply("Please provide a Link for the playlist");
                if(!linkOfPlaylist.includes("https://open.spotify.com/playlist/") || !linkOfPlaylist.includes("https://youtube.com/playlist")) return message.reply("Please provide a valid URL for the playlist")

                await Guild.findOneAndUpdate({}, {})

                break;

            case "remove":

                if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("You dont have permission to do this!");

                break;

            default:
                if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");
                const playlistName = args[0];
                //trys to find the playlist by name
                const currentGuild = await Guild.findOne({
                    'playlists.name': playlistName
                })
                const result = await Guild.findOne({
                    'playlists.name': playlistName
                })
                //if there is no result
                if (result === null) {
                    return message.reply("No such playlist or you havent made any Playlists yet")
                }
                else {
                    //if there is a result, result is the whole guild
                    result.playlists.forEach(playlist => {
                        if (playlist.name === playlistName) {
                            //do something with the playlist
                            client.distube.play(message, playlist.link);
                        }
                    })

                }
        }

    }

}
//, plist add remove oder nichts
//bei ,plist add {nome} {link}
// ,plist remove {nome} {link}
// ,plist {nome} spielt di playlist
