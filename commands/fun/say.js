const Discord = require("discord.js");

module.exports = {
    name: "say",
    aliases: ['say'],
    cooldown: 1000 * 3,
    description: "Repeats everything you say",
    usage: "say {something to say}",


    async run(client, message, args, GuildPrefix, messageGuild) {

        if (args.length <= 0) return message.reply("Please tell me what to say")
        if (args.join(" ").includes("nigger") || args.join(" ").includes("https://discord.com")) return message.reply("nahhh i dont say that shit")
        message.delete(1000);
        message.channel.send(args.join(" "));
      
    }

}