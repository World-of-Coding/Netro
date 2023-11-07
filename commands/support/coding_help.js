const { MessageEmbed, SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('coding-help')
          .setDescription('Pings coding help corresponding to your selection.')
          .addStringOption(option =>
            option
              .setName('Language')
              .setDescription('Language to request help with.')
              .setRequired(true)
              .setAutocomplete(true)
              .addChoices(
                { name: 'Lua', value: 'Lua' },
                { name: 'JavaScript', value: 'JavaScript' },
                { name: 'Python', value: 'Python' },
                { name: 'Ruby', value: 'Ruby' },
                { name: 'Java', value: 'Java' },
                { name: 'C++', value: 'C++' },
                { name: 'C#', value: 'C#'},
                { name: 'HTML', value: 'HTML' },
                { name: 'CSS', value: 'CSS' },
                { name: 'Swift', value: 'Swift' },
                { name: 'TypeScript', value: 'TypeScript' },
                { name: 'Golang', value: 'Golang' },
                { name: 'PHP', value: 'PHP' },
                { name: 'Infosec', value: 'Infosec' },
                { name: 'Cybersec', value: 'Cybersec' },
                { name: 'Tech', value: 'Tech' },
                { name: 'OS', value: 'OS' },
                { name: 'Algorithm', value: 'Algorithm' },
                { name: 'Other', value: 'Other' }
              )),
  cooldown: 300,
  
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const roleMap = client.config.coding_help.map;
    if (!roleMap) {
      await interaction.reply({ content: 'Uh oh! It looks like we\'re missing a configuration!', ephemeral: true });
      return;
    }

    if(interaction.channel.parentId != client.config.coding_help.parentCategory && !interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ content: 'You need to be in a coding help channel for this command to work!', ephemeral: true });
      return;
    }

    const name = interaction.options.getString('Language');
    let map_name = name;
    switch (map_name) {
      case 'C++':
        map_name = 'cpp';
        break;
    
      case 'C#':
        map_name = 'csharp';
        break;

      default:
        break;
    }

    const lang = roleMap[map_name.toLowerCase()];
    const embed = new MessageEmbed()
      .setDescription(`**${name}** help was requested by <@${interaction.user.id}>`)
      .setFooter(`User ID: ${interaction.user.id}`)
      .setTimestamp();
    await interaction.reply({ content: `<@&${lang.roleId}>`, embeds: [embed] });
  }
};
