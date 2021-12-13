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
            console.log(typeof queue)
            console.log(typeof queue.songs)
            message.reply(
                `${queue.songs.size} Songs in current queue:\n${queue.songs
                    .map(
                        (song, id) =>
                            `**${id ? id : 'Playing'}**. ${song.name} - \`${song.formattedDuration
                            }\``,
                    )
                    .slice(0, 11)
                    .join('\n')}`,
            )
        }
    }
}

