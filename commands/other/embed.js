const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "embed",
    aliases: ['e'],
    cooldown: 1000 * 5,
    description: "ping command",


    async run(client, message, args) {
        const embed = new Discord.MessageEmbed().setDescription("Hello World!");

        message.channel.send({ embeds: [embed] });
    }

}