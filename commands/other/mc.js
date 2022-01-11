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
        const serverembed = new MessageEmbed();

        if (server.online == false) {
          serverembed
            .setAuthor(
              "Platz Bot v3",
              "https://cdn.discordapp.com/avatars/917878990478377020/7f147973452d4a6bacbb6132b8e4a18d.png"
            )
            .setFooter(`To report bugs send a message to the dev`)
            .setColor([255, 0, 0])
            .setTitle(`${server.ip}`)
            .addField(`Online:`, `${server.online}\n`);
        } else {
          serverembed
            .setAuthor(
              "Platz Bot v3",
              "https://cdn.discordapp.com/avatars/917878990478377020/7f147973452d4a6bacbb6132b8e4a18d.png"
            )
            .setFooter(`To report bugs send a message to the dev`)
            .setDescription(`${server.motd.clean}`)
            .setTitle(`${server.ip}`);

          if (
            server.players.online > 0 &&
            server.players.list !== undefined
          ) {
            var players = server.players.list;
            if (players.length > 9) {
              var playersOnDisplay = players.slice(0, 9);
              playersOnDisplay = playersOnDisplay.join("\r\n");
              var numberOfPlayersNotOnDisplay = players.length - 9;
              var playersFORMATED =
                playersOnDisplay + "\n" + numberOfPlayersNotOnDisplay;
            } else {
              var playersFORMATED = players.join("\r\n");
            }

            serverembed.addField(
              `Players: ${server.players.online + "/" + server.players.max}`,
              `${playersFORMATED}`
            );
          } else {
            serverembed.addField(
              `Players: ${server.players.online + "/" + server.players.max}`,
              `/`
            );
          }

          serverembed
            .addField(`Version:`, `${server.version}`)
            .addField(`Software:`, `${server.software}`)
            .addField(`Online:`, `${server.online}\n`)
            .setColor([77, 255, 0]);
        }
        message.reply({ embeds: [serverembed] });
      })
      .catch((err) => console.log(err));
  },
};
