const { MessageEmbed } = require('discord.js');
const client = require("../index");

/*client.on("guildMemberRemove", async (member) => {
  if (member.guild.id !== client.config.target.server) {
    return;
  }
  */
module.exports = {
  name: "guildMemberRemove",
  run: async(member) => {
      if (member.guild.id !== client.config.target.server) return;
      const logEmbed = new MessageEmbed()
        .setAuthor(`Member Left - ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
        .setColor('RED')
        .addFields(
          { name: '**Account**', value: `${member}`, inline: true },
          { name: '**Created**', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        )
        .setFooter(`ID: ${member.id}`)
        .setTimestamp();

      const logChannel = client.channels.cache.get(client.config.logging.joinLeave);
      logChannel.send({ embeds: [logEmbed] });
    }
};

