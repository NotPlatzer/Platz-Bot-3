const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "embed",
    aliases: ['e'],
    cooldown: 1000 * 5,
    description: "test command",


    async run(client, message, args) {


        const word = new MessageEmbed()
            .setDescription(``)
            .setColor("")
            .setTitle("")
            .setAuthor("")

        return message.channel.send({ embeds: [word] });
    }

}