const { MessageEmbed } = require('discord.js');
const talkedRecently = new Set();

module.exports = {
  name: 'thank',
  args: true,
  format: 'thank <user>',
  description: 'Thank a user for helping you!',
  permissions: [],
  myPermissions: [],

  async run(client, message) {
    if (talkedRecently.has(message.author.id)) {
      message.channel.send(`You can only run this command every 15 minutes!`);
      return;
    }

    let member = message.mentions.members.first();
    if (message.channel.parentId !== client.config.coding_help.parentCategory) return message.channel.send("You need to be in a coding help channel for this command to work!");

    if (!member) return message.channel.send("You must mention a member to thank!");
    if (member.id === message.author.id) return message.channel.send("You can't thank yourself, silly!") ;
    if (member.user.bot) return message.channel.send("That's a bot!");
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`${message.author} thanked ${member}! **+1 point**`);
	  message.channel.send({ embeds: [embed] });

    member = message.guild.members.cache.get(member.id);
    client.db.add(`points_${message.guild.id}_${member.id}`, 1)
    let points = await client.db.get(`points_${message.guild.id}_${member.id}`)
    if(points >= 10) {
        member.roles.add(client.config.misc.helperRole)
    }

    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 900000);

  }
};