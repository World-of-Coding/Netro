const { EmbedBuilder, VoiceState, Client, Events } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,
	/**
	 * @param {VoiceState} oldState
	 * @param {VoiceState} newState
	 * @param {Client} client
	 */
	async execute(oldState, newState, client) {
		if (oldState.channel != newState.channel) {
			const vcUpdateEmbed = new EmbedBuilder()
				.setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`${newState.member} ${oldState.channel ? 'left' : 'joined'} ${oldState.channel ? oldState.channel : newState.channel}`)
				.setColor(`${oldState.channel ? 'RED' : 'GREEN'}`)
				.setFooter(`ID: ${newState.member.id}`)
				.setTimestamp();

			const logChannel = client.channels.cache.get(client.config.vcUpdate);
			await logChannel.send({ embeds: [vcUpdateEmbed] });
		}
	}
};

