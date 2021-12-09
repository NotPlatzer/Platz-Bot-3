const Discord = require("discord.js");


module.exports = {
    name: "skip",
    aliases: ['sk', 'ski'],
    cooldown: 1000 * 1,
    description: "skips song",


    async run(client, message, args) {
        const queue = client.distube.getQueue(message)
        if (!queue || queue.songs.lenght === 1) return message.reply("There is nothing to skip!");
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        await client.distube.skip(message)
        await message.reply("Skipped")
    }
}