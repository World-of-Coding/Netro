const { MessageEmbed } = require("discord.js");

const mmConfig = require("../../config.json").modmail;
module.exports = {
  name: "reply",
  aliases: ['r'],
  flags: true,
  permissions: ["MANAGE_MESSAGES"],
  description: 'Reply to a modmail ticket',

  run: async (client, message, args, flags) => {
    const replyContent = args.join(" ");
    // TODO: improve flag handler so we can remove this

    if (message.channel.parentId != mmConfig.category && message.channel.parentId != mmConfig.training?.category) {
      return message.channel.send("This command must be used in a modmail channel!");
    }

    if (!args[0] && !message.attachments.first()) {
      return message.channel.send("You need to include a message to send!");
    }
     
    if (replyContent.length > 1024 && !message.attachments.first())
        return message.channel.send("Your message content must be less than or equal to 1024 characters");

    const memberId = message.channel.name.split("-")[1];
    const member = await message.guild.members.fetch(memberId).catch(()=>{});
    if (!member) {
      return message.channel.send("Failed to find the user to reply to!");
    }

    message.delete();

    const firstFlag = flags[0] ? flags[0][1] : false;
    const isAnonymous = firstFlag === "-a" || firstFlag === "--anonymous";

    const embedName = isAnonymous ? (message.member.permissions.has('ADMINISTRATOR') ? "Administrator Team" : "Moderation Team") : message.author.tag;
    const embedProfile = isAnonymous ? mmConfig.anonymousProfile : message.author.avatarURL({ dynamic: true });

    const sizeLimitFilter = (file) => file.size > 8_000_000;
    if (message.attachments.some(sizeLimitFilter)) return message.channel.send("Cannot send; file exceeds maximum size of 8MB!");

    const userReply = new MessageEmbed()
      .setAuthor(embedName, embedProfile)
      .setDescription(replyContent)
      .setTimestamp()
      .setColor("BLUE");
    member.send({ embeds: [userReply], files: [...message.attachments.values()] });

    const staffReply = new MessageEmbed()
      .setAuthor(embedName, embedProfile)
      .setDescription("Message sent")
      .addField("Message", replyContent)
      .setTimestamp()
      .setColor("BLUE");

    if (isAnonymous) {
      staffReply.setFooter(message.author.tag);
    }
    message.channel.send({ embeds: [staffReply], files: [...message.attachments.values()] });
  }
};
