const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('./db_models/guild');
const { MessageEmbed } = require("discord.js");

const fs = require('fs')
const client = new Discord.Client({
    intents: [
        'GUILDS',
        'GUILD_VOICE_STATES',
        'GUILD_MESSAGES',
        'GUILD_BANS',
        'GUILD_MEMBERS',
    ],
})

const ms = require('ms')
//clear the console
console.clear();

const commandFolders = fs.readdirSync('./commands');
client.commands = new Discord.Collection();
const timeout = new Discord.Collection();
var commandCount = 1;

console.log(`
+-----------------------------------+
|              Commands             |
+-----------------+-----------------+
| Number:         | Name:           |
+-----------------+-----------------+`)

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {

        const command = require(`./commands/${folder}/${file}`);
        console.log(`
        | ${commandCound} | ${command.name} |
        +-----------------+-----------------+`)
        commandCount++;
        client.commands.set(command.name.toLowerCase(), command);

    }
}

client.on('error', console.error);

client.once('ready', async () => {

    await mongoose.connect(
        process.env.DB_URI, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then((result) => {
            console.log(`
        +-----------------------------------------+
        |              Bot is Online              |
        +-----------+-----------------------------+
        | Database: | Connected                   |
        +-----------+-----------------------------+
        | Commands: | ${commandCount - 1}                          |
        +-----------+-----------------------------+
        | Servers:  | ${client.guilds.cache.size}                           |
        +-----------+-----------------------------+`);
        })
        .catch((err) => console.log(`
        +-----------------------------------------+
        |              Bot is Online              |
        +-----------+-----------------------------+
        | Database: | Not Connected               |
        +-----------+-----------------------------+
        | Commands: | ${commandCount - 1}                          |
        +-----------+-----------------------------+
        | Servers:  | ${client.guilds.cache.size}                           |
        +-----------+-----------------------------+`));

    const botOwner = '608381190336020494';
    const testServer = '793644454124453938';

})

client.on("guildCreate", guild => {

    const guild_db = new Guild({
        name: guild.name,
        prefix: ',',
        modRole: 'admin',
        id: guild.id,
        owner: guild.ownerId,
        playlists: [],
    });

    guild_db.save()
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
            console.log(err)
        })

});


client.on('messageCreate', message => {
    if (message.author === client.user) return;
    if (message.channel.type === 'DM') return;

    Guild.findOne({ id: message.guild.id }).then((messageGuild) => {
        const GuildPrefix = messageGuild.prefix;
        if (message.mentions.has(client.user.id)) {
            message.reply(`Hello there! My Current Prefix is: ${GuildPrefix}\nUse ${GuildPrefix}help for more Information`);
        }
        if (!message.content.startsWith(GuildPrefix)) return;

        const args = message.content.slice(GuildPrefix.length).trim().split(' ');

        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.reply("No such Command: " + commandName);

        if (command) {
            if (command.cooldown) {
                if (timeout.has(`${command.name}${message.author.id}`)) return message.reply(`Please Wait \`${ms(timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}\``);
                command.run(client, message, args, GuildPrefix, messageGuild)
                console.log(`${message.author.tag} executed ${message.content} on ${message.guild.name}`)
                timeout.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown);
                setTimeout(() => {
                    timeout.delete(`${command.name}${message.author.id}`)
                }, command.cooldown)
            } else {
                console.log(`${message.author.tag} executed ${message.content} on ${message.guild.name}`);
                command.run(client, message, args, GuildPrefix, messageGuild)
            }
        }
    }).catch((error) => {
        console.log(error)
    });
})

const distube = require('distube')

const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const playlists = require('./commands/music/playlists');



client.distube = new distube.default(client, {
    searchSongs: 0,
    searchCooldown: 3,
    leaveOnEmpty: true,
    emptyCooldown: 0,
    leaveOnFinish: false,
    leaveOnStop: false,
    plugins: [new SoundCloudPlugin(), new SpotifyPlugin({ emitEventsAfterFetching: true })]
})

const status = queue =>
    `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ')
    || 'Off'}\` | Loop: \`${queue.repeatMode
        ? queue.repeatMode === 2
            ? 'All Queue'
            : 'This Song'
        : 'Off'
    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``


client.distube
    .on('finish', queue => queue.textChannel.send('Finish queue!'))

    .on('playSong', (queue, song) => {
        const playembed = new MessageEmbed()
            .setTitle(song.name)
            .setColor([37, 150, 190])
            .setDescription(`Song Duration: \`${song.formattedDuration}\`\nRequested by: ${song.user}\n\n${status(queue)}`)
            .setFooter(`To report bugs send a message to the dev`)
            .setImage(song.thumbnail)

        queue.textChannel.send({ embeds: [playembed] });
        console.log(`Playing ${song.name}, Requested by: ${song.user.tag}`)
    })
    .on('addSong', (queue, song) =>
        queue.textChannel.send(
            `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`,
        ))
    .on('searchNoResult', message => message.reply(`No result found!`))

    .on('addList', (queue, playlist) => {
        const listembed = new MessageEmbed()
            .setTitle("Added Playlist:")
            .setColor([37, 150, 190])
            .setDescription(`**${playlist.name}**\n${playlist.songs.length} Songs added\nDuration: \`${playlist.formattedDuration}\``)
            .setFooter(`To report bugs send a message to the dev`)
            .setImage(playlist.thumbnail)

        queue.textChannel.send({ embeds: [listembed] });
    })


    .on("error", (message, err) => console.log(
        "An error encountered: " + err
    ));




client.login(process.env.DJS_TOKEN)