const Discord = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  name: "play",
  aliases: ["p"],
  cooldown: 1000 * 4,
  description: "Plays a song/playlist",
  usage: "play {song/playlist}",
  ownerOnly: false,

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.voice.channel)
      return message.reply("You have to be in a Voice Channel!");
    if (message.guild.me.voice.channel !== null) {
      if (
        message.member.voice.channel.id !== message.guild.me.voice.channel.id
      ) {
        return message.reply(
          "You have to be in the same Voice Channel as the Bot!"
        );
      }
    }

    const music = args.join(" ");
    if (!music) return message.reply("Please provide a Song!");

    await client.distube.play(message.member.voice.channel, music, {
      textChannel: message.channel,
      member: message.member,
    });
  },
};