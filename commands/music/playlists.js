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
        console.log()
        switch (args[0]) {

            case "add":

                if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("You dont have permission to do this!");
                const nameOfPlaylist = args[1];
                const linkOfPlaylist = args[2];

                if (!nameOfPlaylist) return message.reply("Please provide a name for the playlist")
                if (nameOfPlaylist === 'list') return message.reply("Sorry, playlist name cant be list")
                if (nameOfPlaylist.includes("https://open.spotify.com/playlist/") || nameOfPlaylist.includes("https://youtube.com/playlist")) return message.reply("The name cant be a link to a playlist")
                if (!linkOfPlaylist) return message.reply("Please provide a Link for the playlist");
                if (!linkOfPlaylist.includes("https://open.spotify.com/playlist/") && !linkOfPlaylist.includes("https://youtube.com/playlist")) return message.reply("Please provide a valid URL for the playlist")

                await Guild.findOneAndUpdate({
                    id: message.guild.id
                },
                    {
                        $addToSet: {
                            playlists: {
                                name: nameOfPlaylist,
                                link: linkOfPlaylist
                            }
                        }
                    })

                break;

            case "remove":

                if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply("You dont have permission to do this!");

                const nameOfPlaylist = args[1];

                await Guild.findOneAndUpdate({
                    id: message.guild.id
                },
                    {
                        $pull: {
                            playlists: {
                                name: nameOfPlaylist,
                            }
                        }
                    })


                break;

            case "list":
                var playlistLIST = "";

                if (messageGuild.playlists.length < 1) return message.reply("No Safed Playlists found!");

                messageGuild.playlists.forEach(playlist => {
                    playlistLIST = playlistLIST + "\n**" + playlist.name + "**";
                })
                message.reply(`Current playlists: ${playlistLIST}`);
                break;

            default:
                if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");
                const playlistName = args[0];
                var found = false;
                //trys to find the playlist by name

                messageGuild.playlists.forEach(playlist => {
                    if (playlist.name === playlistName) {
                        //do something with the playlist
                        found = true;
                        client.distube.play(message, playlist.link);
                    }
                })
                if (!found) return message.reply("No Playlist found!");


        }

    }

}
//, plist add remove oder nichts
//bei ,plist add {nome} {link}
// ,plist remove {nome} {link}
// ,plist {nome} spielt di playlist
