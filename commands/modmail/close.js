const { MessageEmbed } = require('discord.js');

const mmConfig = require('../../config.json').modmail;

module.exports = {
  name: 'close',
  aliases: ['c'],
  flags: true,
  permissions: ['MANAGE_MESSAGES'],
  description: 'Close a modmail ticket',

  run: async (client, message, args, flags) => {
    if (message.channel.parentId != mmConfig.category && message.channel.parentId != mmConfig.training?.category) {
      return message.channel.send('This command must be used in a modmail channel!');
    }

    const firstFlag = flags[0] ? flags[0][1] : false;
    const isAnonymous = firstFlag === '-a' || firstFlag === '--anonymous';

    const embedName = isAnonymous ? 'Moderation Team' : message.author.tag;
    const embedProfile = isAnonymous ? mmConfig.anonymousProfile : message.author.avatarURL({ dynamic: true });

    const memberId = message.channel.name.split('-')[1];
    const member = message.guild.members.cache.get(memberId);

    try {
      client.modmailMan.delete(message.channel, memberId);
    }
    catch (e) {
      message.channel.send(e.message);
      return;
    }

    const modmailLog = client.channels.cache.get(client.config.logging.modmail);
    const transcript = await client.modmailMan.transcribe(message.channel);
    const logEmbed = new MessageEmbed()
      .setAuthor(embedName, embedProfile)
      .setColor('RED')
      .setTitle('Thread closed')
      .setDescription(`${embedName} has closed ${message.channel.topic}'s ticket`);

    if (isAnonymous) {
      logEmbed.setFooter(message.author.tag);
    }
    modmailLog.send({ embeds: [logEmbed], files: [transcript] });


    if (member) {
      const userClosedEmbed = new MessageEmbed()
        .setAuthor(embedName, embedProfile)
        .setColor('RED')
        .setTitle('Thread closed')
        .setDescription('Your ticket has been closed\n\n**Thank you for contacting the World of Coding staff team!**\n\nReplying to this message will create a new thread. Have a good day!');
      member.send({ embeds: [userClosedEmbed] });
    }
  },
};
