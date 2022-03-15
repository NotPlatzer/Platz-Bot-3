const Discord = require("discord.js");
const mongoose = require("mongoose");
const { Permissions } = require("discord.js");
const Guild = require("/app/db_models/guild.js");

module.exports = {
  name: "playlists",
  aliases: ["plist", "li"],
  cooldown: 1000 * 3,
  description:
    "Adds a selected Playlist to the Queue, or safes one for future use",
  usage:
    "playlists {name of Playlist to play} {add {name of playlist to add} {link to playlist}} or {remove {name of playlist to remove}} or {list}",
  ownerOnly: false,

  async run(client, message, args, GuildPrefix, messageGuild) {
    switch (args[0]) {
      case "add":
        if (
          !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
          message.author.id !== "608381190336020494"
        )
          return message.reply("You dont have permission to do this!");
        if (messageGuild.playlists.length >= 10)
          return message.reply(
            "There can only be 10 safed playlists. There are: " +
              messageGuild.playlists.length
          );
        const nameOfPlaylist = args[1];
        const linkOfPlaylist = args[2];

        if (!nameOfPlaylist)
          return message.reply("Please provide a name for the playlist");
        if (nameOfPlaylist === "list")
          return message.reply("Sorry, playlist name cant be list");
        if (
          nameOfPlaylist.includes("https://open.spotify.com") ||
          nameOfPlaylist.includes("https://youtube.com/playlist")
        )
          return message.reply("The name cant be a link to a playlist");
        if (!linkOfPlaylist)
          return message.reply("Please provide a Link for the playlist");
        if (
          !linkOfPlaylist.includes("https://open.spotify.com/playlist/") &&
          !linkOfPlaylist.includes("https://youtube.com/playlist") &&
          !linkOfPlaylist.includes("https://open.spotify.com/album/")
        )
          return message.reply("Please provide a valid URL for the playlist");

        await Guild.findOneAndUpdate(
          {
            id: message.guild.id,
          },
          {
            $addToSet: {
              playlists: {
                name: nameOfPlaylist,
                link: linkOfPlaylist,
              },
            },
          }
        );

        message.reply(`Added ${nameOfPlaylist} to the Saved Playlists!`);
        break;

      case "remove":
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
          return message.reply("You dont have permission to do this!");

        const nameOfPlaylistToDelete = args[1];

        await Guild.findOneAndUpdate(
          {
            id: message.guild.id,
          },
          {
            $pull: {
              playlists: {
                name: nameOfPlaylistToDelete,
              },
            },
          }
        );

        message.reply(
          `Removed ${nameOfPlaylistToDelete} from the Safed Playlists!`
        );
        break;

      case "list":
        var playlistLIST = "";

        if (messageGuild.playlists.length < 1)
          return message.reply("No Safed Playlists found!");

        messageGuild.playlists.forEach((playlist) => {
          playlistLIST = playlistLIST + "\n**" + playlist.name + "**";
        });
        message.reply(`Current playlists: ${playlistLIST}`);
        break;

      default:
        if (!message.member.voice.channel)
          return message.reply("You have to be in a voice channel!");
        if (message.guild.me.voice.channel !== null) {
          if (
            message.member.voice.channel.id !==
            message.guild.me.voice.channel.id
          ) {
            return message.reply(
              "You have to be in the same Voice Channel as the Bot!"
            );
          }
        }
        const playlistName = args[0];
        var found = false;
        //trys to find the playlist by name

        messageGuild.playlists.forEach((playlist) => {
          if (playlist.name === playlistName) {
            //do something with the playlist
            found = true;
            client.distube.play(message.member.voice.channel, playlist.link, {
              textChannel: message.channel,
              member: message.member,
            });
          }
        });
        if (!found) return message.reply("No Playlist found!");
    }
  },
};
