const Discord = require("discord.js");
const Guild = require("/app/db_models/guild.js");
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  name: "chess",
  aliases: ["ch"],
  cooldown: 1000 * 5,
  description: "Starts a chess match",
  usage: "chess {oponent}",
  ownerOnly: false,
  category: "fun",

  async run(client, message, args, GuildPrefix, messageGuild) {
    //the current FEN is stored in the db along with the players that startet the instance.
    //,chess starts the match and moves a made with ,move e2e4
    var newMatch = true;
    const fileName = "/app/data/chessMatches.json";
    let file = JSON.parse(fs.readFileSync(fileName, "utf8"));
    const target = message.mentions.members.first();
    if (!target) return message.reply("Please mention your enemy!");

    for (var i = 0; i < file.matches.length; i++) {
      if (
        (file.matches[i].players[0] == message.author.id &&
          file.matches[i].players[1] == target.user.id) ||
        (file.matches[i].players[1] == message.author.id &&
          file.matches[i].players[0] == target.user.id)
      ) {
        newMatch = false;
      }
    }

    if (newMatch) {
      file.matches[file.matches.length] = {
        guildId: message.guild.id,
        FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
        players: [message.author.id, target.user.id],
      };
    }
    message.reply(
      "Started a Chess match between: " +
        message.author.username +
        " & " +
        target.user.username
    );

    FENToPng(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
      "assets/board.png",
      message.author.id + target.user.id.toString() + ".png",
      message
    );
    fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
      if (err) return console.log(err);
      console.log(file);
    });
  },
};

//#region
const de = 396;
const coord_A = -400;
const coord_B = -300;
const coord_C = -200;
const coord_D = -100;
const coord_E = 0;
const coord_F = 100;
const coord_G = 200;
const coord_H = 300;

const K = new jimp("/app/assets/pieces/Wk.png");
const Q = new jimp("/app/assets/pieces/Wq.png");
const P = new jimp("/app/assets/pieces/Wp.png");
const B = new jimp("/app/assets/pieces/Wb.png");
const N = new jimp("/app/assets/pieces/Wn.png");
const R = new jimp("/app/assets/pieces/Wr.png");
const k = new jimp("/app/assets/pieces/Bk.png");
const q = new jimp("/app/assets/pieces/Bq.png");
const p = new jimp("/app/assets/pieces/Bp.png");
const b = new jimp("/app/assets/pieces/Bb.png");
const n = new jimp("/app/assets/pieces/Bn.png");
const r = new jimp("/app/assets/pieces/Br.png");
//#endregion

//takes a number and returns a num that when added with "de" results in the sqare pixels on the board
function coord(num) {
  if (num == 1) return 300;
  if (num == 2) return 200;
  if (num == 3) return 100;
  if (num == 4) return 0;
  if (num == 5) return -100;
  if (num == 6) return -200;
  if (num == 7) return -300;
  if (num == 8) return -400;
}
//takes a number and returns the Letter according to the sqare
function numToAlph(num) {
  if (num == 1) return coord_A;
  if (num == 2) return coord_B;
  if (num == 3) return coord_C;
  if (num == 4) return coord_D;
  if (num == 5) return coord_E;
  if (num == 6) return coord_F;
  if (num == 7) return coord_G;
  if (num == 8) return coord_H;
}

//returns a Png
function FENToPng(FEN, source, PngName, message) {
  source = "./" + source;
  jimp
    .read(source)
    .then(async (board) => {
      const piecePlacement = FEN.split(" ")[0];
      var i = 0;
      var lineNo = 8;
      const lines = piecePlacement.split("/");
      //for every line, line no is stored in i +1
      while (i < 8) {
        const line = lines[i];
        if (line !== "8") {
          var sq = 1;
          var x = 0;
          //for every sq in line, sq is store in sq
          while (sq <= 8 && x < line.length) {
            if (!isNaN(line[x])) {
              sq = +sq + +line[x];
            }
            //#region
            else if (line[x] == "k") {
              board.composite(k, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            } else if (line[x] == "p") {
              board.composite(p, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            } else if (line[x] == "r") {
              board.composite(r, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            } else if (line[x] == "n") {
              board.composite(n, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            } else if (line[x] == "b") {
              board.composite(b, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            } else if (line[x] == "q") {
              board.composite(q, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            } else if (line[x] == "K") {
              board.composite(K, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            } else if (line[x] == "Q") {
              board.composite(Q, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            } else if (line[x] == "P") {
              board.composite(P, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            } else if (line[x] == "N") {
              board.composite(N, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            } else if (line[x] == "B") {
              board.composite(B, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            } else if (line[x] == "R") {
              board.composite(R, de + numToAlph(sq), de + coord(lineNo));
              sq++;
            }
            //#endregion
            x++;
          }
        }
        lineNo--;
        i++;
      }
      board.writeAsync(`/app/assets/${PngName}`);
      try {
        if (fs.existsSync(`/app/assets/${PngName}`)) {
          console.log("FILE EXISTS");
        }
      } catch (err) {
        console.log("it doesnt");
      }
      await message.channel
        .send({
          files: [
            {
              attachment: `/app/assets/${PngName}`,
              name: PngName,
              description: "board",
            },
          ],
        })
        .then()
        .catch(console.error);
    })
    .catch((err) => {
      console.error(err);
    });
}
