const Discord = require("discord.js");
const { Permissions } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const Guild = require("/app/db_models/guild.js");

module.exports = {
  name: "test",
  aliases: ["t"],
  cooldown: 1000 * 0,
  description: "",
  usage: "",

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (message.author.id !== "608381190336020494") return;

    const filter = (m) => m.author.id === message.author.id;
    console.log(filter);
    message.reply(
      `⚠This will cause everyone that has the new OR old muterole to be Muted!!!!\nType YES or NO (Will expire in 10 seconds)`
    );
    message.channel
      .awaitMessages({ filter, max: 4, time: 1_000, errors: ["time"] })
      .then(async (collected) => {
        console.log(collected);
      });
  },
};