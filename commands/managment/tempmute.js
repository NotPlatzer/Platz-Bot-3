const Discord = require("discord.js");
const { Permissions } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const Guild = require("/app/db_models/guild.js");

module.exports = {
  name: "tempmute",
  aliases: ["tm"],
  cooldown: 1000 * 0,
  description: "Temporaraly Mutes a member",
  usage: "tempmute {@user to mute} {time in minutes} {optional reason}",
  ownerOnly: false,

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

    let time = args[1].replace(",", ".");
    let reason = args.slice(2).join(" ");
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
    if(time > 2147483640) {
      return message.reply("Maximum mutetime is 2147483640 minutes");
    }
    if(!time) {
      return message.reply("Please provide a amount of time (minutes)");
    }
    let Role = message.guild.roles.cache.find(
      (role) => role.id == messageGuild.muteRole
    );
    //make mute embed
    let embed = new MessageEmbed()
      .setTitle("Action : Temp-Mute")
      .setDescription(
        `Muted ${target} for ${time} minutes (${target.id})\nReason: ${reason}`
      )
      .setColor("#ffa500")
      .setThumbnail(target.displayAvatarURL())
      .setFooter(`Muted by ${message.author.tag}`);

    target.roles.add(Role);
    message.reply({ embeds: [embed] });

    // Unmute them after x minutes
    setTimeout(() => {
      target.roles.remove(Role, `Temporary mute expired.`);
    }, time * 60000); // time in ms
  },
};
