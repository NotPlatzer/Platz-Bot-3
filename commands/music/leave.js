const Discord = require("discord.js");
const { Permissions } = require("discord.js");

module.exports = {
  name: "leave",
  aliases: ["leave", "die"],
  cooldown: 1000 * 5,
  description: "Leaves the VC",
  usage: "leave",
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

    message.guild.me.voice.disconnect();
    await message.reply("**Left the Channel**");
  },
};
