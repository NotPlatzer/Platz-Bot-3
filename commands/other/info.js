const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const commandFolders = fs.readdirSync('commands');

module.exports = {
    name: "info",
    aliases: ['pi'],
    cooldown: 1000 * 5,
    description: "Shows information about the Bot",


    async run(client, message, args) {
        const embed = new MessageEmbed()
            .setTitle("General Information")
            .setAuthor("Platz Bot v3")
            .setColor([37, 150, 190])
            .setDescription("This Bot's lead developer is: <@608381190336020494>")
            .setTimestamp()

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`/app/commands/${folder}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {

                const command = require(`/app/commands/${folder}/${file}`);

                embed.addField(command.name, command.description)
            }
        }


        return message.channel.send({ embeds: [embed] });
    }

}