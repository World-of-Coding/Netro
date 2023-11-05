const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const topics = require('../../assets/topics.json');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('topic')
          .setDescription('Get a random topic.'),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply(topics[Math.floor(Math.random() * topics.length)]);
  },
};
