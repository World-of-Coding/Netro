const { EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const client = require("../index");
const target = client.config.target;
const mmConfig = client.config.modmail;
const parseFlag = require("../utils/flags");
const automod = require("../utils/automod.js");

module.exports = {
    name: "messageCreate", 
    run: async (message) => {
      if (message.author.bot) {
        return;
      }
      

      const blackListedUsers = await client.db.get('modmail_blacklistedUsers');

      // Handle modmails
      if (message.channel.type === "DM") {
        const targetGuild = client.guilds.cache.get(target.server);
        // Check if the user is in the eligible server.
        if (!targetGuild?.members.cache.get(message.author.id)) {
          message.channel.send("Sorry, you're not in the modmail server!");
          return;
        }

        // Check if there's an active modmail associated with this member.
        if (client.modmailMan.doesExist(message.author.id, `modmail`) || client.modmailMan.doesExist(message.author.id, `training`)) {
          const modmailChannel = client.modmails.get(message.author.id)?.channel
                      || client.guilds.cache.get(target.server)?.channels.cache.find(c => c.name == `modmail-${message.author.id}` || c.name == `training-${message.author.id}`);

          const embed = new EmbedBuilder()
            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
            .setDescription(message.content || "*(empty message)*")
            .setColor("GREEN")
            .setTimestamp();

          const sizeLimitFilter = (file) => file.size > 8_000_000;
          if (message.attachments.some(sizeLimitFilter)) return message.channel.send("Cannot send; file exceeds maximum size of 8MB!");

          modmailChannel.send({ embeds: [embed], files: [...message.attachments.values()] });
          message.channel.send({ embeds: [embed.setTitle("Sent!")] });
        }
        else {
          if(blackListedUsers.includes(message.author.id)) {
            message.channel.send("You are blacklisted from using the modmail!");
            return;
          }

          const guild = client.guilds.cache.get(target.server);
          if (!guild) {
            const errorEmbed = new EmbedBuilder()
              .setDescription("Failed to find the guild, please contact the developer/owner about this!")
              .setColor("RED")
              .setTimestamp();

            message.channel.send({ embeds: [errorEmbed] });
            return;
          }

          const category = guild.channels.cache.get(mmConfig.category);
          if (!category || category.type === "CATEGORY") {
            const errorEmbed = new EmbedBuilder()
              .setDescription("Failed to find the category, please contact the developer/owner about this!")
              .setColor("RED")
              .setTimestamp();

            message.channel.send({ embeds: [errorEmbed] });
            return;
          }

          const modmailChannel = await client.modmailMan.create(guild, category, message.author).catch(e => { message.channel.send(e.message); });

          const newThreadEmbed = new EmbedBuilder()
            .setTitle("New thread")
            .setColor("BLUE")
            .setDescription(`${message.author}\n${message.author.id}`)
            .setFooter("have fun")
            .setTimestamp();
          modmailChannel.send({ content: mmConfig.customMessage, embeds: [newThreadEmbed] });

          const firstEmbedBuilder = new EmbedBuilder()
            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
            .setDescription(message.content)
            .setColor("GREEN")
            .setTimestamp();
          modmailChannel.send({ embeds: [firstEmbedBuilder], files: [...message.attachments.values()] });

          const newNotifyEmbed = new EmbedBuilder()
            .setTitle("Created a new thread!")
            .setDescription("Please wait patiently as we get to you as soon as we can!")
            .setColor("GREEN")
            .setTimestamp();
          message.channel.send({ embeds: [newNotifyEmbed] });

          const newLogEmbed = new EmbedBuilder()
            .setTitle("New thread")
            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
            .setDescription(`${message.author.tag} has created a new thread\n<#${modmailChannel.id}>`)
            .setColor("BLUE")
            .setTimestamp();
          modmailChannel.guild.channels.cache.get(client.config.logging.modmail).send({ embeds: [newLogEmbed] });
        }
      } else {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.MENTION_EVERYONE)) await automod(client, message);
      }

      // Handle commands
      if (
      // HACK: Just in case.
        !message.guild ||
                !message.content.toLowerCase().startsWith(client.config.prefix)
      ) {
        return;
      }

      const [cmd, ...args] = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(" ");

      const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

      if (!command) {
        return;
      }

      const now = Date.now();
      const cooldowns = client.cooldowns.get(command.name);
      const cooldownDuration = (command.cooldown || 3) * 1000;

      if (cooldowns.has(message.author.id)) {
        const expiresIn = cooldowns.get(message.author.id) + cooldownDuration;

        if (now < expiresIn && !message.member.permissions.has('ADMINISTRATOR')) {
          const timeLeft = (expiresIn - now) / 1000;
          const cooldownNotify = new EmbedBuilder()
            .setColor("RED")
            .setTitle("In Cooldown")
            .setDescription("Please wait until the cooldown expires!")
            .addField("Time Left", `\`${timeLeft.toFixed(1)}\``, false);

          message.channel.send({ embeds: [cooldownNotify] });
          return;
        }
      }

      const userHasPermissions = message.member?.permissions.has(command.permissions || []);
      const botHasPermissions = message.guild.me?.permissions.has(command.permissions || []);

      if (!userHasPermissions || !botHasPermissions) {
        const permsNotify = new EmbedBuilder()
          .setColor("RED")
          .setTitle("Insufficient Permissions!")
          .setDescription(`${!userHasPermissions ? "You" : "I"} don't have enough permissions to do this!`)
          .addField("Required Permissions", `${!userHasPermissions ? command.permissions.join(", ") : command.myPermissions.join(", ")}`, false);

        message.channel.send({ embeds: [permsNotify] });
        return;
      }

      cooldowns.set(message.author.id, now);
      setTimeout(() => { cooldowns.delete(message.author.id); }, cooldownDuration);

      try {
        let flags;
        if (command.flags) {
          flags = parseFlag(args[0] ? args[0] : '');
          if (flags.length !== 0) {
            args.shift();
          }
        }
        if (command.args && !args.length) {
          cooldowns.delete(message.author.id);
          return message.channel.send(`You didn't provide any argument(s). Correct usage: \`${client.config.prefix}${command.format || `${command.name} <...arguments>`}\``);
        }
        await command.run(client, message, args, flags).catch(e => client.emit("error", e));
      }
      catch (e) {
        console.warn(e);
      }
    }
};