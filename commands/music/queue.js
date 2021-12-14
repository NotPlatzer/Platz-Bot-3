const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "queue",
    aliases: ['q'],
    cooldown: 1000 * 5,
    description: "Shows the current Queue",
    usage: "queue",


    async run(client, message, args, GuildPrefix) {
        const queue = client.distube.getQueue(message)
        if (!queue) {
            message.reply('Nothing playing right now!')
        } else {

            const queueembed = new MessageEmbed()
                .setTitle("Current Queue")
                .setAuthor("Platz Bot v3", "https://cdn.discordapp.com/avatars/917878990478377020/7f147973452d4a6bacbb6132b8e4a18d.png")
                .setColor([37, 150, 190])
                .setDescription(`Queue lenght: **${queue.songs.length}**\nQueue duration: \`${queue.formattedDuration}\``)
                .setFooter(`To report bugs send a message to the dev`)


            queue.songs
                .map((song, id) =>
                    queueembed.addField(`**${id ? id : 'Playing'}**. ${song.name}`, `\`${song.formattedDuration}\``),
                )
                .slice(0, 11)
                .join('\n')
            
                message.reply({ embeds: [queueembed] });

        }
    }
}

