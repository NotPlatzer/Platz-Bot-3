const Discord = require("discord.js");

module.exports = {
  name: "jump",
  aliases: ["j"],
  cooldown: 1000 * 0,
  description: "Jumps to a song in the queue",
  usage: "jump {number in queue to which to jump to}",
  ownerOnly: false,
  category: "music",

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

    await client.distube
      .jump(message, parseInt(args[0]))
      .catch((err) => message.channel.send("Invalid song number."));
    message.reply("Jumped to song no: " + parseInt(args[0]) + " in Queue");
  },
};
