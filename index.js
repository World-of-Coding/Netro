const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { QuickDB } = require("quick.db");

const ModmailManager = require('./utils/modmail');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildEmojisAndStickers
  ],
  partials: [
    Partials.Channel, 
    Partials.DirectMessages, 
    Partials.Message, 
    Partials.GuildMessageReactions, 
    Partials.Reaction, 
    Partials.GuildScheduledEvent, 
    Partials.GuildMember, 
    Partials.User
  ],
});
module.exports = client;

// Shared Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.cooldowns = new Collection();
client.modmails = new Collection();
client.modmailMan = new ModmailManager(client, true);
client.config = require('./config.json');
client.db = new QuickDB();
client.thanks = client.db.table("points");
client.topicCooldown = new Collection();
client.topicCooldownSec = 900;

// Initializing the project
const { loadCommands } = require("./handler/index");
const { loadEvents } = require("./handler/events");

client.setMaxListeners(15);

client
.login(client.config.token)
.then(() => {
  loadCommands(client);
  loadEvents(client);
})
.catch((error) => console.log(error));


process.on("uncaughtException", (err, origin) => {
    console.error(`Caught exception ${err} at ${origin}`);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error(`Promise ${promise} was rejected because ${reason}`);
});
