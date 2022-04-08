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
    var newMessage;

    message.channel.send("!resign <@608381190336020494>");
    newMessage = false;
    while (!newMessage) {
      await sleep(1000);
      message.channel.messages
        .fetch({ limit: 1 })
        .then((messages) => {
          let lastMessage = messages.first();
          if (lastMessage.author.id !== "917878990478377020") {
            newMessage = true;
          }
        })
        .catch(console.error);
    }
    message.channel.send("!chess <@608381190336020494>");
    newMessage = false;
    while (!newMessage) {
      await sleep(1000);
      message.channel.messages
        .fetch({ limit: 1 })
        .then((messages) => {
          let lastMessage = messages.first();
          if (lastMessage.author.id !== "917878990478377020") {
            newMessage = true;
          }
        })
        .catch(console.error);
    }
    message.channel.send("!move O-O");
    newMessage = false;
    while (!newMessage) {
      await sleep(1000);
      message.channel.messages
        .fetch({ limit: 1 })
        .then((messages) => {
          let lastMessage = messages.first();
          if (lastMessage.author.id !== "917878990478377020") {
            newMessage = true;
          }
        })
        .catch(console.error);
    }
    message.channel.send("!move O-O");
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
