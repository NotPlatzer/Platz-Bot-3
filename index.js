const Discord = require("discord.js");
const mongoose = require("mongoose");
const Guild = require("./db_models/guild");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const fs = require("fs");
const schedule = require("node-schedule");
const distube = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");

//heroku logs --app=platzer-dc-bot --tail
//TODO: Geburtstoge, random message on mention

//Node error handling
process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("\x1B[31mNODE CRASHED\x1B[0m");
});

const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_PRESENCES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING",
  ],
});

client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync("./commands");

const timeout = new Discord.Collection();

var commandCount = 1;

//Looping for every command and putting it into the "client.commands" collection
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    commandCount++;
    client.commands.set(command.name.toLowerCase(), command);
  }
}

//Discord error handling
client.on("error", () => {
  console.log("\x1B[31m A Discord Error:\x1B[0m");
  console.error;
});
//Gets called once the client is online
client.once("ready", async () => {
  client.user.setActivity(`,help`, { type: "WATCHING" });
  //Connecting to the DB
  await mongoose
    .connect(process.env.DB_URI, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => {
      console.log(`
        +-----------------------------------------+
        |              \x1b[32mBot is Online\x1b[0m              |
        +-----------+-----------------------------+
        | Database: | Connected                   |
        +-----------+-----------------------------+
        | Commands: | ${commandCount - 1}                          |
        +-----------+-----------------------------+
        | Servers:  | ${client.guilds.cache.size}                          |
        +-----------+-----------------------------+`);
    })
    .catch((err) =>
      console.log(`
        +-----------------------------------------+
        |              \x1b[32mBot is Online\x1b[0m              |
        +-----------+-----------------------------+
        | Database: | Not Connected               |
        +-----------+-----------------------------+
        | Commands: | ${commandCount - 1}                          |
        +-----------+-----------------------------+
        | Servers:  | ${client.guilds.cache.size}                          |
        +-----------+-----------------------------+`)
    );
});
//Gets Called once client joins a new guild
client.on("guildCreate", (guild) => {
  //Makes new db Guild Document
  const guild_db = new Guild({
    name: guild.name,
    prefix: ",",
    modRole: "admin",
    id: guild.id,
    owner: guild.ownerId,
    playlists: [],
  });

  guild_db
    .save()
    .then((result) => {
      console.log(`
            +------------------------------+
            |       Joined new Guild       |
            +---------+--------------------+
            | Name:   | ${guild.name}      
            +---------+--------------------+
            | Prefix: | ,                  |
            +---------+--------------------+
            | Id:     | ${guild.id} |
            +---------+--------------------+
            | Owner:  | ${guild.ownerId} |
            +---------+--------------------+`);
    })
    .catch((err) => {
      console.log(err);
    });
});

