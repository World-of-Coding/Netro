const { EmbedBuilder, Message, Client, Events } = require('discord.js');
const str = require("@supercharge/strings");

module.exports = {
	name: Events.MessageDelete, 
	/**
	 * @param {Message} message
	 * @param {Client} client
	 */
	async execute(message, client) {
		if (!message.guild || message.guildId != client.config.target.server) {
			return;
		}
		
		if (message.channel.id == "717086840301027328" || message.channel.id == "879845373802315806") {
			return;
		}

		const deleteEmbed = new EmbedBuilder()
			.setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
			.setColor('RED')
			.setDescription(`*Message Deleted in <#${message.channel.id}>*`)
			.addField("Content", str(message.content || '(no content)').limit(1000, '...').get())
			.setFooter(`ID: ${message.author.id}`)
			.setTimestamp();

		const logChannel = client.channels.cache.get(client.config.logging.messageUpdate);
		await logChannel.send({ embeds: [deleteEmbed] });
	}
};
