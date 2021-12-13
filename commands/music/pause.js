const Discord = require("discord.js");

module.exports = {
    name: "pause",
    aliases: ['pa'],
    cooldown: 1000 * 5,
    description: "Pauses the Music",


    async run(client, message, args, GuildPrefix) {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.reply("There is nothing to pause!");
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");
        
        client.distube.pause(message)
        message.reply("Music is Paused");

    }

}