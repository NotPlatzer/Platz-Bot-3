const Discord = require("discord.js");
const { Permissions } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const Guild = require("/app/db_models/guild.js");

module.exports = {
  name: "mute",
  aliases: ["m"],
  cooldown: 1000 * 0,
  description: "Mutes a member",
  usage: "mute {@user to mute} {optional reason}",

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
      return message.reply("You dont have permission to do this!");
    if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
      return message.reply("I dont have permission to do this!");

    const muteRole = messageGuild.muteRole;

    const mutedRole = message.guild.roles.cache.find(
      (role) => role.name == muteRole
    );
    
    if (!muteRole && mutedRole == undefined) {
      return message.reply(
        `This server does not have a mute role, use \`${messageGuild.prefix}muterole <role>\` to set one or \`${messageGuild.prefix}muterole create [name]\` to create one.`
      );
    }

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "Unspecified";

    const target = message.mentions.members.first();

    if (!target) {
      return message.reply(`Please mention the person who you want to mute`);
    }
    if (target.id === message.author.id) {
      return message.reply(`You can not mute yourself!`);
    }
    if (target.id === message.guild.ownerId) {
      return message.reply("You cannot Mute The Server Owner");
    }
    if (target.id === message.guild.me.id) {
      return message.reply("You can not Mute the Bot in this way");
    }
    let Role = message.guild.roles.cache.find(
      (role) => role.id == messageGuild.muteRole
    );
    //make mute embed
    let embed = new MessageEmbed()
      .setTitle("Action : Mute")
      .setDescription(`Muted ${target} (${target.id})\nReason: ${reason}`)
      .setColor("#ff2050")
      .setThumbnail(target.avatarURL())
      .setFooter(`Muted by ${message.author.tag}`);

    target.roles.add(Role);
    message.reply({ embeds: [embed] });
  },
};
