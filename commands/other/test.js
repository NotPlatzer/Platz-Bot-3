const Discord = require("discord.js");
const Guild = require("/app/db_models/guild.js");
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  name: "test",
  aliases: ["test"],
  cooldown: 1000 * 0,
  description: "Changes the prefix",
  usage: "changePrefix {new prefix}",
  ownerOnly: true,
  category: "other",

  run(client, message, args, GuildPrefix, messageGuild) {
    message.channel.send("!resign <@608381190336020494>");
    sleep(2000).then(() => {
      message.channel.send("!chess <@608381190336020494>");
    });
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
