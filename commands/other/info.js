const Discord = require("discord.js");

module.exports = {
    name: "info",
    aliases: ['pi'],
    cooldown: 1000 * 5,
    description: "ping command",


    async run (client, message, args) {
        message.reply("Pong");
    }

}