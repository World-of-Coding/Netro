const Discord = require('discord.js');
const client = require("../../index.js");
const { EmbedBuilder, Message, Client, Events } = require('discord.js');

const target = client.config.target;
const mmConfig = client.config.modmail;

module.exports = {
    name: Events.MessageCreate,
    /**
    * @param {Message} message
    * @param {Client} client
    */
    async execute(message, client) {
        if (message.author.bot) return;
        if (message.channel.type !== Discord.ChannelType.DM) return;
    
        const blackListedUsers = await client.db.get("modmail_blacklistedUsers");
        const targetGuild = client.guilds.cache.get(target.server);
    
    
        if (!targetGuild) return message.channel.send("The target server is not available.");
        if(!targetGuild.members.cache.get(message.author.id)) return message.channel.send("You are not a member of the target server.");
        
        if (blackListedUsers.includes(message.author.id)) return message.channel.send("You are blacklisted from using modmail.");
        
        if (client.modmailMan.doesExist(message.author.id, `modmail`) || client.modmailMan.doesExist(message.author.id, `training`)) {
    
            const modmailChannel = client.modmails.get(message.author.id)?.channel || client.guilds.cache.get(target.server)?.channels.cache.find(c => c.name == `modmail-${message.author.id}` || c.name == `training-${message.author.id}`);
    
            const embed = new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setDescription(message.content || "No content.")
            .setColor("Green")
            .setTimestamp();
    
            const sizeLimitFilter = (file) => file.size > 8_000_000;
            if (message.attachments.some(sizeLimitFilter)) return message.channel.send("Cannot send; file exceeds maximum size of 8MB!");
    
            modmailChannel.send({ embeds: [embed], files: [...message.attachments.values()] });
            message.channel.send({ embeds: [embed.setTitle("Sent!")] });
            
        } else {
            if (blackListedUsers.includes(message.author.id)) return message.channel.send("You are blacklisted from using modmail.");
    
            const guild = client.guilds.cache.get(target.server);
            if (!guild) {
                const errorEmbed = new EmbedBuilder()
                .setDescription("Failed to find the guild, please contact the developer/owner about this!")
                .setColor("Red")
                .setTimestamp();
    
            message.channel.send({ embeds: [errorEmbed] });
            return;
          }
          
          const category = guild.channels.cache.get(mmConfig.category);
          if (!category || category.type === "CATEGORY") {
            const errorEmbed = new EmbedBuilder()
              .setDescription("Failed to find the category, please contact the developer/owner about this!")
              .setColor("Red")
              .setTimestamp();
    
            message.channel.send({ embeds: [errorEmbed] });
            return;
          }
          
          const modmailChannel = await client.modmailMan.create(guild, category, message.author, false).catch(e => { message.channel.send(e.message); });
    
          const newThreadEmbed = new EmbedBuilder()
            .setTitle("New thread")
            .setColor("Blue")
            .setDescription(`${message.author}\n${message.author.id}`)
            .setFooter({ text: "Please wait patiently as we get to you as soon as we can!"})
            .setTimestamp();
          modmailChannel.send({ content: mmConfig.customMessage, embeds: [newThreadEmbed] });
          
          const firstMessageEmbed = new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
            .setDescription(message.content)
            .setColor("Green")
            .setTimestamp();
          modmailChannel.send({ embeds: [firstMessageEmbed], files: [...message.attachments.values()] });
          
          const newNotifyEmbed = new EmbedBuilder()
            .setTitle("Created a new thread!")
            .setDescription("Please wait patiently as we get to you as soon as we can!")
            .setColor("Green")
            .setTimestamp();
          message.channel.send({ embeds: [newNotifyEmbed] });
          
          const newLogEmbed = new EmbedBuilder()
            .setTitle("New thread")
            .setAuthor({name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
            .setDescription(`${message.author.tag} has created a new thread\n<#${modmailChannel.id}>`)
            .setColor("Blue")
            .setTimestamp();
          modmailChannel.guild.channels.cache.get(client.config.logging.modmail).send({ embeds: [newLogEmbed] });
        }
  }
};
