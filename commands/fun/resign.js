const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "resign",
  aliases: ["res"],
  cooldown: 1000 * 5,
  description: "Resigns a chess match",
  usage: "resign {oponent}",
  ownerOnly: false,
  category: "fun",

  async run(client, message, args, GuildPrefix, messageGuild) {
    var newMatch = true;
    const fileName =
      "/app/data/chessMatches.json";
    let file = JSON.parse(fs.readFileSync(fileName, "utf8"));
    const target = message.mentions.members.first();
    if (!target) return message.reply("Please mention your enemy!");
    var matchNum = 6969;

    for (var i = 0; i < file.matches.length; i++) {
      if (
        file.matches[i].players[0] == message.author.id ||
        file.matches[i].players[1] == message.author.id
      ) {
        newMatch = false;
        matchNum = i;
      }
    }
    if (newMatch) {
      return message.reply("You are not Playing a game");
    }
    if (
      file.matches[matchNum].players[0] !== target.user.id &&
      file.matches[matchNum].players[1] !== target.user.id
    ) {
      return message.reply("You are not Playing a game against this person!");
    }
    fs.unlink(
      "./assets/" +
        file.matches[matchNum].players[0] +
        file.matches[matchNum].players[1] +
        ".png",
      function (err, result) {
        if (err) console.log("error", err);
      }
    );

    file.matches.splice(matchNum, 1);
    message.reply("Resigned the game!\n" + target.user.username + " Wins");

    fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
      if (err) return console.log(err);
    });
  },
};
