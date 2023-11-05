module.exports = {
  async awaitMessages(filter, channel) {
    return await channel.awaitMessages({ filter, max: 1, time: 60_000, errors: ['time'] })
      .catch(() => {
        channel.send("Timed out! Operation aborted.");
        return;
      });
  },

  isValidColor(str) {
    const resolvableStrings = ['default', 'white', 'aqua', 'green', 'blue',
      'yellow', 'purple', 'luminous_vivid_pink', 'fuchsia', 'gold',
      'orange', 'red', 'grey', 'navy', 'dark_aqua',
      'dark_green', 'dark_blue', 'dark_purple', 'dark_vivid_pink', 'dark_gold',
      'dark_orange', 'dark_red', 'dark_grey', 'darker_grey', 'light_grey',
      'dark_navy', 'blurple', 'greyple', 'dark_but_not_black', 'not_quite_black',
      'random'];
    return /^[#0-9a-fA-F]+$/.test(str) || resolvableStrings.includes(str.toLowerCase());
  },


  formatBytes(a, b) {
    if (0 == a) return "0 Bytes";
    let c = 1024,
      d = b || 2,
      e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      f = Math.floor(Math.log(a) / Math.log(c));

    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
  },

  parseDur(ms) {
    let seconds = ms / 1000;

    let days = parseInt(seconds / 86400);
    seconds = seconds % 86400;

    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;

    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);

    if (days) {
      return `${days} day, ${hours} hours, ${minutes} minutes`;
    }
    else if (hours) {
      return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    }
    else if (minutes) {
      return `${minutes} minutes, ${seconds} seconds`;
    }
    return `${seconds} second(s)`;
  },

  clean(text) {
    if (typeof (text) === "string") {
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    }
    else { return text; }
  }
};
