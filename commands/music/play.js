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

    message.guild.channels.cache
      .filter((c) => c.type === "GUILD_VOICE")
      .forEach(async (channel, id) => {
        console.log("OUTHER LOOP");
        console.log(JSON.stringify(channel.members, null, 4));
        channel.members.every((member) => {
          console.log("INNER LOOP " + member + " " + member.userId);
          if (member.userId == client.user.id) {
            console.log("Found the Client Channel: " + channel.id);
            const botvc = channel.id;
            return true;
          }
          return false;
        });
        if (typeof botvc !== undefined) {
          return true;
        } else {
          return false;
        }
      });
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
