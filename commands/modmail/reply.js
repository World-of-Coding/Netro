const { MessageEmbed, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client } = require("discord.js");

const mmConfig = require("../../config.json").modmail;
module.exports = {
  data: new SlashCommandBuilder()
          .setName('reply')
          .setDescription('Reply to a modmail ticket.')
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
          .addStringOption(option =>
            option
              .setName('Message')
              .setDescription('Message to respond with.')
              .setRequired(true)
              .setMaxLength(1024))
          .addAttachmentOption(option =>
            option
              .setName('Attachment')
              .setDescription('Attachment to send with the response.'))
          .addBooleanOption(option =>
            option
              .setName('Anonymous')
              .setDescription('Send the response anonymously or not.')),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} _client
   */
  async execute(interaction, _client) {
    if (interaction.channel.parentId != mmConfig.category && interaction.channel.parentId != mmConfig.training?.category) {
      await interaction.reply({ content: 'This command must be used in a modmail channel!', ephemeral: true });
      return;
    }

    const memberId = interaction.channel.name.split("-")[1];
    const member = await interaction.guild.members.fetch(memberId).catch(()=>{});
    if (!member) {
      await interaction.reply('Failed to find the user to reply to!');
      return;
    }

    const isAnonymous = interaction.options.getBoolean('Anonymous') ?? false;

    const embedName = isAnonymous ? (interaction.member.permissions.has(PermissionFlagsBits.Administrator) ? "Administrator Team" : "Moderation Team") : interaction.user.tag;
    const embedProfile = isAnonymous ? mmConfig.anonymousProfile : interaction.user.avatarURL({ dynamic: true });

    const file = interaction.options.getAttachment('Attachment');
    if (file.size > 8_000_000) {
      await interaction.reply({ content: 'Unable to send response, attached file exceeds 8MB!', ephemeral: true });
      return;
    }
    
    const userReply = new MessageEmbed()
      .setAuthor(embedName, embedProfile)
      .setDescription(replyContent)
      .setTimestamp()
      .setColor("BLUE");

    if (file) {
      member.send({ embeds: [userReply], files: [{ attachment: file.url, name: 'attachment.jpg' }] });
    }
    else {
      member.send({ embeds: [userReply] });
    }

    const staffReply = new MessageEmbed()
      .setAuthor(embedName, embedProfile)
      .setDescription("Message sent")
      .addField("Message", replyContent)
      .setTimestamp()
      .setColor("BLUE");

    if (isAnonymous) {
      staffReply.setFooter(interaction.user.tag);
    }

    if (file) {
      await interaction.reply({ embeds: [staffReply], files: [{ attachment: file.url, name: 'attachment.jpg' }] });
    }
    else {
      await interaction.reply({ embeds: [staffReply] });
    }
  }
};
