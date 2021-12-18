const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const Guild = require('/app/db_models/guild.js');

module.exports = {
    name: "statistic",
    aliases: ['stat'],
    cooldown: 1000 * 5,
    description: "Shows statistics about the Bot",
    usage: "stat",


    async run(client, message, args, GuildPrefix, messageGuild) {

        Guild.findOne({ id: '809835346450710598' }).then((modGuild) => {
            const embed = new MessageEmbed()
                .setTitle("Statistics")
                .setAuthor("Platz Bot v3", "https://cdn.discordapp.com/avatars/917878990478377020/7f147973452d4a6bacbb6132b8e4a18d.png")
                .setColor([37, 150, 190])
                .setFooter(`To report bugs send a message to the dev`)
                .addField(`🤖Servers: `, `${client.guilds.cache.size}`)
                .addField(`:musical_note:Played Songs: `, `\`${modGuild.playedSongs}\``)
                .addField(`Connected Vcs: `, `\`${modGuild.connectedVCs}\``)
                .setThumbnail(client.user.avatarURL())

            let totalSeconds = (client.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);

            let uptime = `\`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes and \`${seconds}\` seconds`;

            embed.addField(`:clock2:Uptime: `, uptime)

            message.channel.send({ embeds: [embed] });

        })


    }

}