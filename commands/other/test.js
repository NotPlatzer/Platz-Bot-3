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

  async run(client, message, args, GuildPrefix, messageGuild) {
    message.channel.send("!resign <@608381190336020494>");
    await sleep(2000);
    message.channel.send("!chess <@608381190336020494>");
    await sleep(2000);
    message.channel.send("!move d2d4");
    await sleep(2000);
    message.channel.send("!move d1d3");
    await sleep(2000);
    message.channel.send("!move c1h6");
    await sleep(2000);
    message.channel.send("!move b1a3");
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
