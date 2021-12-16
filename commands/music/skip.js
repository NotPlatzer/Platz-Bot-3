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
            await client.distube.jump(message, parseInt(args[0]))
                .catch(err => { return message.channel.send("Invalid song number.") });
            await message.reply("Jumped to song no: " + parseInt(args[0]) + " in Queue");
        }

    }
}