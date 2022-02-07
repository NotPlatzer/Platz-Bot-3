const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const commandFolders = fs.readdirSync("commands");

module.exports = {
  name: "info",
  aliases: ["i"],
  cooldown: 1000 * 0,
  description: "Information about commands",
  usage: "Info",
  ownerOnly: false,

  async run(client, message, args, GuildPrefix, messageGuild) {
    const infoembed = new MessageEmbed()
      .setAuthor(
        "Platz Bot v3",
        "https://cdn.discordapp.com/avatars/917878990478377020/7f147973452d4a6bacbb6132b8e4a18d.png"
      )
      .setColor([37, 150, 190])
      .setFooter(`To report bugs send a message to the dev`);

    const firstargs = args.join(" ");
    if (!firstargs)
      return message.reply("Please provide a command to show information");

    const command =
      client.commands.get(firstargs) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(firstargs)
      );
    if (command && command.ownerOnly === false) {
      infoembed
        .setTitle(`Information about "${command.name}" command`)
        .addField(`Usage:`, `${GuildPrefix}${command.usage}`)
        .addField(`Description:`, `${command.description}`)
        .addField(`Aliases:`, `${command.aliases}`);
      message.reply({ embeds: [infoembed] });
    } else {
      message.reply("No such Command");
    }
  },
};
