const { MessageAttachment } = require("discord.js");

const htmlgen = require("./htmlgen");

module.exports = class ModmailManager {
  constructor(client, db) {
    if (!client || !db) {
      throw new Error("Missing required parameters!");
    }
    this.client = client;
    this.db = db;
  }

  async create(guild, category, user, isTraining) {
    // Check if there is an active ticket associated with this member.
    if (this.doesExist(user.id, 'modmail') && !isTraining) {
      throw new Error("There already is a ticket associated with this member!");
    }

    if (isTraining && this.doesExist(user.id, 'training')) {
      throw new Error("There already is a training ticket associated with you!");
    }

    const channel = await guild.channels.create(`${isTraining ? 'training' : 'modmail'}-${user.id}`, {
      type: "text",
      topic: isTraining ? `Training - ${user.tag}` : user.tag,
      nsfw: false,
      parent: category
    });
    this.client.modmails.set(user.id, { channel });

    return channel;
  }

  delete(channel, userId) {
    if (!this.doesExist(userId, `modmail`) && !this.doesExist(userId, `training`)) {
      throw new Error("No tickets associated with this member!");
    }

    channel.delete();
    this.client.modmails.delete(userId);
  }

  async transcribe(channel) {
    const messages = await channel.messages.fetch();
    const modmailMessages = messages.filter(m => m.author.id == this.client.user.id && m.embeds[0]?.author)
      .map(m => m)
      .reverse();

    const transcript = new MessageAttachment(Buffer.from(htmlgen(modmailMessages), "utf-8"), `${channel.name}-transcript.html`);

    return transcript;
  }

  doesExist(id, type = 'modmail') {
    return !!(this.client.modmails.has(id)
      || this.client.guilds.cache.get(this.client.config.target.server)?.channels.cache
      	.find(c => c.name == `${type}-${id}`));
  }

};
