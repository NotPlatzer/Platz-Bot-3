const Discord = require("discord.js");
const mongoose = require('mongoose');
const Guild = require('db_models\\guild.js');

module.exports = {
    name: "changeindex",
    aliases: ['ci'],
    cooldown: 1000 * 5,
    description: "ping command",


    async run(client, message, args) {
        
        Guild.findOneAndUpdate({
            id: message.guildid
        }, {
            prefix: '.'
        })

    }
    
}