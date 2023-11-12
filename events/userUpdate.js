const { EmbedBuilder, User, Client, Events } = require('discord.js');

module.exports = {
	name: Events.UserUpdate,
	/**
	 * @param {User} oldUser
	 * @param {User} newUser
	 * @param {Client} client
	 */
	async execute(oldUser, newUser, client) {
		let shouldLog = false;

		const updateEmbed = new EmbedBuilder()
			.setAuthor(newUser.tag, newUser.displayAvatarURL())
			.setColor('GREEN')
			.setFooter(`ID: ${newUser.id}`)
			.setTimestamp();

		if (oldUser.username != newUser.username) {
			updateEmbed.setTitle('Username Updated')
				.setDescription(`${oldUser.username} **=>** ${newUser.username}`);

			shouldLog = true;
		}

		if (oldUser.defaultAvatarURL != newUser.defaultAvatarURL) {
			updateEmbed.setTitle("Avatar Updated")
				.setDescription(`[[Before]](${oldUser.defaultAvatarURL}) **=>** [[After]](${newUser.defaultAvatarURL})`);

			shouldLog = true;
		}

		if (shouldLog) {
			const logChannel = client.channels.cache.get(client.config.logging.userUpdate);
			await logChannel.send({ embeds: [updateEmbed] });
		}
	}
};
