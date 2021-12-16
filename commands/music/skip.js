const Discord = require("discord.js");


module.exports = {
    name: "skip",
    aliases: ['sk', 'ski'],
    cooldown: 1000 * 1,
    description: "Skips song",
    usage: "skip",


    async run(client, message, args, GuildPrefix, messageGuild) {
        const queue = client.distube.getQueue(message)
        if (!queue || queue.songs.length === 1) return message.reply("There is nothing to skip!");
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        if (!args[0]) {
            await client.distube.skip(message)
            await message.reply("Skipped")
        }
        else {
            console.log(parseInt(args[0]))
            if (parseInt(args[0]) === NaN) return message.reply("Invalid song number.")

            await client.distube.jump(message, parseInt(args[0]))
            message.reply("Jumped to song no: " + parseInt(args[0]) + " in Queue");
        }

    }
}