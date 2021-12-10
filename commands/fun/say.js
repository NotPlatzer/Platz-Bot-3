const Discord = require("discord.js");

module.exports = {
    name: "say",
    aliases: ['r'],
    cooldown: 1000 * 3,
    description: "Repeats everything you say",


    async run(client, message, args) {
        if(args.length <= 0) return message.reply("Please tell me wha to say")
        message.reply(args.join(" "));


    }

}