const { Client, Collection, Intents } = require('discord.js');

const ModmailManager = require('./utils/modmail');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ['CHANNEL', 'REACTION', 'GUILD_SCHEDULED_EVENT', 'GUILD_MEMBER', 'USER', 'MESSAGE'],
});
module.exports = client;

// Shared Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.cooldowns = new Collection();
client.modmails = new Collection();
client.modmailMan = new ModmailManager(client, true);
client.config = require('./config.json');
client.db = require('quick.db');

// Initializing the project
require('./handler')(client);
require('./dummyWeb')();

client.login(client.config.token);

process.on("uncaughtException", (err, origin) => {
    console.error(`Caught exception ${err} at ${origin}`);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error(`Promise ${promise} was rejected because ${reason}`);
});
