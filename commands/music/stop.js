const Discord = require("discord.js");


module.exports = {
    name: "stop",
    aliases: ['leave', 'die'],
    cooldown: 1000 * 5,
    description: "Stops song",
    usage: "stop",

    async run(client, message, args, GuildPrefix) {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.reply("There is nothing to stop!");
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");
        
        await client.distube.stop(message);
        await message.reply("**Stopped Playing**");
    }
}