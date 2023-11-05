module.exports = {
  name: 'blacklist',
  description: 'Blacklists/unblacklists someone from using the modmail system',
  args: true,
  format: 'blacklist <user>',
  aliases: ['unblacklist'],
  permissions: ['MANAGE_MESSAGES'],
  myPermissions: [],
  async run(client, message, args) {

    const command = message.content.slice(client.config.prefix.length).trim().split(" ")[0];
    console.log(command);
    const blackListed = await client.db.get('modmail_blacklistedUsers');

    const member = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase() == args[0]?.toLowerCase())  || message.guild.members.fetch(args[0]).catch(()=>{});
    if(!member) return message.channel.send("Could not find the user!");
    if(!member.user) return message.channel.send("Could not find the user!");
    if(member.user.bot || member.bot) return message.channel.send("You cannot blacklist bots!");

    if(command.toLowerCase() == 'blacklist') {

      if(blackListed.indexOf(member.user.id) != -1) return message.channel.send("That user is already blacklisted!");

      blackListed.push(member.user.id);
      message.channel.send(`**${member.user.tag}** has been blacklisted!`);
    }
    else {

      if(blackListed.indexOf(member.user.id) == -1) return message.channel.send("That user is not blacklisted!");

      blackListed.splice(blackListed.indexOf(member.user.id), 1);
      message.channel.send(`**${member.user.tag}** has been unblacklisted!`);
    }
    client.db.set('modmail_blacklistedUsers', blackListed);
  }
};