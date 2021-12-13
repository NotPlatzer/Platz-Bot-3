module.exports = {
    name: "embed",
    aliases: ['e'],
    cooldown: 1000 * 5,
    description: "test command",


    async run(client, message, args) {
        const { MessageEmbed } = require("discord.js");

        const embed = new MessageEmbed()
            .setTitle("Title")
            .setDescription("Description");

        console.log(embed);
        return message.channel.send({ embeds: [embed] });
    }

}