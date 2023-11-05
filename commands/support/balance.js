const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'balance',
  aliases: ['bal', 'thanks'],
  description: 'Displays your point balance.',

  run: async (client, message) => {
    const member = message.mentions.members.first() || message.author;
    if (member.bot) return message.reply("You can't check points for a bot!");

    let money = await client.db.get(`points_${message.guild.id}_${member.id}`);
    if (money === null) money = 0;
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setAuthor("Account Balance", client.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Account Name', value: `${member}`, inline: false },
        { name: 'Balance', value: `${money} points`, inline: false }
      )
      .setFooter(`${message.guild.name}`, `${message.guild.iconURL({ dynamic: true })}`)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
