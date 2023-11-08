const { EmbedBuilder } = require('discord.js');
const client = require("../index");

module.exports = {
    name: "voiceStateUpdate",
    run: async (oldState, newState) => {
      if (oldState.channel != newState.channel) {
        const vcUpdateEmbed = new EmbedBuilder()
          .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({ dynamic: true }))
          .setDescription(`${newState.member} ${oldState.channel ? 'left' : 'joined'} ${oldState.channel ? oldState.channel : newState.channel}`)
          .setColor(`${oldState.channel ? 'RED' : 'GREEN'}`)
          .setFooter(`ID: ${newState.member.id}`)
          .setTimestamp();

        const logChannel = client.channels.cache.get(client.config.vcUpdate);
        logChannel.send({ embeds: [vcUpdateEmbed] });
      }
    }
};

