const Discord = require("discord.js");
const mongoose = require('mongoose');
const Guild = require('/app/db_models/guild.js');

module.exports = {
    name: "changeindex",
    aliases: ['ci'],
    cooldown: 1000 * 5,
    description: "ping command",


    async run(client, message, args) {
        console.log(Guild)
        Guild.findOneAndUpdate({
            id: message.guild.id
        }, {
            prefix: '.'
        })

    }
    
}