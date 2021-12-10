const Discord = require("discord.js");

module.exports = {
    name: "say",
    aliases: ['say'],
    cooldown: 1000 * 3,
    description: "Repeats everything you say",


    async run(client, message, args) {
        if(args.length <= 0) return message.reply("Please tell me what to say")
        if(args.join(" ").includes("nigger")) return message.reply("nahhh i dont say that shit")
        message.reply(args.join(" "));


    }

}