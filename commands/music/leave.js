const Discord = require("discord.js");


module.exports = {
    name: "leave",
    aliases: ['leave', 'die'],
    cooldown: 1000 * 5,
    description: "leaves the vc",


    async run(client, message, args) {

        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        message.member.voice.channel.leave();
        await message.reply("**Left the Channel**");
    }
}