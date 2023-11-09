const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
          .setName('suggest')
          .setDescription('Send a suggestion to the suggestions channel.')
          .addStringOption(option =>
            option
              .setName('Suggestion')
              .setDescription('Your suggestion to staff.')
              .setRequired(true)),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const suggestionChannel = client.config.misc.suggestionChannel;

    if (!suggestionChannel) {
      await interaction.reply({ embeds: [{ color:"RED", description:`The suggestions channel has not been set!` }], ephemeral: true });
      return;
    }

    const text = interaction.options.getString('Suggestion');
    let msg = await client.channels.cache.get(suggestionChannel).send({ embeds:[{ color:"GREEN", author: { name: interaction.user.tag, icon_url: interaction.user.displayAvatarURL({ dynamic: false }) }, description: text, footer: { text: interaction.guild.name, icon_url: interaction.guild.iconURL({ dynamic: false }) } }] });
    await msg.react("<:TickYes:832708609472987166>");
    await msg.react("<:TickNeutral:832708618779885619>");
    await msg.react("<:TickNo:832708631857463370>");

    await interaction.reply({ content: `<@${interaction.user.id}>`, embeds:[{ color:"GREEN", description:`Sent your suggestion! <#${suggestionChannel}>!` }], ephemeral: true });
  },
};
