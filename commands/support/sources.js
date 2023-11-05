const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'sources',
  aliases: ['srcs'],
  description: 'Prints sources to learn how to code. this will be deprecated in v2.1.',

  run: async (client, message) => {
    const srcEmbed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("Learn how to code")
      .setDescription("I'd recommend a good service to learn how to code. There are many such as `SoloLearn, FreeCodeCamp, CodeAcademy, KhanAcademy, etc`\nBest way to get a basic understanding.\n\nTo learn specific things and improve your knowledge, you can use Google and YouTube to learn more in-depth concepts. Such as learning frameworks, web development, machine learning, etc.\n\n**__If you want to learn Discord API__**\nYou can use resources like the [Official Discord.js Guide](https://discordjs.guide/) and check out [their documentation](https://discord.js.org/) to learn more. There are other libraries to communicate with the Discord API, but Discord.js is the largest of them all.\n\nThis should help you :)")
      .setTimestamp()
      .setFooter(`Requested by: ${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({ dynamic: false }));

    message.channel.send({ embeds: [srcEmbed] });
  },
};
