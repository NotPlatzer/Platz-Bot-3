const Discord = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ['lo'],
  cooldown: 1000 * 5,
  description: "ping command",


  async run(client, message, args) {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.reply("There is nothing to loop!");
    if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

    const mode = client.distube.setRepeatMode(message)
    message.reply(`Set repeat mode to \`${mode ? mode === 2 ? 'All Queue' : 'This Song' : 'Off'}\``)
  }

}