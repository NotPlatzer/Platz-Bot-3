const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const commandFolders = fs.readdirSync("commands");

module.exports = {
  name: "mc",
  aliases: [""],
  cooldown: 1000 * 0,
  description: "Shows Status and Info about a MC server",
  usage: "mc {ip} {optional port}",

  async run(client, message, args, GuildPrefix, messageGuild) {
    var ip = args[0];
    var port = args[1];

    console.log(ip + " " + port);

    mc.statusJava("play.cubecraft.net", 25565)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  },
};
