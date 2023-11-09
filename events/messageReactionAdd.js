const { EmbedBuilder, MessageReaction, User, Client, Events } = require('discord.js');

module.exports = {
	name: Events.MessageReactionAdd,
	/**
	 * @param {MessageReaction} reaction
	 * @param {User} user
	 * @param {Client} client
	 */
	async execute(reaction, user, client) {
		// Fetch all partials before proceeding
		if (reaction.partial) await reaction.fetch();
		if (reaction.message.partial) await reaction.message.fetch();
		if (user.partial) await user.fetch();

		if (user.bot) {
			return;
		}

		const reactionRoles = await client.db.get(`rr_${reaction.message.id}`);
		if (!reactionRoles) {
			return;
		}

		const member = reaction.message.guild.members.cache.get(user.id);
		if (!member) {
			return;
		}

		const reactionLog = new EmbedBuilder()
			.setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL({ dynamic: true })}`)
			.setDescription(`${member.user.tag} (ID ${member.id}) reacted to this [message](${reaction.message.url}) in ${reaction.message.channel} (ID ${reaction.message.channel.id})`)
			.setFooter(`WoC Reaction Roles`)
			.setTimestamp();

		const logChannel = await client.channels.fetch(client.config.logging.reactionRole);
		await logChannel.send({ embeds: [reactionLog] });

		for (const role of reactionRoles) {
			if (role.role == client.config.misc.marketVerifRole && member.roles.cache.has(client.config.misc.marketBlacklistRole)) {
				continue;
			}

			if (role.emoji.name == reaction.emoji.name) {
				await member.roles.add(role.role);
			}
		};
	}
};
