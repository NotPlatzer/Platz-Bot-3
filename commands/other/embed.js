module.exports = {
    name: "embed",
    aliases: ['e'],
    cooldown: 1000 * 5,
    description: "test command",


    async run(client, message, args) {
        const { MessageEmbed } = require("discord.js");

        const embed = new MessageEmbed()
        .setTitle("General Information")
        .setAuthor("Platz Bot v3")
        .setColor([37, 150, 190])
        .setDescription("This Bots lead developer is: <@608381190336020494>")
        .setTimestamp()

        console.log(embed);
        return message.channel.send({ embeds: [embed] });
    }

}