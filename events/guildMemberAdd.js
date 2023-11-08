const { EmbedBuilder } = require('discord.js');
const client = require("../index");

/*client.on("guildMemberAdd", async (member) => {
  if (member.guild.id !== client.config.target.server) {
    return;
  }
  */

module.exports = {
  name: "guildMemberAdd",
  run: async(member) => {
      if (member.guild.id !== client.config.target.server) return;
      if (client.config.greeter.enable) {
        const newMember = ((member.user.createdTimestamp + 3600) > member.joinedTimestamp);
        const greetChannel = client.channels.cache.get(client.config.greeter.eventChannel);

        const greetEmbed = new EmbedBuilder()
          .setTitle("Welcome")
          .setColor('GREEN')
          .setDescription(`${ newMember ? '⚠️ ' : ''}${member} Welcome to ${member.guild.name}!${newMember ? `\nThis account was created <t:${Date.now() - 	 (member.joinedTimestamp - member.user.createdTimestamp)}:R>` : ''}`);
        greetChannel.send({ embeds: [greetEmbed] });
      }

      const logEmbed = new EmbedBuilder()
        .setAuthor(`New Member - ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
        .setColor('GREEN')
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
