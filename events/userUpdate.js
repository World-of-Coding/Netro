const { EmbedBuilder } = require('discord.js');
const client = require("../index");

module.exports = {
    name: 'userUpdate', 
    run: async (oldUser, newUser) => {
      let shouldLog = false;

      const updateEmbed = new EmbedBuilder()
        .setAuthor(newUser.tag, newUser.displayAvatarURL())
        .setColor('GREEN')
        .setFooter(`ID: ${newUser.id}`)
        .setTimestamp();

      if (oldUser.username != newUser.username) {
        updateEmbed
          .setTitle('Username Updated')
          .setDescription(`${oldUser.username} **=>** ${newUser.username}`);

        shouldLog = true;
      }

      if (oldUser.defaultAvatarURL != newUser.defaultAvatarURL) {
        updateEmbed
          .setTitle("Avatar Updated")
          .setDescription(`[[Before]](${oldUser.defaultAvatarURL}) **=>** [[After]](${newUser.defaultAvatarURL})`);

        shouldLog = true;
      }

      if (shouldLog) {
        const logChannel = client.channels.cache.get(client.config.logging.userUpdate);
        logChannel.send({ embeds: [updateEmbed] });
      }
    }
};
