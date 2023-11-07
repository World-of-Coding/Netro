const { MessageEmbed, SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
const moment = require('moment');
const CarouselEmbed = require('../../utils/carousel.js');

module.exports = {
  data: new SlashCommandBuilder()
          .setName('userinfo')
          .setDescription('Info of another user or yourself.')
          .addUserOption(option =>
            option
              .setName('User')
              .setDescription('User to get the info of.')),
  cooldown: 5,

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const member = interaction.options.getMember('User');
    const user = member.user;

    const avatar = user.displayAvatarURL({ dynamic: true });
    let embeds = [];

    const userEmbed = new MessageEmbed()
      .setTitle("User Specific **" + user.tag + "**")
      .addFields(
        { name: 'Avatar', value: `[Click to Download](${avatar} "Click to download ${user.tag}'s avatar!")`, inline: false },

        { name: 'Username', value: `${user.username}`, inline: true },
        { name: 'ID', value: `${user.id}`, inline: true },
        { name: 'Bot', value: `${user.bot}`, inline: true },

        { name: 'Created At', value: `${moment(user.createdAt).format('MM/DD/YYYY h:mm:ss a')}`, inline: true },
        { name: 'Joined At', value: `${moment(member.joinedAt).format(`MM/DD/YYYY h:mm:ss a`)}`, inline: true },
        { name: 'Status', value: `${member.presence?.status || "N/A"}`, inline: true },
      )
      .setThumbnail(avatar)
      .setColor("RED");
    embeds.push(userEmbed);


    let roles = '';
    member.roles.cache.forEach(role => {
      if (role.name != "@everyone") { roles += ` ${role} `; }
    });
    if(roles.length < 1) { roles = "none"; }

    const roleEmbed = new MessageEmbed()
      .setTitle(`Roles **${user.tag}**`)
      .setDescription(`${roles}`)
      .setColor("RED");
    embeds.push(roleEmbed);


    const activities = user.presence?.activities || [{
      // HACK: too lazy, just inject dummy data.
      name: "N/A",
      type: "N/A"
    }];
    for(const activity of activities) {
      const activityEmbed = new MessageEmbed()
        .setTitle(`Activity **${user.tag}**`)
        .setThumbnail(avatar)
        .setColor('RED')
        .addFields(
          { name: 'Name', value: `${activity.name}`, inline: true },
          { name: 'Type', value: `${activity.type}`, inline: true },
          { name: 'URL', value: `${activity.url ? activity.url : "None"}`, inline: true },

          { name: 'State', value: `${activity.state ? activity.state : "None"}`, inline: true },
          { name: 'Details', value: `${activity.details ? activity.details : "None"}`, inline: true },
        );
      embeds.push(activityEmbed);
    }

    const carouselEmbed = new CarouselEmbed(embeds, interaction);
    carouselEmbed.startCarousel();
  }
};