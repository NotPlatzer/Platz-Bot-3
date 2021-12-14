const Discord = require("discord.js");

module.exports = {
    name: "rate",
    aliases: ['r'],
    cooldown: 1000 * 5,
    description: "Rates something",
    usage: "rate {something to rate}",


    async run(client, message, args, GuildPrefix, messageGuild) {

        const random = Math.floor(Math.random() * 11);

        if (args.join(" ") == "platz" || args.join(" ") == "platzer" || args.join(" ") == "felix" || args.join(" ") == "<@608381190336020494>" || args.join(" ") == "kathi" || args.join(" ") == "cum") {
            message.reply(`I Rate **${args.join(" ")}** 10/10`);
        } else {
            message.reply(`I Rate **${args.join(" ")}** ${random}/10`);
        }


    }

}