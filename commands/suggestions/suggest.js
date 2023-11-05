module.exports = {
  name: 'suggest',
  flags: true,
  description: 'Send a suggestion to the suggestions channel.',

  run: async (client, message, args) => {
    const text = args.join(" ");
    const suggestionChannel = client.config.misc.suggestionChannel;

    if (!suggestionChannel) return message.reply({ embeds:[{ color:"RED", description:`The suggestions channel has not been set!` }] });
    if (!text) return message.reply({ embeds:[{ color:"RED", description:`You must include a suggestion to send!` }] });
    let msg = await client.channels.cache.get(suggestionChannel).send({ embeds:[{ color:"GREEN", author: { name: message.author.tag, icon_url: message.author.displayAvatarURL({ dynamic: false }) }, description: text, footer: { text: message.guild.name, icon_url: message.guild.iconURL({ dynamic: false }) } }] });
    msg.react("<:TickYes:832708609472987166>");
    msg.react("<:TickNeutral:832708618779885619>");
    msg.react("<:TickNo:832708631857463370>");
    message.delete();
    message.channel.send({ content: `<@${message.author.id}>`, embeds:[{ color:"GREEN", description:`Sent your suggestion! <#${suggestionChannel}>!` }] });
  },
};
