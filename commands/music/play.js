const Discord = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  name: "play",
  aliases: ["p"],
  cooldown: 0,
  description: "Plays a song/playlist",
  usage: "play {song/playlist}",

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.voice.channel)
      return message.reply("You have to be in a voice channel!");

      const connections = getVoiceConnection(message.member.voice.channelid);

    console.log(connections);

    if (client.voiceState !== undefined) {
      if (client.voiceState.channelid !== message.member.voice.channelid)
        return message.reply(
          "You have to be in the same voice channel as the Bot!"
        );
    }
    const music = args.join(" ");
    if (!music) return message.reply("Please provide a Song!");

    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.channel.guild.id,
      adapterCreator: message.channel.guild.voiceAdapterCreator,
    });
    await client.distube.play(message, music);
  },
};

//loop thrugh every connected vc on, if there is no vc that is on the server play.
//IF a vc is found that is on the server check if it matches the authors vc if not RETURN
