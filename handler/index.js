const { glob } = require("glob");
const { promisify } = require("util");
const { Collection } = require("discord.js");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
            client.cooldowns.set(file.name, new Collection());
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => {
        const event = require(value);
        client.on(event.name, async(...args) => await event.run(...args).catch((e) => client.emit("error", e)));
    });

    // Slash Commands
    const slashCommands = await globPromise(
      `${process.cwd()}/SlashCommands/*/*.js`
    );

    const slashCommandsArray = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        slashCommandsArray.push(file);
    });
    client.once("ready", async () => {
      await client.guilds.cache
        .get("727166807240212501")
        .commands.set(slashCommandsArray);

    // await client.application.commands.set(arrayOfSlashCommands);
    });
};