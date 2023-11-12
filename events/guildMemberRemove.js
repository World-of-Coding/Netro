const { EmbedBuilder, GuildMember, Client, Events } = require('discord.js');

module.exports = {
	name: Events.GuildMemberRemove,
	/**
	 * @param {GuildMember} member
	 * @param {Client} client
	 */
	async execute(member, client) {
	if (member.guild.id !== client.config.target.server) {
		return;
	}

	const logEmbed = new EmbedBuilder()
		.setAuthor(`Member Left - ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
		.setColor('RED')
		.addFields(
		{ name: '**Account**', value: `${member}`, inline: true },
		{ name: '**Created**', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
		)
		.setFooter(`ID: ${member.id}`)
		.setTimestamp();

	const logChannel = client.channels.cache.get(client.config.logging.joinLeave);
	await logChannel.send({ embeds: [logEmbed] });
	}
};
