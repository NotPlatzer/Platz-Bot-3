const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const commandFolders = fs.readdirSync('commands');

module.exports = {
    name: "help",
    aliases: ['h'],
    cooldown: 1000 * 5,
    description: "Shows general information about the Bot",
    usage: "help",


    async run(client, message, args, GuildPrefix, messageGuild) {
        
        const embed = new MessageEmbed()
            .setTitle("General Information")
            .setAuthor("Platz Bot v3", "https://cdn.discordapp.com/avatars/917878990478377020/7f147973452d4a6bacbb6132b8e4a18d.png")
            .setColor([37, 150, 190])
            .setDescription(`This Bot's lead developer is: <@608381190336020494>\nTo get more info about a command use ${GuildPrefix}info {command name}`)
            .setFooter(`To report bugs send a message to the dev`)

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`/app/commands/${folder}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {

                const command = require(`/app/commands/${folder}/${file}`);

                embed.addField(command.name, command.description, true)
            }
        }


        return message.channel.send({ embeds: [embed] });
    }

}