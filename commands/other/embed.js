const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const commandFolders = fs.readdirSync('commands');

module.exports = {
    name: "embed",
    aliases: ['e'],
    cooldown: 1000 * 5,
    description: "test command",


    async run(client, message, args) {

        const embed = new MessageEmbed()
            .setTitle("General Information")
            .setAuthor("Platz Bot v3")
            .setColor([37, 150, 190])
            .setDescription("This Bot's lead developer is: <@608381190336020494>")
            .setTimestamp()

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`commands/${folder}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {

                const command = require(`commands/${folder}/${file}`);

                embed.addField(command.name, command.description)
            }
        }


        return message.channel.send({ embeds: [embed] });
    }

}