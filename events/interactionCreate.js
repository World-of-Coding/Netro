const { CommandInteraction, Client, Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client){
        if(interaction.isChatInputCommand()){
            const command = client.commands.get(interaction.commandName);
    
            if(!command) return interaction.reply({ content: "An error occurred during the execution of this command.", ephemeral: true });
    
            command.execute(interaction, client);
        }
    }
}
