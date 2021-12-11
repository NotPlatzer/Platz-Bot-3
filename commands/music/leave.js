const Discord = require("discord.js");


module.exports = {
    name: "leave",
    aliases: ['leave', 'die'],
    cooldown: 1000 * 5,
    description: "leaves the vc",


    async run(client, message, args) {

        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        client.leaveVoiceChannel(message.member.voiceState.channelID);
        await message.reply("**Left the Channel**");
    }
}