const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const CarouselEmbed = require('../../utils/carousel.js');

module.exports = {
  name: 'userinfo',
  aliases: ['info'],
  format:'userinfo [user]',
  description: 'Info of a user or yourself',
  permissions: [],
  myPermissions: [],
  args: false,
  cooldown: 5,
  async run(client, message, args) {

    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user || message.author;
    if(user.partial) { await user.fetch(); }

    const member = message.guild.members.cache.get(user.id);
    if(!member) { return message.channel.send('Sorry, you need to mention a user in this server.'); }

    const avatar = user.displayAvatarURL({ dynamic: true });
    let embeds = [];

    const userEmbed = new MessageEmbed()
      .setTitle("User Specific **" + user.tag + "**")
      .addFields(
        { name: 'Avatar', value: `[Click to Download](${avatar} "Click to download ${user.tag}'s avatar!")`, inline: false },

        { name: 'Username', value: `${member.user.username}`, inline: true },
        { name: 'ID', value: `${member.id}`, inline: true },
        { name: 'Bot', value: `${member.user.bot}`, inline: true },

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
      .setTitle(`Roles **${member.user.tag}**`)
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
        .setTitle(`Activity **${member.user.tag}**`)
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

    const carouselEmbed = new CarouselEmbed(embeds, message);
    carouselEmbed.startCarousel();
  }
};