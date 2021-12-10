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
            default:
                message.reply("Current Playlists: **sad**, **og**");
        }

    }

}