const { MessageEmbed } = require('discord.js');
const os = require('os');
const cpuStat = require('cpu-stat');

const { formatBytes, parseDur } = require('../../utils/misc');

module.exports = {
  name: 'botinfo',
  aliases: [],
  permissions: [],
  myPermissions: [],
  args: false,
  format: 'botinfo',
  cooldown: 5,
  description: 'Gets information about the bot',
  async run(client, message) {

    cpuStat.usagePercent(function(error, percent) {
      if (error) { return console.error(error); }

      const cores = os.cpus().length;
      const cpuModel = os.cpus()[0].model;

      const guild = client.guilds.cache.size;
      const user = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
      const channel = client.guilds.cache.reduce((acc, g) => acc + g.channels.cache.size, 0);

      const usage = formatBytes(process.memoryUsage().heapUsed);
      const Node = process.version;
      const CPU = percent.toFixed(2);

      const embed = new MessageEmbed()
        .addField('Bot Statistics:', `Servers: **${guild}** \nUser: **${user}** \nChannel: **${channel}** \nStorage use: **${usage}** \nNode version: **${Node}** \nCPU Usage: **${CPU}%**`)
        .addField('Physical Statistics:', `CPU: **${cores}** - **${cpuModel}** \nUptime: **${parseDur(client.uptime)}**`)
        .setColor("RED");
      message.channel.send({ embeds: [embed] });
    });
  }
};
