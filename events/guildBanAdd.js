const { MessageEmbed } = require('discord.js');
const client = require("../index");

/*client.on("guildBanAdd", async (ban) => {
  if (ban.partial) {
    try {
      await ban.fetch();
    }
    catch (e) {
      console.debug(e);
      console.warn(`Failed to fetch ban ${ban.user.id}; ignoring`);
      return;
    }
  }
  */

module.exports = {
  name: "guildBanAdd",
  run: async(ban) => {
    if (ban.guild.id != client.config.target.server) return;

      const banEmbed = new MessageEmbed()
      .setAuthor("Member banned", ban.user.displayAvatarURL({ dynamic: true }))
      .setColor('RED')
      .addFields(
          { name: '**User**', value: `${ban.user} - ${ban.user.tag}`, inline: true },
          { name: '**Reason**', value: `${ban.reason || "No reason specified"}`, inline: true },
      )
      .setFooter(`ID: ${ban.user.id}`)
      .setTimestamp();

      const logChannel = client.channels.cache.get(client.config.logging.banUnban);
      logChannel.send({ embeds: [banEmbed] });
  }
};

  
