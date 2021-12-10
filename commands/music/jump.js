const Discord = require("discord.js");

module.exports = {
    name: "shuffle",
    aliases: ['su'],
    cooldown: 1000 * 0,
    description: "Shuffles the Queue",


    async run(client, message, args) {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.reply("There is nothing to Jump!");
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        await distube.jump(message, parseInt(args[0]))
            .catch(err => message.channel.send("Invalid song number."));
        message.reply("Jumped to song no: " + parseInt(args[0]));

    }

}

