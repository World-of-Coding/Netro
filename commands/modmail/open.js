const { SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits } = require("discord.js");

const mmConfig = client.config.modmail;

module.exports = {
    data: new SlashCommandBuilder()
            .setName('open')
            .setDescription('Opens a new modmail with a user.')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
            .addUserOption(option =>
                option
                    .setName('User')
                    .setDescription('User to open a modmail with.')
                    .setRequired(true))
            .addStringOption(option =>
                option
                    .setName('Message')
                    .setDescription('Initial message to send to the user.')
                    .setMinLength(1)
                    .setMaxLength(1024)
                    .setRequired(true)),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('User');
        const message = interaction.options.getString('Message');
        const category = guild.channels.cache.get(mmConfig.category);
        
        // Create the modmail channel and send the initial thread notification.
        const modmailChannel = await client.modmailMan.create(interaction.guild, category, interaction.user).catch(async e => { await interaction.reply({ content: e.message, ephemeral: true }); });
        const newThreadEmbed = new MessageEmbed()
            .setTitle("New thread")
            .setColor("BLUE")
            .setDescription(`${user}\n${user.id}`)
            .setFooter("Have fun!")
            .setTimestamp();

        await modmailChannel.send({ content: mmConfig.customMessage, embeds: [newThreadEmbed] });

        // Send the member a DM notifying them that staff has opened a modmail on their behalf and the initial message.
        const newNotifyEmbed = new MessageEmbed()
            .setTitle("A new thread has been started by a staff member!")
            .setDescription("Please reply as soon as possible!")
            .setColor("GREEN")
            .setTimestamp();
        
        const firstMessageEmbed = new MessageEmbed()
            .setAuthor(interaction.user.tag, interaction.user.avatarURL({ dynamic: true }))
            .setDescription(message)
            .setColor("GREEN")
            .setTimestamp();

        await user.dmChannel.send({ embeds: [newNotifyEmbed, firstMessageEmbed] });

        // Notify the staff member that it has been opened and sent successfully.
        await interaction.reply({ content: `Your new ticket has been opened: <#${modmailChannel.id}>`, ephemeral: true });
    }
}