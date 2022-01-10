const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const commandFolders = fs.readdirSync("commands");
const mc = require("minecraft-server-status-simple");

module.exports = {
  name: "mc",
  aliases: [""],
  cooldown: 1000 * 0,
  description: "Shows Status and Info about a MC server",
  usage: "mc {ip}:{optional port}",

  async run(client, message, args, GuildPrefix, messageGuild) {
    var data = args[0].split(":");

    var port = "";
    var ip = data[0];
    if (data.length > 1) {
      var port = data[1];
    }

    if (port == "") {
      port = 25565;
    }

    mc.statusJava(ip, port)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  },
};
