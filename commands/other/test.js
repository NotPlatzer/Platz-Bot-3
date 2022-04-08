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
    message.channel.send("!move a1b1");
    await sleep(2000);
    message.channel.send("!move h8g8");
    await sleep(2000);
    message.channel.send("!move b1a1");
    await sleep(2000);
    message.channel.send("!move g8h8");
    await sleep(2000);
    message.channel.send("!move O-O-O");
    await sleep(2000);
    message.channel.send("!move O-O");
    await sleep(2000);
    message.channel.send("!move O-O");
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
