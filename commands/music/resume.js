const Discord = require("discord.js");

module.exports = {
    name: "resume",
    aliases: ['re'],
    cooldown: 1000 * 5,
    description: "Resumes the Music",
    usage: "resume",


    async run(client, message, args, GuildPrefix) {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.reply("There is nothing to resume!");
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        client.distube.resume(message)
        message.reply("Resumed");

    }

}