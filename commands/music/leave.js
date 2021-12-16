const Discord = require("discord.js");
const { Permissions } = require('discord.js');

module.exports = {
    name: "leave",
    aliases: ['leave', 'die'],
    cooldown: 1000 * 5,
    description: "Leaves the VC",
    usage: "leave",


    async run(client, message, args, GuildPrefix, messageGuild) {
        
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");
        if (!message.guild.me.voice.channel) return message.reply("Im not in a voice channel!");
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)) return message.reply("I dont have permission to do this!");

        message.guild.me.voice.disconnect();
        await message.reply("**Left the Channel**");
    }
}