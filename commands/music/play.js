const Discord = require("discord.js");

module.exports = {
  name: "play",
  aliases: ["p"],
  cooldown: 0,
  description: "Plays a song/playlist",
  usage: "play {song/playlist}",

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.voice.channel)
      return message.reply("You have to be in a voice channel!");

    console.log(client.voice.adapters);

    if (client.voiceState !== undefined) {
      if (client.voiceState.channelid !== message.member.voice.channelid)
        return message.reply(
          "You have to be in the same voice channel as the Bot!"
        );
    }
    const music = args.join(" ");
    if (!music) return message.reply("Please provide a Song!");

    await client.distube.play(message, music);
  },
};
