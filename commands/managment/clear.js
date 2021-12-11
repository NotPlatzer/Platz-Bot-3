const Discord = require("discord.js");

module.exports = {
    name: "clear",
    aliases: ['cl'],
    cooldown: 1000 * 5,
    description: "clears mesages",


    async run(client, message, args) {
        var numOfMesasges = parseInt(args.slice(0).join(' '));
        if (!numOfMesasges) return message.reply("Please enter a amount of mesages to be deleted");
        
        message.delete();
        message.channel.bulkDelete(numOfMesasges)
            .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
            .catch(console.error);

    }

}