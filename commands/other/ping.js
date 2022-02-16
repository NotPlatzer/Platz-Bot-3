const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["pi"],
  cooldown: 1000 * 5,
  description: "ping/test command",
  usage: "ping",
  ownerOnly: true,

  async run(client, message, args, GuildPrefix, messageGuild) {
    const embed = new MessageEmbed()
      .setTitle("PONG!")
      .setAuthor(
        "Platz Bot v3",
        "https://cdn.discordapp.com/avatars/917878990478377020/7f147973452d4a6bacbb6132b8e4a18d.png"
      )
      .setColor([37, 150, 190])
      .setDescription(
        `🏓Latency is \`${
          Date.now() - message.createdTimestamp
        }\`ms\nAPI Latency is \`${Math.round(client.ws.ping)}\`ms`
      )
      .setFooter(`To report bugs send a message to the dev`);

    return message.reply({ embeds: [embed] });
  },
};