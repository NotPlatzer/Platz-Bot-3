const Discord = require("discord.js");
const lyricsFinder = require('@sujalgoel/lyrics-finder');
const functions = require('/app/data/functions.js');

module.exports = {
    name: "lyrics",
    aliases: ['ly'],
    cooldown: 1000 * 5,
    description: "Shows the Lyrics of the Current Song",
    usage: "lyrics",


    async run(client, message, args, GuildPrefix, messageGuild) {

        const queue = client.distube.getQueue(message)
        if (!queue) return message.reply("There is nothing to stop!");
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        queue.songs
            .map((song, id) => {
                if (id === 0) {
                    //Do things to first song
                    lyricsFinder.LyricsFinder(song.name).then(data => {
                        console.log(typeof functions.toDiscordTextformat)
                        var messageData = functions.toDiscordTextformat(data);
                        messageData.forEach(datafraction => {
                            message.channel.send(datafraction)
                        })


                    }).catch(err => {
                        console.log(err);
                    })

                }
            })
    }
}