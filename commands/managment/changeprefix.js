const Discord = require("discord.js");
const mongoose = require('mongoose');
const { Permissions } = require('discord.js');
const Guild = require('/app/db_models/guild.js');
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "changePrefix",
  aliases: ["cp"],
  cooldown: 1000 * 5,
  description: "Changes the prefix",
  usage: "changePrefix {new prefix}",
  ownerOnly: false,

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      return message.reply("You dont have permission to do this!");

    if (!args.join(" ")[0]) return message.reply("Please provide a prefix!");

    const updateguild = await Guild.findOneAndUpdate(
      {
        id: message.guild.id,
      },
      {
        prefix: args.join(" ")[0],
      },
      {
        new: true,
      }
    );
    //logs changes
    const embed = new MessageEmbed()
      .setThumbnail(client.user.avatarURL())
      .setTitle("Changed Server Information")
      .setColor([37, 150, 190])
      .setDescription(`**${messageGuild.name}**`)
      .addField(`Prefix:`, `${updateguild.prefix}`)
      .setFooter(`To report bugs send a message to the dev`);

    message.reply({ embeds: [embed] });

    console.log(`
        +------------------------------+
        | Updated Guild Information    |
        +---------+--------------------+
        | Name:   | ${updateguild.name}
        +---------+--------------------+
        | Prefix: | ${updateguild.prefix}                  |
        +---------+--------------------+
        | Id:     | ${updateguild.id} |
        +---------+--------------------+
        | Owner:  | ${message.guild.id} |
        +---------+--------------------+`);
  },
};