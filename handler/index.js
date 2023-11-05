const fs = require("fs");
const client = require("../index.js");
const ascii = require("ascii-table");

module.exports = async (){
    let commandsArray = [];
    
    const commandFolderRoot = fs.readdirSync("./commands");
    const eventFolderRoot = fs.readdirSync("./events");

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

    const eventTable = new ascii().setHeading("Events", "Working");

    for(const eventFolder of eventFolderRoot){

        const eventFiles = fs.readdirSync(`./events/${eventFolder}`).filter((file) => file.endsWith(".js"));

        for(const event of eventFiles){
            const masterEvent = require(`../events/${eventFolder}/${event}`);

            client.on(masterEvent.name, (...args) => masterEvent.execute(...args, client) );

            eventTable.addRow(event, "Yes");
        }
    }

    console.log(eventTable.toString());
}
