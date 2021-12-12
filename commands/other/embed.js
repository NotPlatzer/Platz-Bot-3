module.exports = {
    name: "embed",
    aliases: ['e'],
    cooldown: 1000 * 5,
    description: "test command",


    async run(client, message, args) {
        const { MessageEmbed } = require("discord.js");

        const word = new MessageEmbed()
            .setTitle("Title");

        console.log(word);
        return message.channel.send({ embeds: [word] });
    }

}