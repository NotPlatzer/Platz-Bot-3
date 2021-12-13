module.exports = {
    name: "embed",
    aliases: ['e'],
    cooldown: 1000 * 5,
    description: "test command",


    async run(client, message, args) {
        const Discord = require("discord.js");

        const embed = new Discord.MessageEmbed()
            embed.setTitle("Title")
            embed.setDescription("Description");
        
        console.log(embed);
        return message.channel.send(embed);
    }

}