const {
  EmbedBuilder,
} = require('discord.js');
const {
  readdirSync,
} = require('fs');

const _client = require('../../index.js');
const { prefix } = _client.config;
const color = _client.config.misc.defaultEmbedColor;

// the dropdown menu
const create_mh = require('../../utils/menu.js');
module.exports = {
  name: 'help',
  aliases: ['h'],
  emoji: '🚑',
  description: 'Shows all available bot commands',

  run: async (client, message, args) => {
    // THIS IS NOT WRITTEN BY ME
    // FOR THE LOVE OF GOD FORBID EDITING THIS FILE
    const categories = [];
    const cots = [];

    if (!args[0]) {
      // categories to ignore
      const ignored = [
        'test',
      ];

      // emojis for the categories
      const emo = {
        adminonly: ':hammer_and_wrench:',
        modmail: ':mailbox:',
        suggestions: ':inbox_tray:',
        fun: ':video_game:',
        ticket: ':ticket:',
        utility: ':gear:',
        moderation: ':tools:',
        security: ':shield:',
        secret: ':lock:',
        info: ':mag:',
        support: ':nut_and_bolt:',
      };

      const ccate = [];
      // gets all the folders and commands
      readdirSync('./commands/').forEach((dir) => {
        if (ignored.includes(dir.toLowerCase())) return;

        const name = `${emo[dir]} - ${dir}`;
        // let nome = dir.charAt(0).toUpperCase() + dir.slice(1).toLowerCase();
        const nome = dir;

        let cats = new Object();

        // this is how it will be created as
        cats = {
          name,
          value: `\`help ${dir.toLowerCase()}\``,
          inline: true,
        };

        categories.push(cats);
        ccate.push(nome);
      });
      // embed
      const embed = new EmbedBuilder()
        .setTitle(`${client.user.username} Commands`)
        .setDescription(`Prefix - \`${prefix}\`\nUse \`help <category>\` to view commands under a specific category or use the dropdown!`)
        .addFields(categories)
        .setFooter(
          `Requested by ${message.author.tag}`,
          message.author.displayAvatarURL({
            dynamic: true,
          }),
        )
        .setTimestamp()
        .setColor(color);

      // creating the dropdown menu
      const menus = create_mh(ccate);
      return message.reply({
        embeds: [embed],
        components: menus.smenu,
      }).then((msgg) => {
        const menuID = menus.sid;

        const select = async (interaction) => {
          if (interaction.customId != menuID) return;

          const {
            values,
          } = interaction;

          const value = values[0];

          const catts = [];

          readdirSync('./commands/').forEach((dir) => {
            if (dir.toLowerCase() !== value.toLowerCase()) return;
            const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith('.js'));

            const cmds = commands.map((command) => {
              // collect command files
              const file = require(`../../commands/${dir}/${command}`);
              if (!file.name) return 'No command name.';

              const name = file.name.replace('.js', '');

              if (client.commands.get(name).hidden) return;

              const des = client.commands.get(name).description;
              const cemo = client.commands.get(name).emoji;
              const emoe = cemo ? `${cemo} - ` : '';

              const obj = {
                cname: `${emoe}\`${name}\``,
                des,
              };

              return obj;
            });

            let dota = new Object();

            cmds.map((co) => {
              if (co == undefined) return;

              dota = {
                name: `${cmds.length === 0 ? 'In progress.' : co.cname}`,
                value: co.des ? co.des : 'No Description',
                inline: true,
              };
              catts.push(dota);
            });

            cots.push(dir.toLowerCase());
          });

          if (cots.includes(value.toLowerCase())) {
            const combed = new EmbedBuilder()
              .setTitle(`${value.charAt(0) + value.slice(1)} commands`)
              .setDescription(`Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help ping\`.\n\n`)
              .addFields(catts)
              .setColor(color)
              .setTimestamp(new Date())
              .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

            await interaction.deferUpdate();

            return interaction.message.edit({
              embeds: [combed],
              components: menus.smenu,
            });
          }
        };

        const filter = (interaction) => !interaction.user.bot && interaction.user.id == message.author.id;

        const collector = msgg.createMessageComponentCollector({
          filter,
          componentType: 'SELECT_MENU',
        });
        collector.on('collect', select);
        collector.on('end', () => null);
      });
    }
    const catts = [];

    readdirSync('./commands/').forEach((dir) => {
      if (dir.toLowerCase() !== args[0].toLowerCase()) return;
      const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith('.js'));

      const cmds = commands.map((command) => {
        const file = require(`../../commands/${dir}/${command}`);

        if (!file.name) return 'No command name.';

        const name = file.name.replace('.js', '');

        if (client.commands.get(name).hidden) return;

        const des = client.commands.get(name).description;
        const emo = client.commands.get(name).emoji;
        const emoe = emo ? `${emo} - ` : '';

        const obj = {
          cname: `${emoe}\`${name}\``,
          des,
        };

        return obj;
      });

      let dota = new Object();

      cmds.map((co) => {
        if (co == undefined) return;

        dota = {
          name: `${cmds.length === 0 ? 'In progress.' : co.cname}`,
          value: co.des ? co.des : 'No Description',
          inline: true,
        };
        catts.push(dota);
      });

      cots.push(dir.toLowerCase());
    });

    const command = client.commands.get(args[0].toLowerCase())
                || client.commands.find(
                	(c) => c.aliases && c.aliases.includes(args[0].toLowerCase()),
                );

    if (cots.includes(args[0].toLowerCase())) {
      const combed = new EmbedBuilder()
        .setTitle(`${args[0].charAt(0) + args[0].slice(1)} commands`)
        .setDescription(`Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help ping\`.\n\n`)
        .addFields(catts)
        .setColor(color)
        .setTimestamp(new Date())
        .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

      return message.reply({
        embeds: [combed],
      });
    }

    if (!command) {
      const embed = new EmbedBuilder()
        .setTitle(`Unknown command! Use \`${prefix}help\` for all of my commands!`)
        .setColor('RED');
      return await message.reply({
        embeds: [embed],
        allowedMentions: {
          repliedUser: false,
        },
      });
    }

    // Command-specific help page
    const embed = new EmbedBuilder()
      .setTitle('Command Details:')
      .addField(
        'Command:',
        command.name ? `\`${command.name}\`` : 'No name for this command.',
      )
      .addField(
        'Aliases:',
        command.aliases?.length > 0
          ? `\`${command.aliases.join('` `')}\``
          : 'No aliases for this command.',
      )
      .addField(
        'Usage:',
        command.usage
          ? `\`${prefix}${command.name} ${command.usage}\``
          : `\`${prefix}${command.name}\``,
      )
      .addField(
        'Command Description:',
        command.description
          ? command.description
          : 'No description for this command.',
      )
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({
          dynamic: true,
        }),
      )
      .setTimestamp()
      .setColor(color);
    return await message.reply({
      embeds: [embed],
    });
  },
};
