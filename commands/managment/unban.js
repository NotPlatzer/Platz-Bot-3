const Discord = require("discord.js");
const { Permissions } = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "unban",
  aliases: ["unb"],
  cooldown: 1000 * 0,
  description: "Un-Bans a member",
  usage: "unban {@user to unban}",

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return message.reply("You dont have permission to do this!");
    if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return message.reply("I dont have permission to do this!");

    const target = args[1];

    if (!target) {
      return message.reply(`Please provide the persons id who you want to unban`);
    }

    let embed = new MessageEmbed()
      .setTitle("Action : Un-Ban")
      .setDescription(`Un-Banned ${target} (${target.id})`)
      .setColor("#ff2050")
      .setThumbnail(target.displayAvatarURL())
      .setFooter(`Un-Banned by ${message.author.tag}`);

    await message.guild.bans
      .remove(target)
      .then(() => {
        message.reply({ embeds: [embed] });
      });
  },
};
