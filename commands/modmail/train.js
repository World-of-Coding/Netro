const { MessageEmbed } = require('discord.js');

const mmConfig = require('../../config.json').modmail;

module.exports = {
  name: 'train',
  description: 'Create a training ticket',

  run: async (client, message, _args) => {
    if (!mmConfig.training?.role || !mmConfig.training?.category) {
      return message.channel.send('Failed to create training session: client is not configured.');
    }
	await message.member?.fetch().catch(()=>{});
    await message.guild?.roles.fetch(mmConfig.training.role).catch(()=>{});
    if (!message.member?.roles.cache.has(mmConfig.training.role) && !message.member.permissions.has('ADMINISTRATOR')) {
      return message.channel.send("You don't have enough permission to create a training session!");
    }

    try {
      const trainingChannel = await client.modmailMan.create(message.guild, mmConfig.training.category, message.author, true);
      const newThreadEmbed = new MessageEmbed()
        .setTitle("New Training thread")
        .setColor("YELLOW")
        .setDescription(`${message.author}\n${message.author.id}`)
        .setFooter("have fun")
        .setTimestamp();
      trainingChannel.send({ embeds: [newThreadEmbed] });
      message.channel.send(`Success, created a new training channel at <#${trainingChannel.id}>`);
    }
    catch (e) {
      message.channel.send(`An error occured while creating a training thread: ${e.message}.`);
    }
  },
};
