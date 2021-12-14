const Discord = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ['pi'],
    cooldown: 1000 * 5,
    description: "ping/test command",
    usage: "ping",


    async run(client, message, args, GuildPrefix, messageGuild) {
        message.reply("Pong");

    }

}