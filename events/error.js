const { Client, Events } = require("discord.js");

module.exports = {
	name: Events.Error,
	/**
	 * @param {Error} error
	 * @param {Client} _client
	 */
	async execute(error, _client) {
		console.error(error);
	}
};