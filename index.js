const Discord = require('discord.js')
const mongoose = require('mongoose')
const Guild = require('./db_models/guild');

const fs = require('fs')
const prefix = ",";
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

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        console.log(`[${commandCount}] ${command.name} Loaded!`)
        commandCount++;
        client.commands.set(command.name, command);
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
        .then((result) => console.log("\nConnected to db\n"))
        .catch((err) => console(err));

    console.log(`\nBot is Online! \nThere are: ${commandCount - 1} commands\n`)
    const botOwner = '608381190336020494'
    const testServer = '793644454124453938'

})

client.on("guildCreate", guild => {

    console.log("Joined new guild: " + guild.name);

    const guild_db = new Guild({
        name: guild.name,
        prefix: ',',
        modRole: 'admin',
        id: guild.id
    });

    guild_db.save()
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err)
        })

});


client.on('messageCreate', message => {
    if (message.author === client.user) return;

    Guild.findOne({ id: message.guild.id }).then((messageGuild) => {
        if (message.mentions.has(client.user.id)) {
            message.reply(`Hello there! My Current Prefix is: ${messageGuild.prefix}`);
        }
        if (!message.content.startsWith(messageGuild.prefix)) return;

        const args = message.content.slice(messageGuild.prefix.length).trim().split(' ');

        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.reply("No such Command: " + commandName);

        if (command) {
            if (command.cooldown) {
                if (timeout.has(`${command.name}${message.author.id}`)) return message.reply(`Please Wait \`${ms(timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}\``);
                command.run(client, message, args)
                console.log(`${message.author.username} executed ${message.content}`)
                timeout.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown);
                setTimeout(() => {
                    timeout.delete(`${command.name}${message.author.id}`)
                }, command.cooldown)
            } else {
                console.log(`${message.author.username} executed ${message.content}`);
                command.run(client, message, args)
            }
        }
    }).catch((error) => {
        console.log(error)
        SS
    });
})

const distube = require('distube')

const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");

client.distube = new distube.default(client, {
    searchSongs: 0,
    searchCooldown: 3,
    leaveOnEmpty: true,
    emptyCooldown: 0,
    leaveOnFinish: false,
    leaveOnStop: false,
    plugins: [new SoundCloudPlugin(), new SpotifyPlugin()]
})

client.distube
    .on('finish', queue => queue.textChannel.send('Finish queue!'))

    .on('playSong', (queue, song) =>
        queue.textChannel.send(
            `Playing \`${song.name}\` - \`${song.formattedDuration
            }\``,
        ))
    .on('addSong', (queue, song) =>
        queue.textChannel.send(
            `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`,
        ))
    .on('searchNoResult', message => message.reply(`No result found!`))

    .on('addList', (queue, playlist) =>
        queue.textChannel.send(
            `Added \`${playlist.name}\` playlist (${playlist.songs.length
            } songs) to queue by ${playlist.user}`,
        ))


    .on("error", (message, err) => message.channel.send(
        "An error encountered: " + err
    ));




client.login(process.env.DJS_TOKEN)