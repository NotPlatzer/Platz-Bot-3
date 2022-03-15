const Discord = require("discord.js");

module.exports = {
  name: "filter",
  aliases: ["f"],
  cooldown: 1000 * 1,
  description: "Puts a sound filter on the music",
  usage:
    "filter [list] {3d, bassboost, echo, karaoke, nightcore, vaporwave, earrape, slowreverb}",
  ownerOnly: false,

  async run(client, message, args, GuildPrefix, messageGuild) {
    const filters = [
      `3d`,
      `bassboost`,
      `echo`,
      `karaoke`,
      `nightcore`,
      `vaporwave`,
      `earrape`,
      `slowreverb`,
    ];
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
    if (args.length <= 0) {
      return message.reply(`Please provide a filter to play!`);
    }
    if (args[0] === "list") {
      return message.reply(`Filters: \`${filters.join(", ")}\``);
    }
    if (args[0] === "clear") {
      console.log(
        `${typeof queue.filters} Filters active (${queue.filters.length}): ${
          queue.filters
        }`
      );
      if (queue.filters.length === 0) {
        return message.reply(`No filters active!`);
      }
      while (queue.length > 0) {
        client.distube.setFilter(message, queue.filters[0]);
        console.log(`${queue.filters[0]}, deactivated`);
      }
      return message.reply(`Cleared all the filters!`);
    }
    if (filters.includes(args[0])) {
      let filter = client.distube.setFilter(message, args[0]);
      message.channel.send("Current queue filter: `" + (filter || "Off") + "`");
    } else {
      return message.reply(
        `No such filter: ${args[0]}\nUse \`${messageGuild.prefix}filter list\` to get a list of available filters`
      );
    }
  },
};