//Gets called once a message is received
client.on("messageCreate", (message) => {
  if (message.author === client.user) return;
  if (message.channel.type === "DM") return;
  //finds the prefix of the current Guild and puts it into the "GuildPrefix" variable
  Guild.findOne({ id: message.guild.id })
    .then((messageGuild) => {
      if (!messageGuild) {
        //Makes new db Guild Document
        const guild_db = new Guild({
          name: message.guild.name,
          prefix: ",",
          modRole: "admin",
          id: message.guild.id,
          owner: message.guild.ownerId,
          playlists: [],
        });

        guild_db
          .save()
          .then((result) => {
            console.log(`
            +------------------------------+
            |       Joined new Guild       |
            +---------+--------------------+
            | Name:   | ${message.guild.name}      
            +---------+--------------------+
            | Prefix: | ,                  |
            +---------+--------------------+
            | Id:     | ${message.guild.id} |
            +---------+--------------------+
            | Owner:  | ${message.guild.ownerId} |
            +---------+--------------------+`);
          })
          .catch((err) => {
            console.log(err);
          });

        var messageGuild = guild_db;
      }

      const GuildPrefix = messageGuild.prefix;
      if (message.mentions.everyone) return;
      if (message.author.bot) return;

      if (message.mentions.has(client.user.id)) {
        const random_messages = [
          `Use \`${GuildPrefix}rate {something}\` to rate something`,
          `Use \`${GuildPrefix}ping to get the bots ping\``,
          `Use \`${GuildPrefix}statistic to get statistics about the bot\``,
        ];

        const embed = new MessageEmbed()
          .setTitle("Platz Bot")
          .setColor([37, 150, 190])
          .setDescription(
            `Use \`,help\` for more Information\nExample Usage: ${
              random_messages[
                Math.floor(Math.random() * random_messages.length)
              ]
            }`
          )
          .setFooter(`To report bugs send a message to the dev`);

        return message.reply({ embeds: [embed] });
      }
      //Return if the message doesn't start with the prefix
      if (!message.content.startsWith(GuildPrefix)) return;
      //"args" is a Array and it contains the arguments after the command
      const args = message.content.slice(GuildPrefix.length).trim().split(" ");

      const commandName = args.shift().toLowerCase();
      //Find all the commands by name or alias
      const command =
        client.commands.get(commandName) ||
        client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        );

      if (command && command.ownerOnly === false) {
        if (command.cooldown && message.author.id !== "608381190336020494") {
          //If command has cooldown
          if (timeout.has(`${command.name}${message.author.id}`))
            return message.reply(
              `Please Wait \`${ms(
                timeout.get(`${command.name}${message.author.id}`) - Date.now(),
                { long: true }
              )}\``
            );
          command.run(client, message, args, GuildPrefix, messageGuild);
          console.log(
            `${message.author.tag} executed "${message.content}" on ${message.guild.name}`
          );
          timeout.set(
            `${command.name}${message.author.id}`,
            Date.now() + command.cooldown
          );
          setTimeout(() => {
            timeout.delete(`${command.name}${message.author.id}`);
          }, command.cooldown);
        } else {
          //If  no cooldown
          console.log(
            `${message.author.tag} executed "${message.content}" on ${message.guild.name}`
          );
          command.run(client, message, args, GuildPrefix, messageGuild);
        }
      } else if (
        (message.author.id === "608381190336020494" ||
          message.author.id === "598985850956677147") &&
        command
      ) {
        console.log(
          `${message.author.tag} executed "${message.content}" on ${message.guild.name}`
        );
        command.run(client, message, args, GuildPrefix, messageGuild);
      } else {
        return message.reply("No such Command: " + commandName);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
//Gets called
client.on("channelCreate", (channel) => {
  if (channel.isText()) {
    Guild.findOne({ id: channel.guild.id }).then((messageGuild) => {
      if (!messageGuild) return console.log(messageGuild);
      let roleOBJ = channel.guild.roles.cache.find(
        (role) => role.id == messageGuild.muterole
      );
      console.log(roleOBJ + "\n" + messageGuild.muterole);
      if (roleOBJ == undefined) return;
      channel.permissionOverwrites.create(roleOBJ, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false,
      });
    });
  }
});

//Makes new Distube Client
client.distube = new distube.default(client, {
  youtubeDL: false,
  youtubeCookie: process.env.YT_COOKIE,
  emitAddSongWhenCreatingQueue: true,
  emitNewSongOnly: true,
  searchSongs: 0,
  searchCooldown: 3,
  leaveOnEmpty: true,
  emptyCooldown: 0,
  leaveOnFinish: false,
  leaveOnStop: false,
  plugins: [
    new SoundCloudPlugin(),
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
      api: {
        clientId: "7da91884b1834c058a54b107d8e27951",
        clientSecret: process.env.SPOTIFY_SECRET,
      },
    }),
  ],
  customFilters: {
    earrape: "earwax,equalizer=f=1000:t=q:w=1:g=48,bass=g=63,dynaudnorm=f=400",
    slowreverb: "atempo=0.85,aecho=1.0:0.5:10:0.5",
  },
});
//Contains information about the Queue
const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.join(", ") || "Off"
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.distube
  .on("finish", (queue) => {
    Guild.findOne({ id: queue.textChannel.guildid }).then((queueGuild) => {
      if(!queueGuild) return console.log(`${queue.textChannel.guildid}`)
      if (queueGuild.relatedSongs && queueGuild.relatedSongs === true) {
        client.distube.addRelatedVideo(queue.textChannel.lastMessage);
      } else {
        queue.textChannel.send("Finished queue!");
      }
    });
  })
  .on("playSong", (queue, song) => {
    const playembed = new MessageEmbed()
      .setTitle(song.name)
      .setColor([37, 150, 190])
      .setDescription(
        `Song Duration: \`${song.formattedDuration}\`\nRequested by: ${
          song.member
        }\n\n${status(queue)}`
      )
      .setFooter(`To report bugs send a message to the dev`)
      .setImage(song.thumbnail);

    queue.textChannel.send({ embeds: [playembed] });
    console.log(`Playing ${song.name}, Requested by: ${song.member.user.tag}`);

    Guild.findOne({ id: "809835346450710598" }, function (err, doc) {
      var newsongscount = doc.playedSongs + 1;
      doc.playedSongs = newsongscount;
      doc.save();
    });
  })
  .on("addSong", (queue, song) =>
    queue.textChannel.send(
      `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.member}`
    )
  )
  .on("searchNoResult", (message) => message.reply(`No result found!`))
  .on("addList", (queue, playlist) => {
    const listembed = new MessageEmbed()
      .setTitle("Added Playlist:")
      .setColor([37, 150, 190])
      .setDescription(
        `**${playlist.name}**\n${playlist.songs.length} Songs added\nDuration: \`${playlist.formattedDuration}\``
      )
      .setFooter(`To report bugs send a message to the dev`)
      .setImage(playlist.thumbnail);

    queue.textChannel.send({ embeds: [listembed] });
  })

  .on("error", (channel, error) => {
    if (error.message === "No result found") {
      return channel.send("No result found!");
    }
    console.log("\x1B[31mAn Distube error encountered:\x1B[0m " + error);
    channel.send(
      `A Distube error occurred: ´${error.message}´\nSend a message to NotPlatzer#1106`
    );
  });

//Gets executed once a minute and checks for new players on The MC server
schedule.scheduleJob("10 * * * * *", function (fireDate) {
  const checkMcserver = client.commands.get("checkmcserver");
  checkMcserver.run(client, fireDate);
});

//Loging in to the Discord Client
client.login(process.env.DJS_TOKEN);
