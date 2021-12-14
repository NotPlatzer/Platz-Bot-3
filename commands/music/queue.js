const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "queue",
    aliases: ['q'],
    cooldown: 1000 * 5,
    description: "Shows the current Queue",
    usage: "queue",


    async run(client, message, args, GuildPrefix, messageGuild) {
        const queue = client.distube.getQueue(message)
        const status = queue =>
            `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ')
            || 'Off'}\` | Loop: \`${queue.repeatMode
                ? queue.repeatMode === 2
                    ? 'All Queue'
                    : 'This Song'
                : 'Off'
            }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

        var displayedQueueSongs = 0;

        if (!queue) {
            message.reply('Nothing playing right now!')
        } else {

            const queueembed = new MessageEmbed()
                .setTitle("Current Queue")
                .setAuthor("Platz Bot v3", "https://cdn.discordapp.com/avatars/917878990478377020/7f147973452d4a6bacbb6132b8e4a18d.png")
                .setColor([37, 150, 190])
                .setFooter(`To report bugs send a message to the dev`)


            queue.songs
                .map((song, id) => {
                    if (id === 0) {
                        queueembed.setThumbnail(song.thumbnail)
                            .setDescription(`Queue lenght: **${queue.songs.length}**\nQueue duration: \`${queue.formattedDuration}\`\n\n**Current Song: ${song.name}** \`${song.formattedDuration}\`\n\n${status(queue)}`)

                        displayedQueueSongs++;
                    }
                    else if (displayedQueueSongs <= 10) {
                        queueembed.addField(`**${id}**. ${song.name}`, `\`${song.formattedDuration}\``)
                        displayedQueueSongs++;
                    }
                }
                )

            message.reply({ embeds: [queueembed] });

        }
    }
}

