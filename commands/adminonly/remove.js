const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'remove',
  args: true,
  format: 'remove <user> <points>',
  description: 'Remove points from a user!',
  permissions: ["ADMINISTRATOR"],
  myPermissions: [],
  async run(client, message, args) {

    let member = message.mentions.members.first() || message.author;
    if (member.bot) return message.reply("You can't remove points from a bot!");

    let money = await client.db.get(`points_${message.guild.id}_${member.id}`);

    const points = args[1];
    if (isNaN(points) || points === 0) return message.channel.send("The points must be an actual number!");
    if (!points) return message.channel.send("You must mention an amount of points to remove!");
    if (points < 0) return message.channel.send("You can't remove negative amount of points!");
    if (money < points) return message.channel.send("The user doesn't have this much money!");

    if (money === 0) return message.channel.send("The user doesn't have any money!");

    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`Removed **${points}** from ${member}!`);

    message.channel.send({ embeds: [embed] });

    client.db.subtract(`points_${message.guild.id}_${member.id}`, points) ;
    
    member = message.guild.members.cache.get(member.id);
    let points2 = await client.db.get(`points_${message.guild.id}_${member.id}`);
    if(points2 >= 10) {
        member.roles.remove(client.config.misc.helperRole)
    }
  }
};