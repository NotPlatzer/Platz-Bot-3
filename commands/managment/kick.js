const Discord = require("discord.js");
const { Permissions } = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "kick",
  aliases: ["pi"],
  cooldown: 1000 * 5,
  description: "Kicks a member",
  usage: "kick {@member to kick} {reason}",
  ownerOnly: false,

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
      return message.reply("You dont have permission to do this!");
    if (!message.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
      return message.reply("I dont have permission to do this!");

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "Unspecified";

    const target = message.mentions.members.first();

    if (!target) {
      return message.reply(`Please mention the person who you want to kick`);
    }

    if (target.id === message.author.id) {
      return message.reply(`You can not kick yourself!`);
    }
    if (target.id === message.guild.ownerId) {
      return message.reply("You cannot kick The Server Owner");
    }
    if (target.id === message.guild.me.id) {
      return message.reply("You can not kick the Bot in this way");
    }

    let embed = new MessageEmbed()
      .setTitle("Action : Kick")
      .setDescription(`Kicked ${target} (${target.id})\nReason: ${reason}`)
      .setColor("#ff2050")
      .setThumbnail(target.displayAvatarURL())
      .setFooter(`Kicked by ${message.author.tag}`);

    target
      .kick(reason)
      .then(() => {
        message.reply({ embeds: [embed] });
      })
      .catch((error) =>
        message.reply(
          `Sorry ${message.author} I couldn't kick this person. Maybe the person has a role above me.`
        )
      );
  },
};
