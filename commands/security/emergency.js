const { MessageEmbed, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChatInputCommandInteraction, Client } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('emergency')
          .setDescription('Alerts staff in cases of emergency. **Do not misuse this command**.'),
  cooldown: 900,

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} _client
   */
  async execute(interaction, _client) {
    const confirm = new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('Confirm')
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
      .addComponents([confirm, cancel]);
    
    const response = await interaction.reply({
      content: "**Are you sure?** Executing this action will ping the moderation team.\nAbusing this feature will result in further moderation actions.\n**ONLY PROCEED WHEN THERE'S SERVER-WIDE THREAT THAT IS NOT BEING HANDLED**",
      components: [row]
    });

    const component_filter = msg => msg.user.id === interaction.member.id;

    try {
      const confirmation = await response.awaitMessageComponent({ filter: component_filter, time: 5000 });

      if (confirmation.customId === 'confirm') {
        const alertEmbed = new MessageEmbed()
          .setTitle("Emergency")
          .setColor("RED")
          .setDescription("An emergency situation has occured. Please act accordingly.")
          .setTimestamp();

        await interaction.followUp({ content: "<@720691773663346748>", embeds: [alertEmbed] });
      }
      else {
        await interaction.editReply({ content: "An alert was cancelled.", components: [] });
      }
    }
    catch (_err) {
      await interaction.editReply({ content: "Action timed out. Cancelling alert.", components: [] });
    }
  },
};
