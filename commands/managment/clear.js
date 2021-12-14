const Discord = require("discord.js");

module.exports = {
    name: "clear",
    aliases: ['cl'],
    cooldown: 1000 * 0,
    description: "Clears messages",
    usage: "clear {amount of messages to clear}",

    async run(client, message, args, GuildPrefix) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply("You dont have permission to do this!");

        var numOfMesasges = parseInt(args.slice(0).join(' '));
        if (!numOfMesasges) return message.reply("Please enter a amount of mesages to be deleted");
        if(numOfMesasges > 100) return message.reply("Number cant be bigger then 100");
        message.delete();
        message.channel.bulkDelete(numOfMesasges)
            .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
            .catch(console.error);

    }

}