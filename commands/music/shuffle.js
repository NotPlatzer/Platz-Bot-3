const Discord = require("discord.js");

module.exports = {
    name: "shuffle",
    aliases: ['su'],
    cooldown: 1000 * 0,
    description: "Shuffles the Queue",
    usage: "shuffle",


    async run(client, message, args, GuildPrefix, messageGuild) {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.reply("There is nothing to Shuffle!");
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        await client.distube.shuffle(message);
        await message.reply("Shuffled the Queue!")


    }

}