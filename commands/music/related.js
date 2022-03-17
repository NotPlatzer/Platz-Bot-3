const Discord = require("discord.js");
const Guild = require("/app/db_models/guild.js");

module.exports = {
  name: "related",
  aliases: ["r", "rel"],
  cooldown: 1000 * 1,
  description: "Toggles if there should be songs added that are related",
  usage: "related",
  ownerOnly: false,

  async run(client, message, args, GuildPrefix, messageGuild) {
    const queue = client.distube.getQueue(message);

    if (!messageGuild.relatedSongs) {
      await Guild.findOneAndUpdate(
        { id: message.guild.id },
        { relatedSongs: true },
        { new: true }
      );
      return message.reply(`Turned Related Songs on!`);
    } else {
      var toggle = false;
      if (messageGuild.relatedSongs === false) {
        toggle = true;
        message.reply(`Turned Related Songs on!`);
      } else {
        toggle = false;
        message.reply(`Turned Related Songs off!`);
      }
      await Guild.findOneAndUpdate(
        { id: message.guild.id },
        { relatedSongs: toggle },
        { new: true }
      );
    }
  },
};
