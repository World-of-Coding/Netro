const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
          .setName('blacklist')
          .setDescription('Blacklists/unblacklists someone from using modmail.')
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
          .addUserOption(option =>
            option
              .setName('User')
              .setDescription('User to blacklist/unblacklist.')
              .setRequired(true))
          .addBooleanOption(option =>
            option
              .setName('Blacklist')
              .setDescription('Flag to determine if you blacklist or unblacklist the User.')
              .setRequired(true)),
          
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const blackListed = await client.db.get('modmail_blacklistedUsers');

    const member = interaction.options.getMember('User');
    if(member.bot) {
      await interaction.reply({ content: 'You cannot blacklist bots!', ephemeral: true });
      return;
    }

    if(interaction.options.getBoolean('Blacklist')) {
      if (blackListed.indexOf(member.user.id) != -1) {
        await interaction.reply({ content: 'That user is already blacklisted!', ephemeral: true });
        return;
      }

      blackListed.push(member.user.id);
      await interaction.reply(`**${member.user.tag}** has been blacklisted!`);
    }
    else {
      if (blackListed.indexOf(member.user.id) == -1) {
        await interaction.reply({ content: 'That user is not blacklisted!', ephemeral: true });
        return;
      }

      blackListed.splice(blackListed.indexOf(member.user.id), 1);
      await interaction.reply(`**${member.user.tag}** has been unblacklisted!`);
    }
    
    client.db.set('modmail_blacklistedUsers', blackListed);
  }
};