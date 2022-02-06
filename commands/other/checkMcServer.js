const Guild = require("/app/db_models/guild.js");
const request = require("request");

module.exports = {
  name: "checkMcServer",
  aliases: [""],
  cooldown: 0,
  description: "",
  usage: "",

  async run(client, fireDate) {
    Guild.findOne({ id: "809835346450710598" }, function (err, doc) {
      if (doc == undefined) return console.log("Could not find Data Guild!");
      const players = doc.mcPlayers;
      const server = request.get(
        "https://api.mcsrvstat.us/debug/query/5.83.164.91:10050",
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var server = JSON.parse(body);
            if (
              server.PlayerList === false ||
              server === undefined ||
              server.PlayerList === undefined
            )
              return;
            let PlayersOnServer = server.PlayerList;
            const namesToDeleteSet = new Set(players);
            const newPlayers = PlayersOnServer.filter((name) => {
              return !namesToDeleteSet.has(name);
            });
            if (newPlayers.length > 0) {
              console.log(newPlayers);
              doc.mcPlayers = players.concat(newPlayers);
              doc.save();
              var mcPlayersChannel = client.channels
                .fetch("928347331596808302")
                .then((channel) => {
                  var counter = newPlayers.length;
                  newPlayers.forEach((player) => {
                    counter--;
                    channel.send(
                      `${doc.mcPlayers.length - counter}. \`${player}\``
                    );
                  });
                });
            } else {
              return;
            }
          }
        }
      );
    });
  },
};
