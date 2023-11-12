const { EmbedBuilder, Collection, Snowflake, Message, Events } = require('discord.js');

module.exports = {
	name: Events.MessageBulkDelete,
	/**
	 * @param {Collection<Snowflake, Message>} messages
	 * @param {*} client
	 */
	async execute(messages, client) {
		const firstMessage = messages.first();
		if (!firstMessage.guild || firstMessage.guildId != client.config.target.server) {
			return;
		}

		const bulkDeleteEmbed = new EmbedBuilder()
			.setAuthor(`${firstMessage.guild.name}`, `${firstMessage.guild.iconURL({ dynamic: true })}`)
			.setColor('RED')
			.setDescription(`*Bulk Message Delete in <#${firstMessage.channelId}> (${messages.size})*`)
			.setTimestamp();

		const logChannel = client.channels.cache.get(client.config.logging.messageUpdate);
		await logChannel.send({ embeds: [bulkDeleteEmbed] });
	}
};
