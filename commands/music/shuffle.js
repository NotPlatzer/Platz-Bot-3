const Discord = require("discord.js");

module.exports = {
    name: "suffle",
    aliases: ['su'],
    cooldown: 1000 * 0,
    description: "Shuffles the Queue",


    async run(client, message, args) {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.reply("There is nothing to Shuffle!");
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        client.distube.shuffle(message);


    }

}