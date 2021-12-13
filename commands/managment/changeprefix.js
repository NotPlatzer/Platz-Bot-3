const Discord = require("discord.js");
const mongoose = require('mongoose');
const Guild = require('/app/db_models/guild.js');

module.exports = {
    name: "changeprefix",
    aliases: ['cp'],
    cooldown: 1000 * 5,
    description: "ping command",


    async run(client, message, args) {
        console.log(Guild)

        const updateguild = await Guild.findOneAndUpdate({
            id: message.guild.id
        }, {
            prefix: args.join(" ")[0]
        }, {
            new: true
        }
        );

        console.log(updateguild.prefix);
    }

}