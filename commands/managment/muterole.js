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
        if (!messageGuild.muteRole) {
          var msgMuteRole = 1;
        } else {
          var msgMuteRole = messageGuild.muteRole;
        }
        let CreateRoleOBJ = message.guild.roles.cache.find(
          (role) => role.id == msgMuteRole
        );
        if (CreateRoleOBJ == undefined) {
          args.shift();
          const rolename = args.join(" ");
          const i = message.guild.roles.cache.find(
            (role) => role.name == rolename
          );
          if (i !== undefined) {
            return message.reply(
              `There already exists a role with the name \`${rolename}\``
            );
          }
          if (rolename === "" || rolename === "``") {
            message.guild.roles
              .create({
                name: "muted",
                color: "#ff0000",
              })
              .then((role) => {
                message.channel.send(`Role \`muted\` created!`);
              });

            let EmptyroleOBJ = message.guild.roles.cache.find(
              (role) => role.name == "muted"
            );
            console.log(EmptyroleOBJ);

            const updateguild = await Guild.findOneAndUpdate(
              { id: message.guild.id },
              { muteRole: EmptyroleOBJ.id },
              { new: true }
            );
          }
          message.guild.roles
            .create({
              name: rolename,
              color: "#ff0000",
            })
            .then((role) => {
              message.channel.send(`Role \`${rolename}\` created!`);
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
        message.reply(`Changed Mute Role to: \`${rolename}\``);
        break;

      default:
        if (!messageGuild.muteRole) {
          return message.reply(
            `There is no Mute Role on this Server. Use \`${messageGuild.prefix}info muterole\` for more information`
          );
        }
        let defroleOBJ = message.guild.roles.cache.find(
          (role) => role.id == messageGuild.muteRole
        );
        if (defroleOBJ == undefined) {
          return message.reply(
            `There is no Mute Role on this Server. Use \`${messageGuild.prefix}info muterole\` for more information`
          );
        }
        message.reply(`Current Mute Role is: \`${defroleOBJ.name}\``);
        break;
    }
  },
};
