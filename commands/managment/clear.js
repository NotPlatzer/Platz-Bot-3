const Discord = require("discord.js");

module.exports = {
    name: "clear",
    aliases: ['cl'],
    cooldown: 1000 * 5,
    description: "clears mesages",


    async run(client, message, args) {
        msg = message;
        async function clear() {
            msg.delete();
            const fetched = await msg.channel.fetchMessages({ limit: 99 });
            msg.channel.bulkDelete(fetched);
        }
        clear();
    }

}