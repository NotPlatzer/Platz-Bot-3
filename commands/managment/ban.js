const Discord = require("discord.js");
const { Permissions } = require('discord.js');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ban",
    aliases: ['b'],
    cooldown: 1000 * 0,
    description: "Bans a member",
    usage: "ban {@user to ban} {optional reason}",

    async run(client, message, args, GuildPrefix, messageGuild) {
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply("You dont have permission to do this!");
        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply("I dont have permission to do this!");

        let reason = args.slice(1).join(" ");
        if (!reason) reason = "Unspecified";

        const target = message.mentions.members.first();

        if (!target) {
            return message.reply(`Please mention the person who you want to ban`);
        }
        console.log(target.avatarURL());
        if (target.id === message.author.id) {
            return message.reply(`You can not ban yourself!`);
        }
        if (target.id === message.guild.ownerId) {
            return message.reply("You cannot Ban The Server Owner");
        }
        if (target.id === message.guild.me.id) {
            return message.reply("You can not Ban the Bot in this way");
        }
        if (message.author.id === '744283615562825899') {
            return message.reply("Prnoth... stop");
        }

        let embed = new MessageEmbed()
            .setTitle("Action : Ban")
            .setDescription(`Banned ${target} (${target.id})\nReason: ${reason}`)
            .setColor("#ff2050")
            .setThumbnail(target.avatarURL())
            .setFooter(`Banned by ${message.author.tag}`);

        await message.guild.bans.create(target, {
            reason: reason
        }).then(() => {
            message.reply({ embeds: [embed] });
        }).catch(error =>
            message.reply(
                `Sorry ${message.author} I couldn't ban this person. Maybe the person has a role above me.`
            )
        );


    }

}

