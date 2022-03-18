const Discord = require("discord.js");
const { Permissions } = require("discord.js");

module.exports = {
  name: "volume",
  aliases: ["v", "vol"],
  cooldown: 1000 * 0,
  description: "Set the Volume of the queue",
  usage: "volume {1 - 100}",
  ownerOnly: false,
  category: "music",

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
      return message.reply(`There is no queue`);
    }
    if (isNaN(args[0])) return message.reply("Invalid volume");
    const volume = parseInt(args[0]);
    if (volume > 100 || volume < 0) {
      return message.reply(`Invalid Number`);
    }
    queue.volume = volume;
    return message.reply(`Set volume to: \`${volume}%\``);
  },
};
