const { MessageEmbed } = require('discord.js');
const client = require("../index");
const str = require('@supercharge/strings');
const automod = require("../utils/automod.js");

module.exports = {
    name: "messageUpdate", 
    run: async (oldMessage, newMessage) => {
      if (!newMessage.guild) return;

      if (newMessage.guild.id != client.config.target.server) {
        return;
      }

      if (oldMessage.partial) {
        await oldMessage.fetch().catch((e) => console.debug(e));
      }

      if (newMessage.partial) {
        try {
          await newMessage.fetch();
        }
        catch (e) {
          console.debug(e);
          console.warn(`Failed to fetch message ${newMessage.id}; ignoring`);
          return;
        }
      }

      if (oldMessage.content != newMessage.content) {
        if(newMessage.channel.id == "717086840301027328" || newMessage.channel.id == "879845373802315806") return;
        const contentChangeEmbed = new MessageEmbed()
          .setAuthor(`${newMessage.author.tag}`, `${newMessage.author.displayAvatarURL({ dynamic: true })}`)
          .setColor('YELLOW')
          .setDescription(`*Message updated in <#${newMessage.channel.id}> [Jump](${newMessage.url})*`)
          .addFields([
            { name: "**Before**", value: str(oldMessage.content || '(no content)').limit(1000, '...').get(), inline: false },
            { name: "**After**", value: str(newMessage.content || '(no content)').limit(1000, '...').get(), inline: false },
          ])
          .setFooter(`ID: ${newMessage.author.id}`)
          .setTimestamp();

        const logChannel = client.channels.cache.get(client.config.logging.messageUpdate);
        logChannel.send({ embeds: [contentChangeEmbed] });
      }
    }
};