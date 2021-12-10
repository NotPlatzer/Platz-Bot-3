const Discord = require("discord.js");

module.exports = {
    name: "playlists",
    aliases: ['plist'],
    cooldown: 1000 * 3,
    description: "Adds a selected Playlist to the Queue",


    async run(client, message, args) {

        switch (args.join(" ")) {
            case "sad":
                client.distube.play(message, "https://open.spotify.com/playlist/27DlO8pYxgN8AttiE4L6RV?si=cfd817a3acc9407c");
                break;
            case "og":
                client.distube.play(message, "https://open.spotify.com/playlist/3RviHWVcqSpD6Ye7zjCllD?si=f6ec0f65acb149b9");
                break;
            case "vibe":
                client.distube.play(message, "https://open.spotify.com/playlist/0gVGrs8jZ856kFIleLXHVX?si=c9e7024792b94b91");
                break;
            case "party":
                client.distube.play(message, "https://open.spotify.com/playlist/1tzIp6T8rhOJFdgbRKHVxS?si=7feadcdae25b466e");
                break;
            case "rock":
                client.distube.play(message, "https://open.spotify.com/playlist/1OsViAzNJKTiP5sKrAuSNF?si=cff65e21de1f401b");
                break;
            default:
                message.reply("Current Playlists: **sad**, **og**, **vibe**, **party**, **rock**\nUsage: ,plist {playlist}");
        }

    }

}