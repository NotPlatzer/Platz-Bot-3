const Discord = require("discord.js");
const { Permissions } = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "tempban",
  aliases: ["tb"],
  cooldown: 1000 * 0,
  description: "Temp-Bans a member",
  usage: "tempban {@user to ban} {time in minutes} {optional reason}",
  ownerOnly: false,
  category: "managment",

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return message.reply("You dont have permission to do this!");
    if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return message.reply("I dont have permission to do this!");

    let reason = args.slice(2).join(" ");
    if (!reason) reason = "Unspecified";
    const target = message.mentions.members.first();
    var time = args[1];

    if (!target) {
      return message.reply(`Please mention the person who you want to ban`);
    }
    if (target.id === message.author.id) {
      return message.reply(`You can not ban yourself!`);
    }
    if (target.id === message.guild.ownerId) {
      return message.reply("You cannot Ban The Server Owner");
    }
    if (target.id === message.guild.me.id) {
      return message.reply("You can not Ban the Bot in this way");
    }
    if (time > 2147483640) {
      return message.reply("Maximum ban time is 2147483640 minutes");
    }
    if (!time) {
      return message.reply("Please provide a amount of time (minutes)");
    } else {
      time = time.replace(",", ".");
    }

    let embed = new MessageEmbed()
      .setTitle("Action : Temp-Ban")
      .setDescription(
        `Banned ${target} for ${time} minutes (${target.id})\nReason: ${reason}`
      )
      .setColor("#ff2050")
      .setThumbnail(target.displayAvatarURL())
      .setFooter(`Banned by ${message.author.tag}`);

    await message.guild.bans
      .create(target, {
        reason: reason,
      })
      .then(() => {
        message.reply({ embeds: [embed] });
      })
      .catch((error) =>
        message.reply(
          `Sorry ${message.author} I couldn't ban this person. Maybe the person has a role above me.`
        )
      );
    setTimeout(() => {
      message.guild.bans.remove(target);
    }, time * 60000); // time in ms
  },
};
