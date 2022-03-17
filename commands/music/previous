const Discord = require("discord.js");

module.exports = {
  name: "previous",
  aliases: ["pr"],
  cooldown: 1000 * 0,
  description: "Plays the previous song",
  usage: "previous",
  ownerOnly: false,

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.voice.channel)
      return message.reply("You have to be in a Voice Channel!");
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
    if (!queue) return message.reply("There is no Queue right now!");

    
    client.distube.previous(queue);
  },
};
