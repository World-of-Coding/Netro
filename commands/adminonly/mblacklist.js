const { Util, MessageEmbed, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('marketblacklist')
          .setDescription('Blacklists a member from the market place.')
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
          .addUserOption(option =>
            option
              .setName('User')
              .setDescription('User to blacklist from the market place.')
              .setRequired(true))
          .addStringOption(option =>
            option
              .setName('Reason')
              .setDescription('The reason for blacklisting.')),
  
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const member = interaction.options.getMember('User');
    if (member.user.bot) {
      await interaction.reply({ content: "You cannot blacklist bots!", ephemeral: true });
      return;
    }

    let reason = interaction.options.getString('Reason') ?? 'No reason specified.';
    reason = Util.cleanContent(reason, message);
    if (reason.length > 1024) {
      await interaction.reply({ content: 'The reason specified was too long. Please keep reasons under 1024 characters', ephemeral: true });
      return;
    }

    await member.roles.add(client.config.misc.marketBlacklistRole);
    await member.roles.remove(client.config.misc.marketVerifyRole);

    const resultEmbed = new MessageEmbed()
      .setDescription(`${member.user.tag} has been blacklisted from **World of Coding's Marketplace** for: \n**${reason}**`)
      .setColor('RED');
    await interaction.reply({ embeds: [resultEmbed], ephemeral: true });

    const notifyEmbed = new MessageEmbed()
      .setDescription(`You have been blacklisted from **World of Coding's Marketplace** for:\n${reason}`)
      .setColor('RED');
    await interaction.reply({ embeds:[notifyEmbed], ephemeral: true });
  }
};
