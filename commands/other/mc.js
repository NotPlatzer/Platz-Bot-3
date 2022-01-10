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
      .then((server) => {
        console.log(ip + ":" + port);
        

        if (!server) {
          console.log("EROORFSAKJBGHBG")
          return message.reply(
            `Could not find any information on this server!`
          );
        }

        const serverembed = new MessageEmbed()
          .setAuthor(
            "Platz Bot v3",
            "https://cdn.discordapp.com/avatars/917878990478377020/7f147973452d4a6bacbb6132b8e4a18d.png"
          )
          .setFooter(`To report bugs send a message to the dev`)
          .setDescription(`${server.motd.raw}`)
          .setTitle(`${server.ip}`)
          .addField(
            `Players:`,
            `${server.players.online + "/" + server.players.max}`
          )
          .addField(`Version:`, `${server.version}`)
          .addField(`Software:`, `${server.software}`)
          .addField(`Online:`, `${server.online}`);

        if (server.online == true) {
          serverembed.setColor([77, 255, 0]);
        } else {
          serverembed.setColor([255, 0, 0]);
        }
        message.reply({ embeds: [serverembed] });
      })
      .catch((err) => console.log(err));
  },
};
