const Discord = require("discord.js");

module.exports = {
  name: "filter",
  aliases: ["f"],
  cooldown: 1000 * 3,
  description: "Puts a sound filter on the music",
  usage: "filter {3d, bassboost, echo, karaoke, nightcore, vaporwave}",

  async run(client, message, args, GuildPrefix, messageGuild) {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.reply("There is no Queue");
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
    if (
      [`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(
        args[0]
      )
    ) {
      let filter = client.distube.setFilter(message, args[0]);
      message.channel.send("Current queue filter: " + (filter || "Off"));
    }
  },
};