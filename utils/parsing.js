const graphemeSplit = require('graphemesplit');

// various parsing operations
module.exports = {
  emojiCount: function(str) {
    return graphemeSplit(str).length;
  }
};
