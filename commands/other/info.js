const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const commandFolders = fs.readdirSync('commands');

module.exports = {
    name: "info",
    aliases: ['i'],
    cooldown: 1000 * 5,
    description: "Information about commands",
    usage: "Info",


    async run(client, message, args, GuildPrefix) {

        const firstargs = args.join(' ')[0];
        if (!firstargs) return message.reply("Please provide a command to show information");
        console.log(firstargs);

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`/app/commands/${folder}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {

                const command = require(`/app/commands/${folder}/${file}`);

                if (command.name == firstargs) {
                    message.reply(`${command.name} usage: ${GuildPrefix}${command.usage}`)
                }
            }
        }



    }

}