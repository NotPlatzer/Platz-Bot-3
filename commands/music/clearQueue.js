const Discord = require("discord.js");


module.exports = {
    name: "clearQueue",
    aliases: ['cq', 'clearqueue', 'clearQueue'],
    cooldown: 1000 * 1,
    description: "Clears the Queue",
    usage: "clearQueue",

    async run(client, message, args, GuildPrefix, messageGuild) {
        const queue = client.distube.getQueue(message)
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");
        if (!queue || queue.songs.length <= 1) return message.reply("There is nothing to clear!");

        queue.songs = [queue.songs[0]]

        await message.reply("Cleared")
    }
}