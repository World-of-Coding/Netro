const { MessageEmbed, SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require('discord.js');

const mmConfig = require('../../config.json').modmail;

module.exports = {
  data: new SlashCommandBuilder()
          .setName('train')
          .setDescription('Create a training ticket.')
          .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!mmConfig.training?.category) {
      await interaction.reply({ content: 'Failed to create training session, client is not configured.', ephemeral: true });
      return;
    }

    try {
      const trainingChannel = await client.modmailMan.create(interaction.guild, mmConfig.training.category, interaction.user, true);
      const newThreadEmbed = new MessageEmbed()
        .setTitle("New Training thread")
        .setColor("YELLOW")
        .setDescription(`${interaction.member}\n${interaction.member.id}`)
        .setFooter("Have fun!")
        .setTimestamp();
      trainingChannel.send({ embeds: [newThreadEmbed] });
      await interaction.reply(`Success, created a new training channel at <#${trainingChannel.id}>`);
    }
    catch (e) {
      await interaction.reply({ content: `An error occured while creating a training thread:\n${e.message}.`, ephemeral: true });
    }
  },
};
