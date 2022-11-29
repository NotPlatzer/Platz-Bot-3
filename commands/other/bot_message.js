
module.exports = {
  name: "bm",
  aliases: ["bot"],
  cooldown: 0,
  description: "",
  usage: "help",
  ownerOnly: true,
  category: "other",

  async run(client, message, args, GuildPrefix, messageGuild) {
    const channels = ["809835346719670285", "779430085727092750"];
    for(var channel in channels){
        client.channels.cache.get(channel).send("Hello guys, this is NotPlatzer speaking, I am the developer of this bot and a few days ago I got a very sad message…\nIt said that from now on I have to pay for the hosting of the Bot which I cannot provide on my own, if any of you were to kindly help with these costs that would be great!\nIf you are interested in helping, you can message me privately: NotPlatzer#1106")
    }
  },
};
