const { EmbedBuilder, GuildBan, Client, Events } = require('discord.js');

module.exports = {
	name: Events.GuildBanAdd,
	/**
	 * @param {GuildBan} ban
	 * @param {Client} client
	 */
	async execute(ban, client) {
		if (ban.guild.id != client.config.target.server) {
			return;
		}

		const banEmbed = new EmbedBuilder()
			.setAuthor("Member banned", ban.user.displayAvatarURL({ dynamic: true }))
			.setColor('RED')
			.addFields(
				{ name: '**User**', value: `${ban.user} - ${ban.user.tag}`, inline: true },
				{ name: '**Reason**', value: `${ban.reason || "No reason specified"}`, inline: true },
			)
			.setFooter(`ID: ${ban.user.id}`)
			.setTimestamp();

		const logChannel = client.channels.cache.get(client.config.logging.banUnban);
		await logChannel.send({ embeds: [banEmbed] });
	}
};
