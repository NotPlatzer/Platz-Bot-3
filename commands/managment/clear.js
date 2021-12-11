const Discord = require("discord.js");

module.exports = {
    name: "clear",
    aliases: ['cl'],
    cooldown: 1000 * 5,
    description: "clears mesages",


    async run(client, message, args) {

        async function clear() {
            message.delete();
            message.channel.bulkDelete(5)
                .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                .catch(console.error);
        }
        clear();
    }

}