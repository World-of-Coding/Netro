const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'add',
  args: true,
  format: 'add <user> <points>',
  description: 'Add points to a user!',
  permissions: ["ADMINISTRATOR"],
  myPermissions: [],
  async run(client, message, args) {

    let member = message.mentions.members.first() || message.author;
    if (member.bot) return message.reply("You can't add points to a bot!");

    const points = args[1];

    if (isNaN(points) || points === 0) return message.channel.send("The points must be an actual number!");
    if (!points) return message.channel.send("You must include an amount of points to add!");
    if (points < 0) return message.channel.send("You can't add negative amount of points!");
    if (points > 100) return message.channel.send("You cannot add more then 100 points!");

    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`Added **${points}** to ${member}!`);

	  message.channel.send({ embeds: [embed] });

	  client.db.add(`points_${message.guild.id}_${member.id}`, points);
	  
	  member = message.guild.members.cache.get(member.id);
    let points2 = await client.db.get(`points_${message.guild.id}_${member.id}`);
    if(points2 >= 10) {
        member.roles.add(client.config.misc.helperRole)
    }
  }
};