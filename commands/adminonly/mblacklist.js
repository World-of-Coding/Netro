const { Util, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'mblacklist',
  description: 'Blacklists a member from the market place.',
  args: true,
  format: 'mblacklist <user> [reason]',
  permissions: ['MANAGE_MESSAGES'],
  myPermissions: [],
  async run(client, message, args) {

    const member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.fetch(args[0]).catch(()=>{});
    if(!member) return message.channel.send("Could not find the user!");
    if (!member.user) return message.channel.send("Could not find the user!");
    if(member.user.bot) return message.channel.send("You cannot blacklist bots!");

    let reason = args[1] ? args.slice(1).join(" ") : "No reason specified";
    reason = Util.cleanContent(reason, message);
    if (reason.length > 1024)
      return await message.channel.send(`The reason specified was too long. Please keep reasons under 1024 characters`);


    await member.roles.add(client.config.misc.marketBlacklistRole);
    await member.roles.remove(client.config.misc.marketVerifyRole);

    const resultEmbed = new MessageEmbed()
      .setDescription(`${member.user.tag} has been blacklisted from **World of Coding's Marketplace** for: \n**${reason}**`)
      .setColor('RED');
    message.channel.send({ embeds: [resultEmbed] });

    const notifyEmbed = new MessageEmbed()
      .setDescription(`You have been blacklisted from **World of Coding's Marketplace** for:\n${reason}`)
      .setColor('RED');
    member.user.send({ embeds:[notifyEmbed] });
  }
};
