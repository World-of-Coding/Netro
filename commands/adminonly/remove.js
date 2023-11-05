const { MessageEmbed, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('remove')
          .setDescription('Remove points from a user!')
          .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
          .addUserOption(option =>
            option
              .setName('User')
              .setDescription('User to remove points from.')
              .setRequired(true))
          .addIntegerOption(option =>
            option
              .setName('Points')
              .setDescription('Amount of points to remove from User.')
              .setRequired(true)),
  
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const member = interaction.options.getMember('User');
    if (member.bot) {
      await interaction.reply("You can't remove points from a bot!");
      return;
    }

    let money = await client.db.get(`points_${message.guild.id}_${member.id}`);
    const points = interaction.options.getInteger('Points');

    if (points < 0) {
      await interaction.reply({ content: "You can't remove negative amount of points!", ephemeral: true });
      return;
    } else if (money < points) {
      await interaction.reply({ content: "The user doesn't have this much money!", ephemeral: true });
      return;
    }

    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`Removed **${points}** points from ${member}!`);

    client.db.subtract(`points_${message.guild.id}_${member.id}`, points);
    await interaction.reply({ embeds: [embed], ephemeral: true });
    
    let helper_check = await client.db.get(`points_${message.guild.id}_${member.id}`);
    if(helper_check < 10) {
        member.roles.remove(client.config.misc.helperRole)
    }
  }
};