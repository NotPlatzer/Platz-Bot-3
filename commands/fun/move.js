const Discord = require("discord.js");
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  name: "move",
  aliases: ["mo", "moev", "mov"],
  cooldown: 1000 * 0,
  description: "Makes a Chess move",
  usage: "move {move}",
  ownerOnly: false,
  category: "fun",

  async run(client, message, args, GuildPrefix, messageGuild) {
    const fileName = "/app/data/chessMatches.json";

    var file = await JSON.parse(
      fs.readFileSync(fileName, "utf8", function (err, data) {
        if (err) console.log("error", err);
      })
    );

    if (file == {}) return;
    var FEN = "69";
    var matchNum = 6969;
    for (var i = 0; i < file.matches.length; i++) {
      if (
        (file.matches[i].players[0] == message.author.id ||
          file.matches[i].players[1] == message.author.id) &&
        file.matches[i].guildId == message.channel.guildId
      ) {
        console.log("current FEN: " + file.matches[i].FEN);
        FEN = file.matches[i].FEN;
        matchNum = i;
      }
    }
    if (FEN == "69") {
      return message.reply("There is no match currently!");
    }
    if (
      (FEN.split(" ")[1] == "w" &&
        file.matches[matchNum].players[0] !== message.author.id) ||
      (FEN.split(" ")[1] == "b" &&
        file.matches[matchNum].players[1] !== message.author.id)
    ) {
      return message.reply("Its not your turn!");
    }
    var board = FENToArr(FEN); //first index is sq, second is line
    const move = args[0]; //e2e4
    var castling = FEN.split(" ")[2];
    var enPassant = FEN.split(" ")[3];
    if (!move) return message.reply("Please provide a move!");
    if (move == "O-O" || move == "O-O-O") {
      const castret = Castling(board, move, FEN);
      if (castret.includes("invalid")) return message.reply(castret);
      board = FENToArr(castret.split(" ")[0]);
      castling = castret.split(" ")[1];
    } else {
      if (move.length !== 4) return message.reply("Not valid move!");

      var pieceSquare = ChessPosToCoord(move[0] + move[1])[0];
      var pieceLine = ChessPosToCoord(move[0] + move[1])[1];
      var movetoSquare = ChessPosToCoord(move[2] + move[3])[0];
      var movetoLine = ChessPosToCoord(move[2] + move[3])[1];
      if (movetoSquare.includes("invalid"))
        return message.channel.send("invalid {fuck you}");
      if (!isNaN(move[0])) return message.reply("First letter is a number!");
      if (!isNaN(move[2])) return message.reply("Third letter is a number!");
      if (isNaN(move[1])) return message.reply("Second number is a letter!");
      if (isNaN(move[3])) return message.reply("Fourth number is a letter!");
      var whoseTurn = FEN.split(" ")[1];
      if (whoseTurn == "w") {
        if (
          board[pieceLine][pieceSquare] ==
            board[pieceLine][pieceSquare].toLowerCase() &&
          board[pieceLine][pieceSquare] !== "0"
        ) {
          return message.reply("Not your piece!");
        }
      } else {
        if (
          board[pieceLine][pieceSquare] ==
            board[pieceLine][pieceSquare].toUpperCase() &&
          board[pieceLine][pieceSquare] !== "0"
        ) {
          return message.reply("Not your piece!");
        }
      }
      if (board[pieceLine][pieceSquare] == "0")
        return message.reply(
          "Selected sqare is empty: " +
            board[pieceLine][pieceSquare] +
            "[" +
            pieceLine +
            " ; " +
            pieceSquare +
            "]"
        );

      if (move[1] > 8 || move[1] < 1 || move[3] < 1 || move[3] > 8)
        return message.reply("Move is out of bounds!");

      var moveReturn = "{}";
      //#region
      if (
        board[pieceLine][pieceSquare] == "p" ||
        board[pieceLine][pieceSquare] == "P"
      ) {
        moveReturn = PawnMove(board, move, FEN);
      } else if (
        board[pieceLine][pieceSquare] == "r" ||
        board[pieceLine][pieceSquare] == "R"
      ) {
        moveReturn = RookMove(board, move);
      } else if (
        board[pieceLine][pieceSquare] == "k" ||
        board[pieceLine][pieceSquare] == "K"
      ) {
        moveReturn = KingMove(board, move);
      } else if (
        board[pieceLine][pieceSquare] == "b" ||
        board[pieceLine][pieceSquare] == "B"
      ) {
        moveReturn = BishopMove(board, move);
      } else if (
        board[pieceLine][pieceSquare] == "q" ||
        board[pieceLine][pieceSquare] == "Q"
      ) {
        moveReturn = QueenMove(board, move);
      } else if (
        board[pieceLine][pieceSquare] == "n" ||
        board[pieceLine][pieceSquare] == "N"
      ) {
        moveReturn = KnightMove(board, move);
      } else {
        moveReturn = "invalid {selceted square is empty}";
      }
      //#endregion

      if (moveReturn.includes("invalid")) {
        message.channel.send(moveReturn);
        return console.log(moveReturn);
      } else if (board[pieceLine][pieceSquare] == "P" && movetoLine == "7") {
        board[movetoLine][movetoSquare] = "Q";
        board[pieceLine][pieceSquare] = "0";
      } else if (board[pieceLine][pieceSquare] == "p" && movetoLine == "0") {
        board[movetoLine][movetoSquare] = "q";
        board[pieceLine][pieceSquare] = "0";
      } else {
        if (board[pieceLine][pieceSquare] == "K" && castling !== "-") {
          if (castling == "KQ") {
            castling = castling.replace("KQ", "-");
          } else {
            castling = castling.replace("K", "").replace("Q", "");
          }
        } else if (board[pieceLine][pieceSquare] == "k" && castling !== "-") {
          if (castling == "kq") {
            castling = castling.replace("kq", "-");
          } else {
            castling = castling.replace("k", "").replace("q", "");
          }
        } else if (board[pieceLine][pieceSquare] == "R" && pieceSquare == 0) {
          //left white rook
          if (castling == "Q") {
            castling = castling.replace("Q", "-");
          } else {
            castling = castling.replace("Q", "");
          }
        } else if (board[pieceLine][pieceSquare] == "R" && pieceSquare == 7) {
          //right white rook
          if (castling == "R") {
            castling = castling.replace("R", "-");
          } else {
            castling = castling.replace("R", "");
          }
        } else if (board[pieceLine][pieceSquare] == "r" && pieceSquare == 0) {
          //left black rook
          if (castling == "q") {
            castling = castling.replace("q", "-");
          } else {
            castling = castling.replace("q", "");
          }
        } else if (board[pieceLine][pieceSquare] == "r" && pieceSquare == 7) {
          //right white rook
          if (castling == "k") {
            castling = castling.replace("k", "-");
          } else {
            castling = castling.replace("k", "");
          }
        } else if (
          board[pieceLine][pieceSquare] == "p" ||
          board[pieceLine][pieceSquare] == "P"
        ) {
          if (movetoLine == +pieceLine + 2) {
            enPassant = `${+movetoLine - 1}${pieceSquare}`;
          } else if (movetoLine == +pieceLine - 2) {
            enPassant = `${+movetoLine + 1}${pieceSquare}`;
          }
        }
        board[movetoLine][movetoSquare] = board[pieceLine][pieceSquare];
        board[pieceLine][pieceSquare] = "0";
        if (enPassant !== "-") {
          if (board[enPassant[0]][enPassant[1]] == "P") {
            board[+enPassant[0] - 1][enPassant[1]] = "0";
          } else if (board[enPassant[0]][enPassant[1]] == "p") {
            board[+enPassant[0] + 1][enPassant[1]] = "0";
          }
        }
      }
    }
    var whoseTurn = FEN.split(" ")[1];
    if (whoseTurn == "w") {
      whoseTurn = "b";
      if (enPassant.length > 1) {
        if (enPassant[0] == "5") {
          enPassant = "-";
        }
      }
    } else {
      whoseTurn = "w";
      if (enPassant.length > 1) {
        if (enPassant[0] == "2") {
          enPassant = "-";
        }
      }
    }
    const newFEN =
      ArrtoFEN(board) + " " + whoseTurn + " " + castling + " " + enPassant;
    console.log("new fen: " + newFEN);
    var img;
    if (whoseTurn == "b") {
      img = await FENToPngBlack(
        newFEN,
        "/assets/black_board.png",
        file.matches[matchNum].players[0] +
          file.matches[matchNum].players[1] +
          ".png",
        message
      );
    } else {
      img = await FENToPngWhite(
        newFEN,
        "/assets/white_board.png",
        file.matches[matchNum].players[0] +
          file.matches[matchNum].players[1] +
          ".png",
        message
      );
    }
    await message.channel
      .send({
        files: [
          {
            attachment: img,
            name: img,
            description: "board",
          },
        ],
      })
      .then()
      .catch(console.error);

    file.matches[matchNum].FEN = newFEN;

    if (!newFEN.split(" ")[0].includes("k")) {
      message.channel.send("White Won the Game!");
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
    }
    if (!newFEN.split(" ")[0].includes("K")) {
      message.channel.send("Black Won the Game!");
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
    }

    fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
      if (err) return console.log(err);
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

const K = new jimp("assets/pieces/Wk.png");
const Q = new jimp("assets/pieces/Wq.png");
const P = new jimp("assets/pieces/Wp.png");
const B = new jimp("assets/pieces/Wb.png");
const N = new jimp("assets/pieces/Wn.png");
const R = new jimp("assets/pieces/Wr.png");
const k = new jimp("assets/pieces/Bk.png");
const q = new jimp("assets/pieces/Bq.png");
const p = new jimp("assets/pieces/Bp.png");
const b = new jimp("assets/pieces/Bb.png");
const n = new jimp("assets/pieces/Bn.png");
const r = new jimp("assets/pieces/Br.png");
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
async function FENToPngWhite(FEN, source, PngName, message) {
  source = "./" + source;
  return new Promise((resolve, reject) => {
    jimp
      .read(source)
      .then((board) => {
        const piecePlacement = FEN.split(" ")[0];
        const whoseTurn = FEN.split(" ")[1];
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
        board.writeAsync(`assets/${PngName}`).then(() => {
          resolve(`assets/${PngName}`);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
//returns a Png
async function FENToPngBlack(FEN, source, PngName, message) {
  source = "./" + source;
  return new Promise((resolve, reject) => {
    jimp
      .read(source)
      .then((board) => {
        var arr = FENToArr(FEN.split(" ")[0]);
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].reverse();
        }
        arr = arr.reverse();
        const piecePlacement = ArrtoFEN(arr);
        const whoseTurn = FEN.split(" ")[1];
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
        board.writeAsync(`assets/${PngName}`).then(() => {
          resolve(`assets/${PngName}`);
        });
      })
      .catch((err) => {
        console.error(err);
      });
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
//takes chess pos (e4) returns its pos in the arr
function ChessPosToCoord(move) {
  if (move[0] == "a") return (move[0] = "0" + (move[1] - 1));
  if (move[0] == "b") return (move[0] = "1" + (move[1] - 1));
  if (move[0] == "e") return (move[0] = "4" + (move[1] - 1));
  if (move[0] == "c") return (move[0] = "2" + (move[1] - 1));
  if (move[0] == "d") return (move[0] = "3" + (move[1] - 1));
  if (move[0] == "f") return (move[0] = "5" + (move[1] - 1));
  if (move[0] == "g") return (move[0] = "6" + (move[1] - 1));
  if (move[0] == "h") return (move[0] = "7" + (move[1] - 1));
  else {
    return "invalid {fuck you}";
  }
}
//returns valid if move is valid
function PawnMove(board, move, FEN) {
  var pieceSquare = ChessPosToCoord(move[0] + move[1])[0];
  var pieceLine = ChessPosToCoord(move[0] + move[1])[1];
  var movetoSquare = ChessPosToCoord(move[2] + move[3])[0];
  var movetoLine = ChessPosToCoord(move[2] + move[3])[1];

  var enPassant = FEN.split(" ")[3];
  if (board[pieceLine][pieceSquare] == "P") {
    if (
      (movetoSquare == +pieceSquare + +1 ||
        movetoSquare == +pieceSquare - +1) &&
      movetoLine == +pieceLine + +1 &&
      (board[movetoLine][movetoSquare] == "0" ||
        board[movetoLine][movetoSquare] ==
          board[movetoLine][movetoSquare].toUpperCase()) &&
      !(
        enPassant !== "-" &&
        movetoLine == enPassant[0] &&
        movetoSquare == enPassant[1]
      )
    ) {
      return "PAWN: invalid {pawns can only take diagonaly if there is a piece}";
    } else if (pieceLine !== "1" && movetoLine == +pieceLine + +2) {
      return "PAWN: invalid {pawns can only move foreward 2 sq at position 2 and 7}";
    } else if (move[1] >= move[3]) {
      return "PAWN: invalid {pawns can only move foreward}";
    } else if (
      board[movetoLine][movetoSquare] !== "0" &&
      !(
        (movetoSquare == +pieceSquare + +1 ||
          movetoSquare == +pieceSquare - +1) &&
        movetoLine == +pieceLine + +1
      )
    ) {
      return "PAWN: invalid {piece at moveto sqare}";
    }
  } else {
    if (
      (movetoSquare == +pieceSquare + +1 ||
        movetoSquare == +pieceSquare - +1) &&
      movetoLine == +pieceLine - +1 &&
      board[movetoLine][movetoSquare] == "0" &&
      !(
        enPassant !== "-" &&
        movetoLine == enPassant[0] &&
        movetoSquare == enPassant[1]
      )
    ) {
      return "PAWN: invalid {pawns can only take diagonaly if there is a piece}";
    } else if (pieceLine !== "6" && movetoLine == +pieceLine - +2) {
      return "PAWN: invalid {pawns can only move foreward 2 sq at position 2 and 7}";
    } else if (move[1] <= move[3]) {
      return "PAWN: invalid {pawns can only move foreward}";
    } else if (
      board[movetoLine][movetoSquare] !== "0" &&
      !(
        (movetoSquare == +pieceSquare + +1 ||
          movetoSquare == +pieceSquare - +1) &&
        movetoLine == +pieceLine - +1
      )
    ) {
      return "PAWN: invalid {piece at moveto sqare}";
    } else {
    }
  }
  return "valid";
}
//returns valid if move is valid
function RookMove(board, move) {
  var pieceSquare = ChessPosToCoord(move[0] + move[1])[0];
  var pieceLine = ChessPosToCoord(move[0] + move[1])[1];
  var movetoSquare = ChessPosToCoord(move[2] + move[3])[0];
  var movetoLine = ChessPosToCoord(move[2] + move[3])[1];

  //valid move if the path to it is not obstructed (loop for it, return if is not 0)
  if (pieceLine !== movetoLine && pieceSquare !== movetoSquare)
    return "ROOK: invalid {you cant move here with this piece}";

  if (
    board[pieceLine][pieceSquare] == "R" ||
    board[pieceLine][pieceSquare] == "Q"
  ) {
    if (pieceLine == movetoLine && pieceSquare == movetoSquare) {
      return "ROOK: invalid {Rooks must move}";
    } else if (pieceSquare == movetoSquare && pieceLine !== movetoLine) {
      if (pieceLine > movetoLine) {
        //moves down, exp(a8a7) || board[sqare][line]
        for (var i = 1; i < pieceLine - movetoLine; i++) {
          //loops as many times as the rook moves down
          if (board[+pieceLine - +i][pieceSquare] !== "0") {
            //if the piece we are looking at is a piece return
            return (
              "ROOK: invalid {there is a piece in the way}: " +
              board[+pieceLine - +i][pieceSquare]
            );
          }
        }
        i++;
        if (
          board[+pieceLine - +i + 1][pieceSquare] !==
          board[+pieceLine - +i + 1][pieceSquare].toLowerCase()
        ) {
          return "ROOK: invalid {there is one of your pieces}";
        }
      } else {
        //moves up, exp(a1a2) || board 1 indx is sq
        for (var i = 1; i < movetoLine - pieceLine; i++) {
          //loops as many times as the rook moves forwards
          if (board[+pieceLine + +i][pieceSquare] !== "0") {
            //if the piece we are looking at is a piece return
            return (
              "ROOK: invalid {there is a piece in the way}: " +
              board[+pieceLine + +i][pieceSquare]
            );
          }
        }
        i++;
        if (
          board[+pieceLine + +i - 1][pieceSquare] !==
          board[+pieceLine + +i - 1][pieceSquare].toLowerCase()
        ) {
          return "ROOK: invalid {there is one of your pieces}";
        }
      }
    } else if (pieceLine == movetoLine && pieceSquare !== movetoSquare) {
      if (pieceSquare > movetoSquare) {
        //moves left, exp(h4a4) || board[Line][Sqare]
        for (var i = 1; i < pieceSquare - movetoSquare; i++) {
          //loops as many times as the rook moves down
          if (board[pieceLine][+pieceSquare - +i] !== "0") {
            //if the piece we are looking at is a piece return
            return (
              "ROOK: invalid {there is a piece in the way}: " +
              board[pieceLine][+pieceSquare - +i]
            );
          }
        }
        i++;
        if (
          board[pieceLine][+pieceSquare - +i + 1] !==
          board[pieceLine][+pieceSquare - +i + 1].toLowerCase()
        ) {
          return "ROOK: invalid {there is one of your pieces}";
        }
      } else {
        //moves right, exp(a4h4) || board[Line][Sqare]
        for (var i = 1; i < movetoSquare - pieceSquare; i++) {
          //loops as many times as the rook moves down
          if (board[pieceLine][+pieceSquare + +i] !== "0") {
            //if the piece we are looking at is a piece return
            return (
              "ROOK: invalid {there is a piece in the way}: " +
              board[pieceLine][+pieceSquare + +i]
            );
          }
        }
        i++;
        if (
          board[pieceLine][+pieceSquare + +i - 1] !==
          board[pieceLine][+pieceSquare + +i - 1].toLowerCase()
        ) {
          return "ROOK: invalid {there is one of your pieces}";
        }
      }
    }
  } else {
    if (pieceLine == movetoLine && pieceSquare == movetoSquare) {
      return "ROOK: invalid {Rooks must move}";
    } else if (pieceSquare == movetoSquare && pieceLine !== movetoLine) {
      if (pieceLine > movetoLine) {
        //moves down, exp(a8a7) || board[sqare][line]
        for (var i = 1; i < pieceLine - movetoLine; i++) {
          //loops as many times as the rook moves down
          if (board[+pieceLine - +i][pieceSquare] !== "0") {
            //if the piece we are looking at is a piece return
            return (
              "ROOK: invalid {there is a piece in the way}: " +
              board[+pieceLine - +i][pieceSquare]
            );
          }
        }
        i++;
        if (
          board[+pieceLine - +i + 1][pieceSquare] !==
          board[+pieceLine - +i + 1][pieceSquare].toUpperCase()
        ) {
          return "ROOK: invalid {there is one of your pieces}";
        }
      } else {
        //moves up, exp(a1a2) || board 1 indx is sq
        for (var i = 1; i < movetoLine - pieceLine; i++) {
          //loops as many times as the rook moves forwards
          if (board[+pieceLine + +i][pieceSquare] !== "0") {
            //if the piece we are looking at is a piece return
            return (
              "ROOK: invalid {there is a piece in the way}: " +
              board[+pieceLine + +i][pieceSquare]
            );
          }
        }
        i++;
        if (
          board[+pieceLine + +i - 1][pieceSquare] !==
          board[+pieceLine + +i - 1][pieceSquare].toUpperCase()
        ) {
          return "ROOK: invalid {there is one of your pieces}";
        }
      }
    } else if (pieceLine == movetoLine && pieceSquare !== movetoSquare) {
      if (pieceSquare > movetoSquare) {
        //moves left, exp(h4a4) || board[Line][Sqare]
        for (var i = 1; i < pieceSquare - movetoSquare; i++) {
          //loops as many times as the rook moves down
          if (board[pieceLine][+pieceSquare - +i] !== "0") {
            //if the piece we are looking at is a piece return
            return (
              "ROOK: invalid {there is a piece in the way}: " +
              board[pieceLine][+pieceSquare - +i]
            );
          }
        }
        i++;
        if (
          board[pieceLine][+pieceSquare - +i + 1] !==
          board[pieceLine][+pieceSquare - +i + 1].toUpperCase()
        ) {
          return "ROOK: invalid {there is one of your pieces}";
        }
      } else {
        //moves right, exp(a4h4) || board[Line][Sqare]
        for (var i = 1; i < movetoSquare - pieceSquare; i++) {
          //loops as many times as the rook moves down
          if (board[pieceLine][+pieceSquare + +i] !== "0") {
            //if the piece we are looking at is a piece return
            return (
              "ROOK: invalid {there is a piece in the way}: " +
              board[pieceLine][+pieceSquare + +i]
            );
          }
        }
        i++;
        if (
          board[pieceLine][+pieceSquare + +i - 1] !==
          board[pieceLine][+pieceSquare + +i - 1].toUpperCase()
        ) {
          return "ROOK: invalid {there is one of your pieces}";
        }
      }
    }
  }
  return "valid";
}
//returns valid if move is valid
function KingMove(board, move) {
  var pieceSquare = ChessPosToCoord(move[0] + move[1])[0];
  var pieceLine = ChessPosToCoord(move[0] + move[1])[1];
  var movetoSquare = ChessPosToCoord(move[2] + move[3])[0];
  var movetoLine = ChessPosToCoord(move[2] + move[3])[1];
  if (board[pieceLine][pieceSquare] == "k") {
    if (
      board[movetoLine][movetoSquare] ==
        board[movetoLine][movetoSquare].toLowerCase() &&
      board[movetoLine][movetoSquare] !== "0"
    ) {
      return "k KING: invalid {there is one of your pieces}";
    }
  } else {
    if (
      board[movetoLine][movetoSquare] ==
        board[movetoLine][movetoSquare].toUpperCase() &&
      board[movetoLine][movetoSquare] !== "0"
    ) {
      return "K KING: invalid {there is one of your pieces}";
    }
  }
  if (
    movetoLine - pieceLine <= 1 &&
    pieceLine - movetoLine <= 1 &&
    movetoSquare - pieceSquare <= 1 &&
    pieceSquare - movetoSquare <= 1
  ) {
    return "valid";
  } else {
    return "invalid {not valid king move}";
  }
}
//returns a FEN
function Castling(board, move, FEN) {
  console.log("its " + FEN.split(" ")[1] + "'s turn");
  console.log("casteling rights before: " + FEN.split(" ")[2]);
  if (FEN.split(" ")[1] == "w") {
    if (move == "O-O") {
      if (FEN.split(" ")[2].includes("K")) {
        //can castle kingside
        if (board[0][5] == "0" && board[0][6] == "0") {
          //nothing in the way
          board[0][4] = "0";
          board[0][6] = "K";
          board[0][7] = "0";
          board[0][5] = "R";
          var ret = ArrtoFEN(board) + " ";
          if (FEN.split(" ")[2].replace("KQ", "").length == 0) {
            ret = ret + FEN.split(" ")[2].replace("KQ", "-");
          } else {
            ret = ret + FEN.split(" ")[2].replace("KQ", "");
          }
          return ret;
        } else {
          return "invalid {there is something in the way}";
        }
      } else {
        return "invalid {cant castle kingside}";
      }
    } else {
      if (FEN.split(" ")[2].includes("Q")) {
        //can castle queenside
        if (board[0][1] == "0" && board[0][2] == "0" && board[0][3] == "0") {
          //nothing in the way
          board[0][0] = "0";
          board[0][2] = "K";
          board[0][4] = "0";
          board[0][3] = "R";
          var ret = ArrtoFEN(board) + " ";
          if (FEN.split(" ")[2].replace("KQ", "").length == 0) {
            ret = ret + FEN.split(" ")[2].replace("KQ", "-");
          } else {
            ret = ret + FEN.split(" ")[2].replace("KQ", "");
          }
          return ret;
        } else {
          return "invalid {there is something in the way}";
        }
      } else {
        return "invalid {cant castle queenside}";
      }
    }
  } else {
    //black
    if (move == "O-O") {
      console.log(
        "black can castle kingside: " + FEN.split(" ")[2].includes("k")
      );
      if (FEN.split(" ")[2].includes("k")) {
        //can castle kingside
        if (board[7][5] == "0" && board[7][6] == "0") {
          //nothing in the way
          board[7][4] = "0";
          board[7][6] = "k";
          board[7][7] = "0";
          board[7][5] = "r";
          var ret = ArrtoFEN(board) + " ";
          if (FEN.split(" ")[2].replace("kq", "").length == 0) {
            ret = ret + FEN.split(" ")[2].replace("kq", "-");
          } else {
            ret = ret + FEN.split(" ")[2].replace("kq", "");
          }
          return ret;
        } else {
          return "invalid {there is something in the way}";
        }
      } else {
        return "invalid {cant castle kingside}";
      }
    } else {
      console.log(
        "black can castle queenside: " + FEN.split(" ")[2].includes("q")
      );

      if (FEN.split(" ")[2].includes("q")) {
        //can castle queenside
        if (board[7][1] == "0" && board[7][2] == "0" && board[7][3] == "0") {
          //nothing in the way
          board[7][0] = "0";
          board[7][2] = "k";
          board[7][4] = "0";
          board[7][3] = "r";
          var ret = ArrtoFEN(board) + " ";
          if (FEN.split(" ")[2].replace("kq", "").length == 0) {
            ret = ret + FEN.split(" ")[2].replace("kq", "-");
          } else {
            ret = ret + FEN.split(" ")[2].replace("kq", "");
          }
          return ret;
        } else {
          return "invalid {there is something in the way}";
        }
      } else {
        return "invalid {cant castle queenside}";
      }
    }
  }
}
//returns valid if move is valid
function BishopMove(board, move) {
  var pieceSquare = ChessPosToCoord(move[0] + move[1])[0];
  var pieceLine = ChessPosToCoord(move[0] + move[1])[1];
  var movetoSquare = ChessPosToCoord(move[2] + move[3])[0];
  var movetoLine = ChessPosToCoord(move[2] + move[3])[1];

  //weil wenn er 2 vorgeht dan muss er 2 nach rechts/links gehn
  if (movetoLine == pieceLine)
    return "BISHOP: invalid {not a valid bishop move}";

  if (movetoLine > pieceLine) {
    //moves up
    if (
      movetoLine - pieceLine == movetoSquare - pieceSquare ||
      movetoLine - pieceLine == pieceSquare - movetoSquare
    ) {
      if (
        board[pieceLine][pieceSquare] == "B" ||
        board[pieceLine][pieceSquare] == "Q"
      ) {
        if (
          board[movetoLine][movetoSquare] ==
            board[movetoLine][movetoSquare].toUpperCase() &&
          board[movetoLine][movetoSquare] !== "0"
        )
          return "BISHOP: invalid {there is a piece of yours}";
      } else {
        if (
          board[movetoLine][movetoSquare] ==
            board[movetoLine][movetoSquare].toLowerCase() &&
          board[movetoLine][movetoSquare] !== "0"
        )
          return "BISHOP: invalid {there is a piece of yours}";
      }

      return "valid";
    } else return "BISHOP: invalid {not a valid bishop move}";
  } else {
    //moves down
    if (
      pieceLine - movetoLine == movetoSquare - pieceSquare ||
      pieceLine - movetoLine == pieceSquare - movetoSquare
    ) {
      if (
        board[pieceLine][pieceSquare] == "B" ||
        board[pieceLine][pieceSquare] == "Q"
      ) {
        if (
          board[movetoLine][movetoSquare] ==
            board[movetoLine][movetoSquare].toUpperCase() &&
          board[movetoLine][movetoSquare] !== "0"
        )
          return "BISHOP: invalid {there is a piece of yours}";
      } else {
        if (
          board[movetoLine][movetoSquare] ==
            board[movetoLine][movetoSquare].toLowerCase() &&
          board[movetoLine][movetoSquare] !== "0"
        )
          return "BISHOP: invalid {there is a piece of yours}";
      }

      return "valid";
    } else return "BISHOP: invalid {not a valid bishop move}";
  }
}
//returns valid if move is valid
function QueenMove(board, move) {
  if (
    BishopMove(board, move).includes("invalid") &&
    RookMove(board, move).includes("invalid")
  ) {
    return "QUEEN: invalid {not a valid queen move}";
  }
  return "valid";
}
//returns valid if move is valid
function KnightMove(board, move) {
  var pieceSquare = ChessPosToCoord(move[0] + move[1])[0];
  var pieceLine = ChessPosToCoord(move[0] + move[1])[1];
  var movetoSquare = ChessPosToCoord(move[2] + move[3])[0];
  var movetoLine = ChessPosToCoord(move[2] + move[3])[1];

  if (
    (movetoSquare - pieceSquare == 2 || movetoSquare - pieceSquare == -2) &&
    (movetoLine - pieceLine == 1 || movetoLine - pieceLine == -1)
  ) {
    if (board[pieceLine][pieceSquare] == "N") {
      if (
        board[movetoLine][movetoSquare] ==
          board[movetoLine][movetoSquare].toUpperCase() &&
        board[movetoLine][movetoSquare] !== "0"
      ) {
        return "Knight: invalid {there is one of your pieces}";
      }
    } else {
      if (
        board[movetoLine][movetoSquare] ==
          board[movetoLine][movetoSquare].toLowerCase() &&
        board[movetoLine][movetoSquare] !== "0"
      ) {
        return "Knight: invalid {there is one of your pieces}";
      }
    }
    return "valid";
  }
  if (
    (movetoLine - pieceLine == 2 || movetoLine - pieceLine == -2) &&
    (movetoSquare - pieceSquare == 1 || movetoSquare - pieceSquare == -1)
  ) {
    if (board[pieceLine][pieceSquare] == "N") {
      if (
        board[movetoLine][movetoSquare] ==
          board[movetoLine][movetoSquare].toUpperCase() &&
        board[movetoLine][movetoSquare] !== "0"
      ) {
        return "Knight: invalid {there is one of your pieces}";
      }
    } else {
      if (
        board[movetoLine][movetoSquare] ==
          board[movetoLine][movetoSquare].toLowerCase() &&
        board[movetoLine][movetoSquare] !== "0"
      ) {
        return "Knight: invalid {there is one of your pieces}";
      }
    }
    return "valid";
  }

  return "invalid {non valid knight move}";
}
