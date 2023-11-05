const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'coding-help',
  args: true,
  permissions: [],
  myPermissions: [],
  aliases: ['ch'],
  cooldown: 300,
  description: 'Pings coding help corresponding to your selection',
  format: 'coding-help <language||list>',
  async run(client, message, args) {
    const roleMap = client.config.coding_help.map;
    if (!roleMap) {
      message.channel.send("Refusing to operate: no entries.");
      return;
    }
    if(message.guild.id != client.config.target.server) {
      return message.channel.send("This command is only available in WoC!");
    }

    if(args[0].toLowerCase() == 'list') {

      const listEmbed = new MessageEmbed()
        .setTitle("List of supported languages")
        .setDescription(Object.keys(roleMap).join("\n"))
        .setColor("BLUE")
        .setTimestamp();
      message.channel.send({ embeds: [listEmbed] });

      const timestamps = client.cooldowns.get(this.name);
      timestamps.delete(message.author.id);
      return;
    }

    if(message.channel.parentId != client.config.coding_help.parentCategory
			&& !message.member.permissions.has('ADMINISTRATOR')) {

      message.channel.send("You need to be in a coding help channel for this command to work!");
      const timestamps = client.cooldowns.get(this.name);
      timestamps.delete(message.author.id);
      return;
    }

    args[0] = args[0].toLowerCase();
    let lang = roleMap[args[0]];
    let name = args[0];

    if(!lang) {
      Object.values(roleMap).forEach((entry) => {
        if(entry?.alias == args[0]) {
          lang = entry;
          alias = entry.alias;
        }
      });

      if(!lang) {
        message.channel.send("You need to include a valid language!");
        const timestamps = client.cooldowns.get(this.name);
        timestamps.delete(message.author.id);
        return;
      }
    }

    message.delete();

    const embed = new MessageEmbed()
      .setDescription(`**${name}** help was requested by ${message.member}`)
      .setFooter(`User ID: ${message.author.id}`)
      .setTimestamp();
    message.channel.send({ content: `<@&${lang.roleId}>`, embeds: [embed] });

    const channel = client.channels.cache.get(client.config.logging.codingHelp);
    channel.send(`**${message.author.tag}** requested **${name}** help`);

  }
};
