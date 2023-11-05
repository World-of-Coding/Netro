const { clean } = require('../../utils/misc.js');
const str = require('@supercharge/strings');

module.exports = {
  name: 'eval',
  format: 'eval <code>',
  description: 'Evals some code',
  aliases: [],
  permissions: [],
  myPermissions: [],
  args: true,
  async run(client, message, args) {

    if (!client.config.target.owners.includes(message.author.id)) {
      return message.channel.send("You aren't my owner, go away!");
    }
    try {
      let evaled = await eval(`(async () => { ${args.join(" ")} })()`);

      evaled = require("util").inspect(evaled, { depth: 2 });
      message.channel.send(`\`${str(clean(evaled) || "(no content)").limit(1990, '...').get()}\``);
    }
    catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
};
