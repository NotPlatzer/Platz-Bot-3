const Discord = require("discord.js");


module.exports = {
    name: "play",
    aliases: ['p'],
    cooldown: 0,
    description: "Plays a song/playlist",


    async run (client, message, args) {
        if(!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        const music = args.join(" ");
        if(!music) return message.reply("Please provide a Song!");

        await client.distube.play(message, music);

        
    }

}