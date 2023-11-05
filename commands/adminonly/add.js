const { MessageEmbed, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('add')
          .setDescription('Add points to a user!')
          .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
          .addUserOption(option =>
            option
              .setName('User')
              .setDescription('User to add points to.')
              .setRequired(true))
          .addIntegerOption(option =>
            option
              .setName('Points')
              .setDescription("Amount of points to give to User.")
              .setRequired(true)),
  
  /**
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    const member = interaction.options.getMember('User');
    if (member.bot) {
      await interaction.reply("You can't add points to a bot!");
      return;
    }

    const points = interaction.options.getInteger('Points');

    if (points < 0) {
      await interaction.reply({ content: "You can't add negative amount of points!", ephemeral: true });
      return;
    } else if (points > 100) {
      await interaction.reply({ content: "You cannot add more then 100 points!", ephemeral: true });
      return;
    }

    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`Added **${points}** to ${member}!`);

	  await interaction.reply({ embeds: [embed], ephemeral: true });
	  client.db.add(`points_${message.guild.id}_${member.id}`, points);

    let helper_check = await client.db.get(`points_${message.guild.id}_${member.id}`);
    if(helper_check >= 10) {
        member.roles.add(client.config.misc.helperRole)
    }
  }
};