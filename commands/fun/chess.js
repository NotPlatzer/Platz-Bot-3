const Discord = require("discord.js");
const Guild = require("/app/db_models/guild.js");
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  name: "chess",
  aliases: ["ch"],
  cooldown: 1000 * 5,
  description: "Changes the prefix",
  usage: "changePrefix {new prefix}",
  ownerOnly: false,
  category: "fun",

  async run(client, message, args, GuildPrefix, messageGuild) {
    //the current FEN is stored in the db along with the players that startet the instance.
    //,chess starts the match and moves a made with ,move e2e4
    var newMatch = true;
    const fileName = "/app/data/chessMatches.json";
    const file = require(fileName);
    const target = message.mentions.members.first();
    if (!target) return message.reply("Please mention your enemy!");

    for(var i = 0; i < file.matches.length; i++) {
      if((file.matches[i].players[0] == message.author.username && file.matches[i].players[1] == target.user.username) || (file.matches[i].players[1] == message.author.username && file.matches[i].players[0] == target.user.username)) {
        console.log("match is not new")
        newMatch = false;
      }
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
      "newboard.png",
      message
    );
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
    .then((board) => {
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
      board.write("/app/assets/" + PngName); // save
      message.channel
        .send({
          files: [
            {
              attachment: "assets/newboard.png",
              name: "newboard.png",
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
//returns a Arr board
function FENToArr(FEN) {
  const piecePlacement = FEN.split(" ")[0];
  var i = 0;
  var lineNo = 8;
  const lines = piecePlacement.split("/");
  var Board = [
    ["0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0"],
  ];
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
          Board[i][sq - 1] = "k";
          sq++;
        } else if (line[x] == "p") {
          Board[i][sq - 1] = "p";
          sq++;
        } else if (line[x] == "r") {
          Board[i][sq - 1] = "r";
          sq++;
        } else if (line[x] == "n") {
          Board[i][sq - 1] = "n";
          sq++;
        } else if (line[x] == "b") {
          Board[i][sq - 1] = "b";
          sq++;
        } else if (line[x] == "q") {
          Board[i][sq - 1] = "q";
          sq++;
        } else if (line[x] == "K") {
          Board[i][sq - 1] = "K";
          sq++;
        } else if (line[x] == "Q") {
          Board[i][sq - 1] = "Q";
          sq++;
        } else if (line[x] == "P") {
          Board[i][sq - 1] = "P";
          sq++;
        } else if (line[x] == "N") {
          Board[i][sq - 1] = "N";
          sq++;
        } else if (line[x] == "B") {
          Board[i][sq - 1] = "B";
          sq++;
        } else if (line[x] == "R") {
          Board[i][sq - 1] = "R";
          sq++;
        }
        //#endregion
        x++;
      }
    }
    lineNo--;
    i++;
  }
  return Board.reverse();
}
//returns a FEN
function ArrtoFEN(Arr) {
  //arr to FEN: just write the arr as string, add / every 8 then replace all the 0s with amount of 0s
  FEN = Arr.reverse()
    .toString()
    .replaceAll(",", "")
    .match(/.{1,8}/g)
    .join("/");
  //writen by maxi kofler
  FEN = FEN.replaceAll("00000000", "8");
  FEN = FEN.replaceAll("0000000", "7");
  FEN = FEN.replaceAll("000000", "6");
  FEN = FEN.replaceAll("00000", "5");
  FEN = FEN.replaceAll("0000", "4");
  FEN = FEN.replaceAll("000", "3");
  FEN = FEN.replaceAll("00", "2");
  FEN = FEN.replaceAll("0", "1");

  return FEN;
}
function ChessPosToCoord(move) {
  if (move[0] == "a") return (move[0] = "0" + (move[1] - 1));
  if (move[0] == "b") return (move[0] = "1" + (move[1] - 1));
  if (move[0] == "e") return (move[0] = "4" + (move[1] - 1));
  if (move[0] == "c") return (move[0] = "2" + (move[1] - 1));
  if (move[0] == "d") return (move[0] = "3" + (move[1] - 1));
  if (move[0] == "f") return (move[0] = "5" + (move[1] - 1));
  if (move[0] == "g") return (move[0] = "6" + (move[1] - 1));
  if (move[0] == "h") return (move[0] = "7" + (move[1] - 1));
}
//returns a arr board
function PawnMove(board, move) {
  pieceSqare = ChessPosToCoord(move[0] + move[1]);

  movetoSqare = ChessPosToCoord(move[2] + move[3]);
  if (move[0] !== move[2] || move[1] >= move[3]) {
    return "pawns can only move forward";
  }
  if (board[movetoSqare[1]][movetoSqare[0]] !== "0") {
    return "Piece at moveto sqare";
  } else {
    //edit board to move pawn
    board[movetoSqare[1]][movetoSqare[0]] = board[pieceSqare[1]][pieceSqare[0]];
    board[pieceSqare[1]][pieceSqare[0]] = "0";
  }
  return board;
}
