const { Message, Client } = require("discord.js");
const Discord = require("discord.js");
const config = require("../config.json");
/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */
async function automod(client, message){
    if(message.content.includes("@everyone")) message.delete();
    if(message.content.includes("@here")) message.delete();
}

module.exports = automod;