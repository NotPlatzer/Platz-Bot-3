const Discord = require("discord.js");
const { Permissions } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const Guild = require("/app/db_models/guild.js");

module.exports = {
  name: "unmute",
  aliases: ["unm"],
  cooldown: 1000 * 0,
  description: "Un-Mutes a member",
  usage: "unmute {@user to unmute}",

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

    const target = message.mentions.members.first();

    if (!target) {
      return message.reply(`Please mention the person who you want to unmute`);
    }

    let Role = message.guild.roles.cache.find(
      (role) => role.id == messageGuild.muteRole
    );

    target.roles.remove(Role);
    message.reply(`Un-Muted ${target.username}`);
  },
};
