module.exports = {
    name: "embed",
    aliases: ['e'],
    cooldown: 1000 * 5,
    description: "test command",


    async run(client, message, args) {
        const { MessageEmbed } = require("discord.js");

        const embed = new MessageEmbed()
        .setTitle("General Information")
        .setAuthor("Platz Bot v3", "https://yagami.xyz/content/uploads/2018/11/discord-512-1.png","https://yagami.xyz")
        .setColor(GREYPLE)
        .setDescription("This Bots lead developer is: @platz")
        .setImage("http://i.imgur.com/yVpymuV.png")
        .setThumbnail("https://yagami.xyz/content/uploads/2018/11/discord-512-1.png")
        .setTimestamp()

        console.log(embed);
        return message.channel.send({ embeds: [embed] });
    }

}