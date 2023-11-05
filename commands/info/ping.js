const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
          .setName('ping')
          .setDescription('Get the latency between the bot and Discord\'s gateway.'),

  /**
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    await interaction.reply(`${interaction.client.ws.ping}ms`);
  },
};
