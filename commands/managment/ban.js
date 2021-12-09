const Discord = require("discord.js");
const { Permissions } = require('discord.js');

module.exports = {
    name: "ban",
    aliases: ['b'],
    cooldown: 1000 * 0,
    description: "bans a member",


    async run(client, message, args) {

        const user = message.mentions.members.first();
        const reason = args.slice(1).join(' ');
        if(!user) return message.reply("Tell me someone to Ban!");
        if (!reason) return message.reply('Tell me a reason!');
        if(!message.guild.me.permissions.has("BAN_MEMBERS")) return message.reply("can not")
        if(!message.member.permissions.has("BAN_MEMBERS")) return message.reply("cant");

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

