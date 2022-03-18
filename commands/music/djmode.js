const Discord = require("discord.js");
const Guild = require("/app/db_models/guild.js");
const { Permissions } = require("discord.js");

module.exports = {
  name: "djmode",
  aliases: ["dj", "d"],
  cooldown: 1000 * 1,
  description: "Toggles if dj mode is active",
  usage: "djmode",
  ownerOnly: false,
  category: "music",

  async run(client, message, args, GuildPrefix, messageGuild) {
    const queue = client.distube.getQueue(message);
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      return message.reply("You dont have permission to do this!");

    if (!messageGuild.djmode) {
      await Guild.findOneAndUpdate(
        { id: message.guild.id },
        { djmode: true },
        { new: true }
      );
      return message.reply(`Turned Dj mode on!`);
    } else {
      var toggle = false;
      if (messageGuild.djmode === false) {
        toggle = true;
        message.reply(`Turned Dj mode on!`);
      } else {
        toggle = false;
        message.reply(`Turned Dj mode off!`);
      }
      await Guild.findOneAndUpdate(
        { id: message.guild.id },
        { djmode: toggle },
        { new: true }
      );
    }
  },
};
