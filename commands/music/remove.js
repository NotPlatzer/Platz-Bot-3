const Discord = require("discord.js");
const { Permissions } = require("discord.js");

module.exports = {
  name: "remove",
  aliases: ["rm", "rem"],
  cooldown: 1000 * 0,
  description: "Removes a specific song from the queue",
  usage: "remove {index in queue}",
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
      return message.reply(`There is no queue`);
    }
    if (isNaN(args[0])) return message.reply("Invalid song number");
    const rmno = parseInt(args[0]);
    queue.songs.splice(rmno, 1);
    return message.reply(
      `Removed song number ${rmno} in queue\n\`${queue.songs[rmno].name}\``
    );
  },
};
