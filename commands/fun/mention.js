const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "mention",
  aliases: ["m"],
  cooldown: 1000 * 5,
  description: "",
  usage: "mention @person {how often}",
  ownerOnly: true,

  async run(client, message, args, GuildPrefix, messageGuild) {
    const target = message.mentions.members.first();
    const howOften = args[1];
    if (!target) {
      return message.reply(`Please mention the person who you want to annoy`);
    }
    if (!howOften) {
      return message.reply(`Please tell me how often to @ them`);
    }

    count = 1;
    while (count <= howOften) {
        message.channel.send(`<@${target.id}>`);
        count++;
    }
  },
};
