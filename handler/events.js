const ascii = require("ascii-table");
const fs = require("fs");

function loadEvents(client) {
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
  
module.exports = { loadEvents }
  
