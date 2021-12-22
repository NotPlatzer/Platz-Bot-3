const Discord = require("discord.js");
const lyricsFinder = require('@sujalgoel/lyrics-finder');

module.exports = {
    name: "lyrics",
    aliases: ['ly'],
    cooldown: 1000 * 5,
    description: "Shows the Lyrics of the Current Song",
    usage: "lyrics",


    async run(client, message, args, GuildPrefix, messageGuild) {
        function toDiscordTextformat(text) {
            var array = [];

            if (text === undefined) return array;

            const textlen = text.length / 2000;
            if (textlen < 1) {
                array.push(text);
                return array;
            } else {

                var bis = 2000;
                var von = 0;
                var c = 0;

                while (c <= textlen) {
                    var done = false;
                    //bis im string und don olm -1 bis " " oder , oder .
                    while (done === false) {

                        var reduced = 0;

                        if (text.charAt(bis - 1) === " " || text.charAt(bis - 1) === "," || text.charAt(bis - 1) === "." || text.charAt(bis - 1) === "!" || text.charAt(bis - 1) === "?" || text.charAt(bis - 1) === "  ") {
                            bis--;
                            if (von !== 0) {
                                reduced--;
                            }
                            done = true;
                        }
                        else {
                            bis--;
                            if (von !== 0) {
                                reduced--;
                            }
                        }
                    }
                    var cutoff = text.substring(von, bis);

                    if (cutoff < 100) {

                    } else {
                        array.push(cutoff);
                        c = c + 1;
                        von = von + 2000 - reduced - 1;
                        bis = bis + 2000;
                        cutoff = 0;
                    }
                }
            }
            return array;
        }

        const queue = client.distube.getQueue(message)
        if (!queue) return message.reply("There is nothing playing!");
        if (!message.member.voice.channel) return message.reply("You have to be in a voice channel!");

        queue.songs
            .map((song, id) => {
                if (id === 0) {
                    //Do things to first song
                    lyricsFinder.LyricsFinder(song.name).then(data => {

                        var messageData = toDiscordTextformat(data);

                        message.channel.send(`Lyrics for: **${song.name}**`)
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