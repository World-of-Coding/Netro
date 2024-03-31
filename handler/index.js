const discord = require("discord.js");
const ascii = require("ascii-table");
const fs = require("fs");

/**
 * 
 * @param {discord.Client} client 
 */
function loadCommands(client) {
  const table = new ascii().setHeading("Commands", "Working");
  
  let commandsArray = [];

  const commandsFolder = fs.readdirSync("./commands");
  for(const folder of commandsFolder) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`);

    for(const file of commandFiles) {
      console.log(file)
      const commandFile = require(`../commands/${folder}/${file}`);

      client.commands.set(commandFile.data.name, commandFile);
      table.addRow(file, "yes");
    }
  }

  client.application.commands.set(commandsArray);
  return console.log(table.toString());
}

module.exports = {loadCommands}