const Discord = require("discord.js");
const { Permissions } = require('discord.js');

module.exports = {
    name: "ban",
    aliases: ['b'],
    cooldown: 1000 * 0,
    description: "Bans a member",


    async run(client, message, args) {

        if(1 == 1) return;

        let reason = args.slice(1).join(" ");
        if (!reason) reason = "Unspecified";

        const target = message.mentions.members.first() || message.guild.users.cache.get(args[0]);

        if (!target) {
            return message.channel.send(
                `**${message.author.username}**, Please mention the person who you want to ban.`
            );
        }

        if (target.id === message.author.id) {
            return message.channel.send(
                `**${message.author.username}**, You can not ban yourself!`
            );
        }
        if (target.id === message.guild.ownerId) {
            return message.channel.send("You cannot Ban The Server Owner");
        }

        let embed = new discord.MessageEmbed()
            .setTitle("Action : Ban")
            .setDescription(`Banned ${target} (${target.id})\nReason: ${reason}`)
            .setColor("#ff2050")
            .setThumbnail(target.avatarURL)
            .setFooter(`Banned by ${message.author.tag}`);

        await message.guild.bans.create(target, {
            reason: reason
        }).then(() => {
            message.channel.send({ embeds: [embed] });
        });


    }

}

