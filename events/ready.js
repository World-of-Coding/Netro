const client = require('../index');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ready', 
    run: async () => {
      // prevent internals to perform actions on invalid data
      await require('../utils/initialize_db')(client);

      const bootupEmbed = new MessageEmbed()
        .setTitle("Startup complete")
        .setColor('GREEN')
        .setDescription(`Finished at ${new Date().toUTCString()}`)
        .setTimestamp();

      if (client.config.logging.botBootup.enable) {
        const logChannel = client.channels.cache.get(client.config.logging.botBootup.channel);
        logChannel.send({ embeds: [bootupEmbed] });
      };
      console.log(`${client.user.tag} is up and ready to go!`);

      // Set presence
      //
      // This only needs to be ran once on startup,
      // to avoid having multiple intervals changing presence.

      function *presenceGen() {
        let presenceList = [
          { status: "boopy cry", type: "WATCHING" },          
        ];
        let i = 0;
        while(true) {
          yield presenceList[i];

          if(i == (presenceList.length - 1)) { i = 0; }
          else { i++; }
        }
      }

      const presences = presenceGen();
      const firstActivity = presences.next().value;
      client.user.setActivity(firstActivity.status, { type: firstActivity.type });

      setInterval(() => {
        const activity = presences.next().value;
        client.user.setActivity(activity.status, { type: activity.type });
      }, 20000);
    }
};