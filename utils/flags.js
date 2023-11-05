module.exports = function parse(str) {
  const regexp = /(--?[a-zA-Z]+)[:\s=]?([A-Z]:(?:\\[\w\s-]+)+\\?(?=\s-)|"[^"]*"|[^-][^\s]*)?/g;

  return [...str.matchAll(regexp)];
};
