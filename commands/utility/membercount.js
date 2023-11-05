const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "membercount",
  args: false,
  permissions: [],
  myPermissions: [],
  aliases: ["usercount"],
  description: "Gets the member count of the server",
  async run(_client, message) {

    const memberCount = message.guild.memberCount;
    const bots = message.guild.members.cache.filter(m => m.user.bot).size;

    const countEmbed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle("__Members__")
      .addField("Total", `${memberCount}`)
      .addField("Humans", `${memberCount - bots}`)
      .addField("Bots", `${bots}`)
      .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }));

	  message.channel.send({ embeds: [countEmbed] });
  }
};
