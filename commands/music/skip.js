const Discord = require("discord.js");

module.exports = {
  name: "skip",
  aliases: ["sk", "ski"],
  cooldown: 1000 * 1,
  description: "Skips song",
  usage: "skip",
  ownerOnly: false,
  category: "music",

  async run(client, message, args, GuildPrefix, messageGuild) {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.reply("There is nothing to skip!");
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
    if (queue.songs.length === 1) {
      client.distube.stop(message);
      return message.reply("**Stopped Playing**");
    }

    if (!args[0]) {
      await client.distube.skip(message);
      await message.reply("Skipped");
    } else {
      if (isNaN(args[0])) return message.reply("Invalid song number.");

      await client.distube.jump(message, parseInt(args[0]));
      message.reply("Jumped to song no: " + parseInt(args[0]) + " in Queue");
    }
  },
};
