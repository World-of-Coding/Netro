const { Client, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'emergency',
  aliases: ['alert'],
  cooldown: 900,

  run: async (client, message, args) => {
    message.reply("**Are you sure?** Executing this action will ping the moderation team.\nAbusing this feature will result in further moderation actions.\n**ONLY PROCEED WHEN THERE'S SERVER-WIDE THREAT THAT IS NOT BEING HANDLED**\nTo proceed, type \"**I agree**\"");

    const emergencyText = client.config.security.emergencyText;
    if (!emergencyText) {
      // Disable silently
      return;
    }

    const alertEmbed = new MessageEmbed()
      .setTitle("Emergency")
      .setColor("RED")
      .setDescription("An emergency situation has occured. Please act accordingly.")
      .setTimestamp();

    const filter = m => (m.author.id === message.author.id) && m.content.toLowerCase() === "i agree";

    message.channel.awaitMessages({ filter, max: 1, time: 60_000, errors: ['time'] })
      .then(collected => message.channel.send({ content: emergencyText, embeds: [alertEmbed] }))
      .catch(collected => message.channel.send("Action timed out. Abort."));
  },
};
