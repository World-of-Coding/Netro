const { EmbedBuilder } = require('discord.js');
const client = require("../index");

module.exports = {
    name: "messageDeleteBulk", 
    run: async (messages) => {
      if (!messages.first().guild) return;

      if (messages.first().guild.id != client.config.target.server) {
        return;
      }


      const bulkDeleteEmbed = new EmbedBuilder()
        .setAuthor(`${messages.first().guild.name}`, `${messages.first().guild.iconURL({ dynamic: true })}`)
        .setColor('RED')
        .setDescription(`*Bulk Message Delete in <#${messages.first().channel.id}> (${messages.size})*`)
        .setTimestamp();

      const logChannel = client.channels.cache.get(client.config.logging.messageUpdate);
      logChannel.send({ embeds: [bulkDeleteEmbed] });
    }
};
