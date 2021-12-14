const Discord = require("discord.js");

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

            message.reply(
                `**${queue.songs.length}** Songs in current queue!\nQueue duration: \`${queue.formattedDuration}\`\n${queue.songs
                    .map(
                        (song, id) =>
                            `**${id ? id : 'Playing'}**. ${song.name} - \`${song.formattedDuration
                            }\` ${console.log(song.name + ' Song added to queue listing')}`,
                    )
                    .slice(0, 11)
                    .join('\n')}`,
            )
        }
    }
}

