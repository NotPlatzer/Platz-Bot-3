const Discord = require("discord.js");

module.exports = {
  name: "filter",
  aliases: ["f"],
  cooldown: 1000 * 3,
  description: "Puts a sound filter on the music",
  usage: "filter {3d, bassboost, echo, karaoke, nightcore, vaporwave}",

  async run(client, message, args, GuildPrefix, messageGuild) {
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
