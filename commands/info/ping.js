module.exports = {
  name: 'ping',
  aliases: ['p'],
  description: 'Get latency between bot and the discord gateway',

  run: async (client, message) => {
    message.channel.send(`${client.ws.ping} ws ping`);
  },
};
