const Discord = require("discord.js");

module.exports = {
  name: "resume",
  aliases: ["re"],
  cooldown: 1000 * 5,
  description: "Resumes the Music",
  usage: "resume",

  async run(client, message, args, GuildPrefix, messageGuild) {
    const queue = client.distube.getQueue(message);
    if (!message.member.voice.channel)
      return message.reply("You have to be in a voice channel!");
    if (message.guild.me.voice.channel !== null) {
      if (
        message.member.voice.channel.id !== message.guild.me.voice.channel.id
      ) {
        return message.reply(
          "You have to be in the same Voice Channel as the Bot!"
        );
      }
    }
    if (!queue) return message.reply("There is nothing to resume!");
    if (queue.playing) return message.reply(`The Song is already Playing!`);

    client.distube.resume(message);
    message.reply("Resumed");
  },
};
