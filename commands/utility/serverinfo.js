const { EmbedBuilder, TextChannel, SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
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
  data: new SlashCommandBuilder()
          .setName('serverinfo')
          .setDescription('Info for the server.'),
  cooldown:5,

  /**
   * @param {ChatInputCommandInteraction} interaction 
   * @param {Client} _client 
   */
  async execute(interaction, _client) {

    const roles = interaction.guild.roles.cache.sort((a, b) => a.position - b.position).map(r => r.toString());
    const channels = interaction.guild.channels.cache;
    const emojis = interaction.guild.emojis.cache;
    const members = interaction.guild.members.cache;
    const icon = interaction.guild.iconURL({ dynamic: true });
    const owner = await interaction.guild.fetchOwner();

    const generalEmbed = new EmbedBuilder()
      .setTitle("Server Info " + interaction.guild.name)
      .addField("Icon", `[Click here to download!](${icon} "Click here to download ${interaction.guild.name}'s icon!")`, false)
      .addField('General', [
        `**Name:** ${interaction.guild.name}`,
        `**ID:** ${interaction.guild.id}`,
        `**Owner:** ${owner.user.tag} (${owner.id})`,
        `**Region:** ${regions[interaction.guild.region]}`,
        `**Boost Tier:** ${interaction.guild.premiumTier ? `Tier ${interaction.guild.premiumTier}` : 'None'}`,
        `**Explicit Filter:** ${filterLevels[interaction.guild.explicitContentFilter]}`,
        `**Verification Level:** ${verificationLevels[interaction.guild.verificationLevel]}`,
        `**Time Created:** ${moment(interaction.guild.createdTimestamp).format('LT')} ${moment(interaction.guild.createdTimestamp).format('LL')} ${moment(interaction.guild.createdTimestamp).fromNow()}`,
        '\u200b'
      ].join('\n'))
      .setThumbnail(icon)
      .setColor("BLUE");

    const statisticsEmbed = new EmbedBuilder()
      .setTitle(`Server Info ${interaction.guild.name}`)
      .setThumbnail(icon)
      .setColor("BLUE")
      .addField("Icon", `[Click here to download!](${icon} "Click here to download ${interaction.guild.name}'s icon!")`, false)
      .addField('Statistics', [
        `**Role Count:** ${roles.length}`,
        `**Emoji Count:** ${emojis.size}`,
        `**Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
        `**Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
        `**Member Count:** ${interaction.guild.memberCount}`,
        `**Humans:** ${members.filter(member => !member.user.bot).size}`,
        `**Bots:** ${members.filter(member => member.user.bot).size}`,
        `**Text Channels:** ${channels.filter(channel => channel instanceof TextChannel).size}`,
        `**Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
        `**Boost Count:** ${interaction.guild.premiumSubscriptionCount || '0'}`,
        '\u200b'
      ].join('\n'));

    const precenseEmbed = new EmbedBuilder()
      .setTitle(`Server info ${interaction.guild.name}`)
      .addField("Icon", `[Click here to download!](${icon} "Click here to download ${interaction.guild.name}'s icon!")`, false)
      .setThumbnail(icon)
      .setColor("BLUE")
      .addField('Presence', [
        `**Online:** ${members.filter(member => member.presence?.status === 'online').size}`,
        `**Idle:** ${members.filter(member => member.presence?.status === 'idle').size}`,
        `**Do Not Disturb:** ${members.filter(member => member.presence?.status === 'dnd').size}`,
        `**Offline:** ${members.filter(member => member.presence === null).size}`,
        '\u200b'
      ].join('\n'));

    const ageEmbed = new EmbedBuilder()
      .setTitle(`Server info ${interaction.guild.name}`)
      .addField("Icon", `[Click here to download!](${icon} "Click here to download ${interaction.guild.name}'s icon!")`, false)
      .setThumbnail(icon)
      .setColor("BLUE")
      .addField('Ages', [
        `**Oldest:**, ${interaction.guild.members.cache.filter((m) => !m.user.bot).sort((a, b) => a.user.createdAt - b.user.createdAt).first().user.tag}`,
        `**Youngest:**, ${interaction.guild.members.cache.filter((m) => !m.user.bot).sort((a, b) => b.user.createdAt - a.user.createdAt).first().user.tag}`
      ].join('\n'));

    const serverinfoEmbedCarousel = new CarouselEmbed([generalEmbed, statisticsEmbed, precenseEmbed, ageEmbed], interaction);
    serverinfoEmbedCarousel.startCarousel();

  }
};