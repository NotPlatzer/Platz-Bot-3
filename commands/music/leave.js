const Discord = require("discord.js");


module.exports = {
    name: "leave",
    aliases: ['leave', 'die'],
    cooldown: 1000 * 5,
    description: "Leaves the VC",


    async run(client, message, args, GuildPrefix) {

        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        client.leaveVoiceChannel(message.member.voiceState.channel.id);
        await message.reply("**Left the Channel**");
    }
}