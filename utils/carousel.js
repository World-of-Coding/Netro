module.exports = class CarouselEmbed {
  constructor(embeds, msg) {
    this.embeds = embeds;
    this.msg = msg;
  }
  async startCarousel() {
    let msg = this.msg;
    let page = 0;
    let message = await msg.channel.send({ embeds: [this.embeds[page]] });

    await message.react('◀️').catch((e) => { console.warn(e.message); });
    await message.react('▶️').catch((e) => { console.warn(e.message); });
    await message.react('🗑').catch((e) => { console.warn(e.message); });

    const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id == msg.author.id;
    const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id == msg.author.id;
    const destroyFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id == msg.author.id;

    const backwards = message.createReactionCollector({ filter: backwardsFilter, time: 120000 });
    backwards.on('collect', async (r) => {
		 	await r.users.remove(msg.author);
		 	page = page == 0 ? 0 : page - 1;
		 	await message.edit({ embeds: [this.embeds[page]] });
    });

    const forwards = message.createReactionCollector({ filter: forwardsFilter, time: 120000 });
    forwards.on('collect', async (r) => {
      await r.users.remove(msg.author);
	     	page = page == (this.embeds.length - 1) ? this.embeds.length - 1 : page + 1;
      await message.edit({ embeds: [this.embeds[page]] });
	    });

    const destroy = message.createReactionCollector({ filter: destroyFilter, time: 120000 });
    destroy.once('collect', () => {
      message.reactions.removeAll().catch((e) => { console.warn(e.message); });
      backwards.stop();
      forwards.stop();
    });
    destroy.once('end', () => {
      message.reactions.removeAll().catch((e) => { console.warn(e.message); });
    });
  }
};
