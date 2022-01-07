const Discord = require("discord.js");
const { Permissions } = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "muterole",
  aliases: ["mur"],
  cooldown: 1000 * 5,
  description: "Creates/Changes the Muterole",
  usage: "muterole [create] {role}",

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
      return message.reply("You dont have permission to do this!");
    if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
      return message.reply("I dont have permission to do this!");

    if (args[0] == "create") {
      message.guild.roles
        .create({
            name: "MUTED",
            color: "#ff0000",
        })
        .then((role) => {
          message.channel.send(`Role \`${role.name}\` created!`);
        });
    }
  },
};
