const { EmbedBuilder, Message, Client, Events } = require('discord.js');
const str = require('@supercharge/strings');

module.exports = {
	name: Events.MessageUpdate,
	/**
	 * @param {Message} oldMessage
	 * @param {Message} newMessage
	 * @param {Client} client
	 */
	async execute(oldMessage, newMessage, client) {
		if (!newMessage.guild || newMessage.guildId != client.config.target.server) {
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
			const contentChangeEmbed = new EmbedBuilder()
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
			await logChannel.send({ embeds: [contentChangeEmbed] });
		}
	}
};