const { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require('discord.js');

const mmConfig = require('../../config.json').modmail;

module.exports = {
  data: new SlashCommandBuilder()
          .setName('close')
          .setDescription('Closes a modmail ticket.')
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
          .addBooleanOption(option =>
            option
              .setName('anonymous')
              .setDescription('Close the ticket anonymously or not.')),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.channel.parentId != mmConfig.category && interaction.channel.parentId != mmConfig.training?.category) {
      await interaction.reply({ content: 'This command must be used in a modmail channel!', ephemeral: true });
      return;
    }

    const isAnonymous = interaction.options.getBoolean('Anonymous') ?? false;

    const embedName = isAnonymous ? (interaction.member.permissions.has(PermissionFlagsBits.Administrator) ? "Administrator Team" : "Moderation Team") : interaction.user.tag;
    const embedProfile = isAnonymous ? mmConfig.anonymousProfile : interaction.user.avatarURL({ dynamic: true });

    const memberId = interaction.channel.name.split('-')[1];
    const member = interaction.guild.members.cache.get(memberId);

    try {
      client.modmailMan.delete(interaction.channel, memberId);
    }
    catch (e) {
      await interaction.reply(`An error occurred trying to delete the channel:\n${e.message}`);
      return;
    }

    const modmailLog = client.channels.cache.get(client.config.logging.modmail);
    const transcript = await client.modmailMan.transcribe(message.channel);
    const logEmbed = new EmbedBuilder()
      .setAuthor(embedName, embedProfile)
      .setColor('RED')
      .setTitle('Thread closed')
      .setDescription(`${embedName} has closed ${interaction.channel.topic}'s ticket`);

    if (isAnonymous) {
      logEmbed.setFooter(interaction.user.tag);
    }
    modmailLog.send({ embeds: [logEmbed], files: [transcript] });


    if (member) {
      const userClosedEmbed = new EmbedBuilder()
        .setAuthor(embedName, embedProfile)
        .setColor('RED')
        .setTitle('Thread closed')
        .setDescription('Your ticket has been closed\n\n**Thank you for contacting the World of Coding staff team!**\n\nReplying to this message will create a new thread. Have a good day!');
      member.send({ embeds: [userClosedEmbed] });
    }
  },
};
