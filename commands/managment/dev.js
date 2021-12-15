const Discord = require("discord.js");
const { Permissions } = require('discord.js');
const Guild = require('/app/db_models/guild.js');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "dev",
    aliases: ['d'],
    cooldown: 1000 * 5,
    description: "Changes the prefix",
    usage: "changePrefix {new prefix}",


    async run(client, message, args, GuildPrefix, messageGuild) {

        if (message.author.id !== '608381190336020494') return;

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        const playedsongs = Guild.findOne({ id: '809835346450710598' }, function (err, doc) {
            var newsongscount = doc.playedSongs;
            return newsongscount;
        });


        const embed = new MessageEmbed()
            .setTitle("Developer Information")
            .setAuthor("Platz Bot v3", "https://cdn.discordapp.com/avatars/917878990478377020/7f147973452d4a6bacbb6132b8e4a18d.png")
            .setColor([37, 150, 190])
            .setDescription(`Developer Information about the Bot`)
            .setFooter(`To report bugs send a message to the dev`)
            .addField(`Uptime: `, uptime)
            .addField(`Played Songs: `, playedsongs)
        // .addField(`Connected VCs`, Voice.)


        message.channel.send({ embeds: [embed] });


    }

}