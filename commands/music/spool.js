const Discord = require("discord.js");
const { Permissions } = require("discord.js");

module.exports = {
  name: "spool",
  aliases: ["spo", "spol"],
  cooldown: 1000 * 0,
  description: "Spools to a certain time in the current song",
  usage: "spool {seconds}",
  ownerOnly: false,

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.voice.channel)
      return message.reply("You have to be in a voice channel!");
    if (!message.guild.me.voice.channel)
      return message.reply("Im not in a voice channel!");
    if (message.guild.me.voice.channel !== null) {
      if (
        message.member.voice.channel.id !== message.guild.me.voice.channel.id
      ) {
        return message.reply(
          "You have to be in the same Voice Channel as the Bot!"
        );
      }
    }
    const queue = client.distube.getQueue(message);
    if (!queue) {
      return message.reply(`There is nothing playing right now`);
    }
    if (isNaN(args[0])) return message.reply("Invalid number of seconds");
    const seconds = parseInt(args[0]);
    const duration = queue.songs[0].duration;

    if (seconds > duration || seconds < 0) {
      message.reply(`Invalid number`);
    }
    queue.currentTime = seconds;
    return message.reply(
      `Skipped to \`${seconds}\` seconds in \`${queue.songs[0].name}\``
    );
  },
};
