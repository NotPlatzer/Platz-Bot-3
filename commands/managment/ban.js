const Discord = require("discord.js");
const { Permissions } = require('discord.js');

module.exports = {
    name: "ban",
    aliases: ['b'],
    cooldown: 1000 * 0,
    description: "bans a member",


    async run(client, message, args) {

        if(1 === 1) return;

        const user = message.mentions.members.first();
        const reason = args.slice(1).join(' ');
        if(user === client.user.id) return message.reply("nope");
        if(!user) return message.reply("Tell me someone to Ban!");
        if (!reason) return message.reply('Tell me a reason!');
        if(!message.guild.me.permissions.has("BAN_MEMBERS")) return message.reply("can not")
        if(!message.author.permissions.has("BAN_MEMBERS")) return message.reply("you cant");

        if (user) {

            await user.ban({
                reason: reason,
            }).then(() => {
                message.reply(`${user} was Banned by ${message.author}`)
            })

        } else {
            message.reply('cant find the user!')
        }

    }

}

