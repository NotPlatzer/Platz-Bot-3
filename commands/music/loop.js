const Discord = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ["lo"],
  cooldown: 1000 * 5,
  description: "Loops the song/queue",
  usage:
    "loop [use once for 'All Queue', twice for 'This Song', three times for 'Off'",
  ownerOnly: false,
  category: "music",

  async run(client, message, args, GuildPrefix, messageGuild) {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.reply("There is nothing to loop!");
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

    const mode = client.distube.setRepeatMode(message);
    message.reply(
      `Set repeat mode to \`${
        mode ? (mode === 2 ? "All Queue" : "This Song") : "Off"
      }\``
    );
  },
};
