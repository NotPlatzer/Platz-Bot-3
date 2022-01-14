const Discord = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  name: "play",
  aliases: ["p"],
  cooldown: 0,
  description: "Plays a song/playlist",
  usage: "play {song/playlist}",

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.voice.channel)
      return message.reply("You have to be in a voice channel!");
    if (message.guild.me.voice.channel !== null) {
      console.log(message.guild.me.voice.channel.id);
    }

    const music = args.join(" ");
    if (!music) return message.reply("Please provide a Song!");

    await client.distube.play(message, music);
  },
};