const { EmbedBuilder } = require('discord.js');

const { emojiCount } = require('../utils/parsing.js');
const { EMOJI_REGEX } = require('../utils/regexes.js');
const { isValidColor } = require('../utils/misc.js');
module.exports = {
  name: 'reactionrole',
  aliases: ['rr'],
  permissions: ['ADMINISTRATOR'],
  description: 'Create a reaction role menu',

  run: async (client, message, args) => {
    if (!Array.isArray(args) || args.length !== 2) {
      return message.channel.send('Expected 2 arguments!');
    }

    const reactionRoles = [];
    const addReactionRole = (role, emoji) => {
      if (!role) {
        throw new Error('You need to include a role!');
      }

      const discordEmojiMatch = emoji.match(EMOJI_REGEX);
      const isUnicodeEmoji = (emojiCount(emoji) >= 1);
      const isDiscordEmoji = (discordEmojiMatch !== null);

      if (!isDiscordEmoji && !isUnicodeEmoji) {
        throw new Error('You need to include an valid emoji for this role!');
      }

      let emojiName = emoji, emojiId = emoji;

      if (isDiscordEmoji) {
        emojiName = emojiName.split(":")[1];
        emojiId = emojiId.split(":")[2].split(">")[0];
      }

      if (emojiId != emojiName) {
        if (!client.emojis.cache.has(emojiId)) {
          return message.channel.send("You need to use an emoji from a server I am in!");
        }
      }

      reactionRoles.push({
        role: role.id,
        emoji: { id: emojiId, name: emojiName }
      });
    };

    const role = message.guild.roles.cache.get(args[0])
          || message.guild.roles.cache.find(r => r.name.toLowerCase() == args[0].toLowerCase());
    const emoji = args[1];
    try {
      addReactionRole(role, emoji);
    }
    catch(e) {
      return message.channel.send(e.message);
    }

    message.channel.send('If you want to add more reaction roles, send them now with `(role) (emoji), (role) (emoji)` format. If you don\'t want to add more, type "none" into chat.');

    const filter = m => m.author.id === message.author.id;

    // TODO: filter invalid inputs

    let moreOptions;
    const awaitMore = await message.channel.awaitMessages({ filter, max: 1, time: 60_000, errors: ['time'] })
      .catch(() => {
        message.channel.send("You need to enter something!");
        return;
      });

    try {
      moreOptions = awaitMore.first();
    }
    catch {
      return;
    }

    // If the user have provided other reaction role entry
    if (moreOptions.content.toLowerCase() !== 'none') {
      for (const reactionRole of moreOptions.content.split(", ")) {
        const reactionArgs = reactionRole.split(" ");
        // check if the emoji bit exists
        if (!reactionArgs[1]) {
          message.channel.send("You need to include a role and emoji! Try again!");
          return;
        }

        const moreRole = message.guild.roles.cache.get(reactionArgs[0])
              || message.guild.roles.cache.find(r => r.name.toLowerCase() == reactionArgs[0].toLowerCase());
        const moreEmoji = reactionArgs[1];

        try {
          addReactionRole(moreRole, moreEmoji);
        }
        catch(e) {
          return message.channel.send(e.message);
        }
      }
    }

    message.channel.send('What channel do you want the reaction role to be in?');

    let flag = false;
    let reactionChannel;

    do {
      flag = false;
      let awaitChannel = await message.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ['time'] }).catch(() => {
        message.channel.send('You need to enter something. Try again!');
        flag = true;
      });
      if (!flag) {
        reactionChannel = awaitChannel.first().mentions.channels?.first();
        if (!reactionChannel) {
          message.channel.send(`No channel detected. Try again.`);
          flag = true;
        }
        else {
          flag = false;
        }
      }
    } while (flag);

    message.channel.send('What do you want the embed title to be?');

    let embedTitle;
    do {
      flag = false;
      let awaitTitle = await message.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ['time'] }).catch(() => {
        message.channel.send('You need to enter something. Try again!');
        flag = true;
      });
      if (!flag) {
        embedTitle = awaitTitle.first().content;
      }
    } while (flag);

    message.channel.send('What do you want the embed description to be?');

    let embedDescription;
    do {
      flag = false;
      let awaitDescription = await message.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ['time'] }).catch(() => {
        message.channel.send('You need to enter something. Try again!');
        flag = true;
      });
      if (!flag) {
        embedDescription = awaitDescription.first().content;
      }
    } while (flag);

    message.channel.send('What do you want the embed color to be? (ColorResolvable)');

    let embedColor;
    do {
      flag = false;
      let awaitColor = await message.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ['time'] }).catch(() => {
        message.channel.send('You need to enter something. Try again!');
        flag = true;
      });
      if (!flag) {
        embedColor = awaitColor.first().content;
        if (!isValidColor(embedColor)) {
          message.channel.send(`\`${embedColor}\` is not a resolvable color. Try again.`);
          flag = true;
        }
        else {
          flag = false;
        }
      }
    } while (flag);


    const reactionEmbed = new EmbedBuilder()
      .setTitle(embedTitle)
      .setDescription(embedDescription)
      .setColor(embedColor)
      .setFooter('WoC Reaction Roles');

    if (reactionRoles.length > 20) return message.channel.send("Failsafe: maximum count of reaction role entry is 20.");

    const reactionMessage = await reactionChannel.send({ embeds: [reactionEmbed] });

    reactionRoles.forEach((reactionRole) => {
      reactionMessage.react(reactionRole.emoji.id);
    });

    client.db.set(`rr_${reactionMessage.id}`, reactionRoles);
    message.channel.send(`Alright, set up the reaction role in ${reactionChannel}.`);
  }
};
