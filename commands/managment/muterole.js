const Discord = require("discord.js");
const { Permissions } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const Guild = require("/app/db_models/guild.js");

module.exports = {
  name: "muterole",
  aliases: ["mur"],
  cooldown: 1000 * 5,
  description: "Creates/Changes the Muterole",
  usage: "muterole [create] [set] {role name}",

  async run(client, message, args, GuildPrefix, messageGuild) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
      return message.reply("You dont have permission to do this!");
    if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
      return message.reply("I dont have permission to do this!");

    switch (args[0]) {
      case "create":
        console.log(messageGuild.muteRole);
        if (!messageGuild.muteRole) {
          args.shift();
          const rolename = args.join(" ");
          message.guild.roles
            .create({
              name: rolename,
              color: "#ff0000",
            })
            .then((role) => {
              message.channel.send(`Role \`${rolename}}\` created!`);
            });

          let roleOBJ = message.guild.roles.cache.find(
            (role) => role.name == rolename
          );

          const updateguild = await Guild.findOneAndUpdate(
            { id: message.guild.id },
            { muteRole: roleOBJ.id },
            { new: true }
          );
        } else {
          message.reply("There already is a muterole on the Server");
        }
        break;

      case "set":
        args.shift();
        const rolename = args.join(" ");
        let roleOBJ = message.guild.roles.cache.find(
          (role) => role.name == rolename
        );
        if (roleOBJ === undefined) {
          return message.reply("No such Role on the Server");
        }
        const updateguild = await Guild.findOneAndUpdate(
          { id: message.guild.id },
          { muteRole: roleOBJ.id },
          { new: true }
        );
        message.reply(`Changed Mute Role to: \`${updateguild.muteRole.name}\``);
        break;

      default:
        if (!messageGuild.muteRole) {
          return message.reply(
            `There is no Mute Role on this Server. Use \`${messageGuild.prefix}info muterole\` for more information`
          );
        }
        let roleOBJ = message.guild.roles.cache.find(
          (role) => role.id == messageGuild.muteRole
        );
        message.reply(`Current Mute Role is: ${roleOBJ.name}`);
        break;
    }
  },
};
