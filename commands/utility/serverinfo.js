const { MessageEmbed, TextChannel } = require('discord.js');
const moment = require('moment');
const CarouselEmbed = require('../../utils/carousel');

const filterLevels = {
  DISABLED: 'Off',
  MEMBERS_WITHOUT_ROLES: 'No Role',
  ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
  NONE: 'None',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: '(╯°□°）╯︵ ┻━┻',
  VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
  brazil: 'Brazil',
  europe: 'Europe',
  hongkong: 'Hong Kong',
  india: 'India',
  japan: 'Japan',
  russia: 'Russia',
  singapore: 'Singapore',
  southafrica: 'South Africa',
  sydeny: 'Sydeny',
  'us-central': 'US Central',
  'us-east': 'US East',
  'us-west': 'US West',
  'us-south': 'US South'
};

module.exports = {
  name: 'serverinfo',
  aliases: ['guildinfo'],
  format: 'serverinfo',
  args: false,
  permissions: [],
  myPermissions: [],
  cooldown:5,
  description: "Info the the current server you're in",
  async run(client, message) {

    const roles = message.guild.roles.cache.sort((a, b) => a.position - b.position).map(r => r.toString());
    const channels = message.guild.channels.cache;
    const emojis = message.guild.emojis.cache;
    const members = message.guild.members.cache;
    const icon = message.guild.iconURL({ dynamic: true });
    const owner = await message.guild.fetchOwner();

    const generalEmbed = new MessageEmbed()
      .setTitle("Server Info " + message.guild.name)
      .addField("Icon", `[Click here to download!](${icon} "Click here to download ${message.guild.name}'s icon!")`, false)
      .addField('General', [
        `**Name:** ${message.guild.name}`,
        `**ID:** ${message.guild.id}`,
        `**Owner:** ${owner.user.tag} (${owner.id})`,
        `**Region:** ${regions[message.guild.region]}`,
        `**Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
        `**Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
        `**Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
        `**Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
        '\u200b'
      ].join('\n'))
      .setThumbnail(icon)
      .setColor("BLUE");

    const statisticsEmbed = new MessageEmbed()
      .setTitle(`Server Info ${message.guild.name}`)
      .setThumbnail(icon)
      .setColor("BLUE")
      .addField("Icon", `[Click here to download!](${icon} "Click here to download ${message.guild.name}'s icon!")`, false)
      .addField('Statistics', [
        `**Role Count:** ${roles.length}`,
        `**Emoji Count:** ${emojis.size}`,
        `**Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
        `**Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
        `**Member Count:** ${message.guild.memberCount}`,
        `**Humans:** ${members.filter(member => !member.user.bot).size}`,
        `**Bots:** ${members.filter(member => member.user.bot).size}`,
        `**Text Channels:** ${channels.filter(channel => channel instanceof TextChannel).size}`,
        `**Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
        `**Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
        '\u200b'
      ].join('\n'));

    const precenseEmbed = new MessageEmbed()
      .setTitle(`Server info ${message.guild.name}`)
      .addField("Icon", `[Click here to download!](${icon} "Click here to download ${message.guild.name}'s icon!")`, false)
      .setThumbnail(icon)
      .setColor("BLUE")
      .addField('Presence', [
        `**Online:** ${members.filter(member => member.presence?.status === 'online').size}`,
        `**Idle:** ${members.filter(member => member.presence?.status === 'idle').size}`,
        `**Do Not Disturb:** ${members.filter(member => member.presence?.status === 'dnd').size}`,
        `**Offline:** ${members.filter(member => member.presence === null).size}`,
        '\u200b'
      ].join('\n'));

    const ageEmbed = new MessageEmbed()
      .setTitle(`Server info ${message.guild.name}`)
      .addField("Icon", `[Click here to download!](${icon} "Click here to download ${message.guild.name}'s icon!")`, false)
      .setThumbnail(icon)
      .setColor("BLUE")
      .addField('Ages', [
        `**Oldest:**, ${message.guild.members.cache.filter((m) => !m.user.bot).sort((a, b) => a.user.createdAt - b.user.createdAt).first().user.tag}`,
        `**Youngest:**, ${message.guild.members.cache.filter((m) => !m.user.bot).sort((a, b) => b.user.createdAt - a.user.createdAt).first().user.tag}`
      ].join('\n'));

    const serverinfoEmbedCarousel = new CarouselEmbed([generalEmbed, statisticsEmbed, precenseEmbed, ageEmbed], message);
    serverinfoEmbedCarousel.startCarousel();

  }
};