const Discord = require("discord.js");

module.exports = {
  name: "pause",
  aliases: ["pa"],
  cooldown: 1000 * 5,
  description: "Pauses the Music",
  usage: "pause",
  ownerOnly: false,

  async run(client, message, args, GuildPrefix, messageGuild) {
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
    const queue = client.distube.getQueue(message);
    if (!queue) return message.reply("There is nothing to pause!");

    client.distube.pause(message);
    message.reply("Music is Paused");
  },
};
