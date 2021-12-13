const Discord = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ['pi'],
    cooldown: 1000 * 5,
    description: "ping/test command",


    async run(client, message, args, GuildPrefix) {
        message.reply("Pong");

    }

}