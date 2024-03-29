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
  ownerOnly: false,
  category: "managment",

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
            await message.guild.roles
              .create({
                name: "muted",
                color: "#707070",
              })
              .then((role) => {
                message.channel.send(`Role \`${role.name}\` created!`);
              });

            let EmptyroleOBJ = message.guild.roles.cache.find(
              (role) => role.name == "muted"
            );
            await Guild.findOneAndUpdate(
              { id: message.guild.id },
              { muteRole: EmptyroleOBJ.id },
              { new: true }
            );
            return;
          }
          message.guild.roles
            .create({
              name: rolename,
              color: "#707070",
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
          message.guild.channels.cache
            .filter((c) => c.type === "GUILD_TEXT")
            .forEach(async (channel, id) => {
              await channel.permissionOverwrites.create(roleOBJ, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
              });
            });
        } else {
          message.reply("There already is a muterole on the Server");
        }
        break;

      case "set":
        const filter = (m) => m.author.id === message.author.id;
        message
          .reply(
            `⚠This will cause everyone that has the new OR old muterole to be Muted!!!!\nType YES or NO (Will expire in 15 seconds)`
          )
          .then(() => {
            message.channel
              .awaitMessages({ filter, max: 1, time: 150000, errors: ["time"] })
              .then(async (collected) => {
                if (
                  collected.first().content !== "YES" &&
                  collected.first().content !== "yes" &&
                  collected.first().content !== "Y" &&
                  collected.first().content !== "y"
                ) {
                  return message.reply(`OK, cancelled`);
                } else {
                  message
                    .reply(
                      `Please Provide the Name of the new Mute Role! (Will expire in 15 seconds)`
                    )
                    .then(() => {
                      message.channel
                        .awaitMessages({
                          filter,
                          max: 1,
                          time: 150000,
                          errors: ["time"],
                        })
                        .then(async (collected) => {
                          var rolename = collected.first().content;
                          rolename = rolename.replace("<@&", "");
                          rolename = rolename.replace(">", "");
                          if (rolename === "" || rolename === "``") {
                            return message.reply(
                              `Please provide a Name for the new Mute Role`
                            );
                          }
                          var roleOBJ = message.guild.roles.cache.find(
                            (role) => role.name == rolename
                          );
                          if (roleOBJ === undefined) {
                            roleOBJ = message.guild.roles.cache.find(
                              (role) => role.id == rolename
                            );
                            if (roleOBJ === undefined) {
                              return message.reply(
                                "No such Role on the Server"
                              );
                            }
                          }
                          const updateguild = await Guild.findOneAndUpdate(
                            { id: message.guild.id },
                            { muteRole: roleOBJ.id },
                            { new: true }
                          );
                          message.guild.channels.cache
                            .filter((c) => c.type === "GUILD_TEXT")
                            .forEach(async (channel, id) => {
                              await channel.permissionOverwrites.create(
                                roleOBJ,
                                {
                                  SEND_MESSAGES: false,
                                  ADD_REACTIONS: false,
                                }
                              );
                            });
                          message.reply(
                            `Changed Mute Role to: \`${roleOBJ.name}\``
                          );
                        });
                    });
                }
              })
              .catch((err) => {
                console.error(err);
              });
          });
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
