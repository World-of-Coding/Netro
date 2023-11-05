const { MessageEmbed } = require('discord.js');
const client = require("../index");
const str = require("@supercharge/strings");

module.exports = {
    name: "messageDelete", 
    run: async (message) => {
      /*if (message.partial) {
        try {
          await message.fetch();
        }
        catch (e) {
          console.debug(e);
          console.warn(`Failed to fetch message ${message.id}; ignoring`);
          return;
        }
      }*/

      if (!message.guild) return;

      if (message.guild.id != client.config.target.server) return;
      
      if(message.channel.id == "717086840301027328" || message.channel.id == "879845373802315806") return;

      const deleteEmbed = new MessageEmbed()
        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setColor('RED')
        .setDescription(`*Message Deleted in <#${message.channel.id}>*`)
        .addField("Content", str(message.content || '(no content)').limit(1000, '...').get())
        .setFooter(`ID: ${message.author.id}`)
        .setTimestamp();

      const logChannel = client.channels.cache.get(client.config.logging.messageUpdate);
      logChannel.send({ embeds: [deleteEmbed] });
    }
};