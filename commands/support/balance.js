const { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('balance')
          .setDescription('Displays your points balance.')
          .addUserOption(option =>
            option
              .setName('User')
              .setDescription('Another user to display the balance of.')),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const member = interaction.options.getMember('User') ?? interaction.member;
    if (member.bot) {
      await interaction.reply({ content: 'You can\'t check the balance of a bot!', ephemeral: true });
      return;
    }

    const money = await client.db.get(`points_${message.guild.id}_${member.id}`) ?? 0;
    const embed = new EmbedBuilder()
      .setColor('BLUE')
      .setAuthor("Account Balance", member.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Account Name', value: `${member}`, inline: false },
        { name: 'Balance', value: `${money} points`, inline: false }
      )
      .setFooter(`${interaction.guild.name}`, `${interaction.guild.iconURL({ dynamic: true })}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
