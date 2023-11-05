const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
const topics = require('../../assets/topics.json');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('topic')
          .setDescription('Get a random topic.'),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} _client
   */
  async execute(interaction, _client) {
    await interaction.reply(topics[Math.floor(Math.random() * topics.length)]);
  },
};
