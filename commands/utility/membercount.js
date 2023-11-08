const { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('membercount')
          .setDescription('Gets the member count of the server.'),
  
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} _client
   */
  async execute(interaction, _client) {
    const memberCount = interaction.guild.memberCount;
    const bots = interaction.guild.members.cache.filter(m => m.user.bot).size;

    const countEmbed = new EmbedBuilder()
      .setColor('BLUE')
      .setTitle("__Members__")
      .addField("Total", `${memberCount}`)
      .addField("Humans", `${memberCount - bots}`)
      .addField("Bots", `${bots}`)
      .setFooter(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }));

	  await interaction.reply({ embeds: [countEmbed] });
  }
};
