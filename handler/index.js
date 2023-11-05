const { glob } = require("glob");
const { promisify } = require("util");
const { Collection } = require("discord.js");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => {
        const event = require(value);
        client.on(event.name, async(...args) => await event.run(...args).catch((e) => client.emit("error", e)));
    });

    // Slash Commands
    let commandsArray = [];
    
    const commandFolderRoot = fs.readdirSync("./commands");

    for(const commandFolder of commandFolderRoot){
        const commandFiles = fs.readdirSync(`./commands/${commandFolder}`).filter((file) => file.endsWith(".js"));

        for(const commandFile of commandFiles){
            const command = require(`../commands/${commandFolder}/${commandFile}`);
            
            client.commands.set(command.data.name, command);
            commandsArray.push(command.data.toJSON());

            continue;
        }
    }

    client.application.commands.set(commandsArray);
    console.log("Loaded all commands successfully.");
};
