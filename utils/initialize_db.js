module.exports = async function(client) {
  // Modmail
  const blacklists = await client.db.get('modmail_blacklistedUsers');
  if (blacklists === null) {
    client.db.set('modmail_blacklistedUsers', []);
  }
};