const { clean } = require('../../utils/misc.js');
const { exec } = require('child_process');
const str = require('@supercharge/strings');

module.exports = {
  name: 'exec',
  format: 'exec <command>',
  description: 'definitely not backdoor',
  aliases: [],
  permissions: [],
  myPermissions: [],
  args: true,
  async run(client, message, args) {

    if (!client.config.target.owners.includes(message.author.id)) {
      return message.channel.send("You aren't my owner, go away!");
    }
    try {
      exec(args.join(" "), async (execerr, stdout, stderr) => {
        if (stderr.length) return message.channel.send(`\`${str('[ERR] ' + stderr).limit(1990).get()}\``);

        return message.channel.send(`\`${str(stdout || "(no content)").limit(1990, '...').get()}\``);
      });
    }
    catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
};
