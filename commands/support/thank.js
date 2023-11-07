const { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
const talkedRecently = new Set();

module.exports = {
  data: new SlashCommandBuilder()
          .setName('thank')
          .setDescription('Thank a user for helping you!')
          .addUserOption(option =>
            option
              .setName('User')
              .setDescription('User to thank!')
              .setRequired(true)),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (talkedRecently.has(interaction.user.id)) {
      await interaction.reply({ content: `You can only run this command every 15 minutes!`, ephemeral: true });
      return;
    }

    const member = interaction.options.getMember('User');
    if (message.channel.parentId !== client.config.coding_help.parentCategory) {
      await interaction.reply({ content: 'You need to be in a coding help channel for this command to work!', ephemeral: true });
      return;
    }

    if (member.id === interaction.user.id) {
      await interaction.reply({ content: 'You can\'t thank yourself, silly!', ephemeral: true });
      return;
    } else if (member.user.bot) {
      await interaction.reply({ content: 'That\'s a bot!', ephemeral: true });
      return;
    }
    
    const embed = new EmbedBuilder()
      .setColor("GREEN")
      .setDescription(`${message.author} thanked ${member}! **+1 point**`);
	  await interaction.reply({ embeds: [embed] });

    client.db.add(`points_${message.guild.id}_${member.id}`, 1)
    let points = await client.db.get(`points_${message.guild.id}_${member.id}`)
    if (points >= 10) {
        member.roles.add(client.config.misc.helperRole);
    }

    talkedRecently.add(interaction.user.id);
    setTimeout(() => {
      talkedRecently.delete(interaction.user.id);
    }, 900000);

  }
};