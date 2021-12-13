const Discord = require("discord.js");
const mongoose = require('mongoose');
const Guild = require('/app/db_models/guild.js');

module.exports = {
    name: "changePrefix",
    aliases: ['cp'],
    cooldown: 1000 * 5,
    description: "Changes the prefix",
    usage: "changePrefix {new prefix}",


    async run(client, message, args, GuildPrefix) {
        console.log(Guild)

        const updateguild = await Guild.findOneAndUpdate({
            id: message.guild.id
        }, {
            prefix: args.join(" ")[0]
        }, {
            new: true
        }
        );

        message.reply("Changed Prefix to: " + updateguild.prefix)
        
    }

}