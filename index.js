const Discord = require('discord.js')
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

client.once('ready', () => {

    console.log(`\nBot is Online! \nThere are: ${commandCount - 1} commands\n`)
    // Set the client user's presence
    client.user.setPresence({ activities: [{ name: `|| Prefix: ${prefix} ||` }], status: 'online' });
})

client.on('messageCreate', message => {

    if (message.mentions.has(client.user.id)) {
        message.reply(`Hello there! My Current Prefix is: ${prefix}`);
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.channel.type === 'dm') return;

    const args = message.content.slice(prefix.length).trim().split(' ');

    if (message.mentions.has(client.user.id)) {
        message.reply("Hello there!");
    }

    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return message.reply("No such Command: " + commandName);

    if (command) {
        if (command.cooldown) {
            if (timeout.has(`${command.name}${message.author.id}`)) return message.reply(`Please Wait \`${ms(timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}\``);
            command.run(client, message, args)
            timeout.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown);
            setTimeout(() => {
                timeout.delete(`${command.name}${message.author.id}`)
            }, command.cooldown)
        } else command.run(client, message, args)

    }

})

const distube = require('distube')

const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { Console } = require('console')



client.distube = new distube.default(client, {
    searchSongs: 0,
    searchCooldown: 3,
    leaveOnEmpty: true,
    emptyCooldown: 0,
    leaveOnFinish: true,
    leaveOnStop: true,
    plugins: [new SoundCloudPlugin(), new SpotifyPlugin()]
})

client.distube
    .on('empty', queue => message.reply('The Queue is Empty!'))
    .on('playSong', (queue, song) =>
        queue.textChannel.send(
            `Playing \`${song.name}\` - \`${song.formattedDuration
            }\`\nRequested by: ${song.user}`,
        ))
    .on('addSong', (queue, song) =>
        queue.textChannel.send(
            `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`,
        ))
    .on('searchNoResult', message => message.reply(`No result found!`))

    .on('addList', (queue, playlist) =>
        queue.textChannel.send(
            `Added \`${playlist.name}\` playlist (${playlist.songs.length
            } songs) to queue`,
        ))


    .on('error', (channel, error) => {
        console.error(error)
    })




client.login(process.env.DJS_TOKEN)