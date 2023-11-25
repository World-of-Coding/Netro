function loadEvents(client) {
    const ascii = require("ascii-table");
    const fs = require("fs");
    const table = new ascii().setHeading("Events", "Working");
  
    const folder = fs.readdirSync("./Events")
      const files = fs
        .readdirSync(`./Events/${folder}`)
        .filter((file) => file.endsWith(".js"));
  
      for (const file of files) {
        const event = require(`../Events/${file}`);
  
        if (event.rest) {
          if (event.once)
            client.rest.once(event.name, (...args) =>
              event.execute(...args, client)
            );
            else 
              client.rest.on(event.name, (...args) =>
              event.execute(...args, client)
              ); 
              
        } else {
          if(event.once) 
          client.once(event.name, (...args) =>
          event.execute(...args, client));
          else client.on(event.name, (...args) =>
          event.execute(...args, client));
        }
        table.addRow(file, "yes")
        continue;
      }
    return console.log(table.toString(), "\nLoaded Events   ")
}
  
module.exports = { loadEvents }
  
