const topics = require('../../assets/topics.json');

module.exports = {
  name: 'topic',
  aliases: ['question'],
  description: 'Get a random topic',

  run: async (_client, message) => {
    message.channel.send(topics[Math.floor(Math.random() * topics.length)]);
  },
};
