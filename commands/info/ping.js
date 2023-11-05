const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
          .setName('ping')
          .setDescription('Get the latency between the bot and Discord\'s gateway.'),

  /**
   * @param {ChatInputCommandInteraction} interaction 
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.reply(`${client.ws.ping}ms`);
  },
};
