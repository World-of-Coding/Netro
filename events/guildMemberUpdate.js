const { EmbedBuilder } = require('discord.js');
const client = require("../index");

function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const verificationRole = client.config.greeter.verificationRole;
  const mutedRole = client.config.greeter.mutedRole;

  if (!oldMember.roles.cache.has(verificationRole) && newMember.roles.cache.has(verificationRole)) {
      if (newMember.roles.cache.has(mutedRole)) {
         newMember.roles.remove(verificationRole);
         return;
      }
      
      if (oldMember.roles.cache.has(mutedRole) && !newMember.roles.cache.has(mutedRole)){
          sleep(1000).then(() => {
            if (!newMember.roles.cache.has(verificationRole)){
              newMember.roles.add(verificationRole);
              return;
            }
          });
          return;
      }

    const messages = client.config.greeter.messages;
    const message = messages[Math.floor(Math.random() * messages.length)].replaceAll("{newMember}", `${newMember}`);
	const roleIDs = ["748746305001488394", "748937403514880051", "748746300115255337", "748745799030276246", "932094650259480576", "812328419978117191", "800059882157768764", "932116178321682512", "932117227258396684", "748746303051137074"]
    const greetChannel = client.channels.cache.get(client.config.greeter.greetChannel);
      roleIDs.forEach(async (roleID) => {
          let role1 = newMember.guild.roles.cache.find(role => role.id === roleID);
          await newMember.roles.add(role1);
      });
    greetChannel.send(message);
  }

  const embed = new EmbedBuilder()
    .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL({ dynamic: true }))
    .setFooter(`ID: ${newMember.id}`)
    .setTimestamp();

    if (oldMember.displayName != newMember.displayName) {
        const executor = (oldMember.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE', limit: 3 })).entries.find(e => {
            return e.changes.findIndex(c => { return c.key === 'nick' && c.old == oldMember.nickname && c.new == newMember.nickname; }) != -1;
        })?.executor || { tag: "Unknown#0000", id: "0" };
        embed.setTitle('Nickname Updated')
            .setColor('GREEN')
            .setDescription(`${oldMember.displayName} **=>** ${newMember.displayName}`)
            .addField('Updated By', `${executor.tag} (${executor.id})`);
    }

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    const oldRoles = [...oldMember.roles.cache.keys()];
    const newRoles = [...newMember.roles.cache.keys()];

    const roles = oldRoles.filter(r => !newRoles.includes(r));
    const formattedRoles = roles.map(roleId => '<@&' + roleId + '>').join(", ");
    embed
      .setTitle('Role Removed')
      .setColor('RED')
      .setDescription(`${newMember} had ${formattedRoles} removed.`);
  }
  else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    const oldRoles = [...oldMember.roles.cache.keys()];
    const newRoles = [...newMember.roles.cache.keys()];

    const roles = newRoles.filter(r => !oldRoles.includes(r));
    const formattedRoles = roles.map(roleId => '<@&' + roleId + '>').join(', ');
    embed
      .setTitle('Role Added')
      .setColor('GREEN')
      .setDescription(`${newMember} was given ${formattedRoles}.`);
  }

  const logChannel = client.channels.cache.get(client.config.logging.roleUpdate);
  logChannel.send({ embeds: [embed] });
});
