const Discord = require("discord.js");

module.exports = {
    name: "queue",
    aliases: ['q'],
    cooldown: 1000 * 5,
    description: "Shows the current Queue",


    async run(client, message, args) {
        const queue = client.distube.getQueue(message)
        if (!queue) {
            message.reply('Nothing playing right now!')
        } else {
            message.reply(
                `Current queue:\n${queue.songs
                    .map(
                        (song, id) =>
                            `**${id ? id : 'Playing'}**. ${song.name} - \`${song.formattedDuration
                            }\``,
                    )
                    .slice(0, 10)
                    .join('\n')}`,
            )
        }
    }
}

