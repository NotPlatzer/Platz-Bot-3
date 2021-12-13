const Discord = require("discord.js");


module.exports = {
    name: "leave",
    aliases: ['leave', 'die'],
    cooldown: 1000 * 5,
    description: "Leaves the VC",
    usage: "leave",


    async run(client, message, args, GuildPrefix) {

        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");
        if(!message.guild.me.voice) return message.reply("Im not in a voice channel!");


        message.guild.me.voice.disconnect();
        await message.reply("**Left the Channel**");
    }
}