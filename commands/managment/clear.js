const Discord = require("discord.js");

module.exports = {
    name: "info",
    aliases: ['pi'],
    cooldown: 1000 * 5,
    description: "ping command",


    async run(client, message, args) {
        async function clear() {
            msg.delete();
            const fetched = await msg.channel.fetchMessages({ limit: 99 });
            msg.channel.bulkDelete(fetched);
        }
        clear();
    }

}