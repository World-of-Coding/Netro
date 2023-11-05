const showdown = require('showdown');

const converter = new showdown.Converter({
  simplifiedAutoLink: true,
  strikethrough: true,
  simpleLineBreaks: true,
  emoji: true,
  underline: true,
});

module.exports = function generate(messages) {
  const msg = messages[0];
  if (!msg) {
    return '';
  }

  const replaceHtml = (str) => {
    if (!str) {
      return '';
    }
    let res = str;
    res = res.replace(/</g, '&lt;');
    res = res.replace(/>/g, '&gt;');
    return res;
  };

  let htmlString = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Modmail transcript</title>
      <style>
        body{
          background-color: #2c2f33;
          font-family: sans-serif;
        }
        .server-info-metadata{
          color: white;
          position: inherit;
        }
        img{
          border-radius: 50%;
        }
        .message{
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div id="server-info">
      <img src="${msg.guild.iconURL()}" alt="Server Icon">
      <div class="server-info-metadata" style="position: relative;display: inline-block;margin-left: 10px;">
        <h1>
          Modmail-${msg.channel.name.split('-')[1]}
        <br>
          <span style="font-size: medium">${msg.channel.topic}'s modmail</span>
        </h1>
        <h2>
          ${replaceHtml(msg.guild.name)}
        </h2>
      </div>
    </div>
    <hr>
    <div id="messages">`;

  messages.forEach((message) => {
    let content = converter.makeHtml(replaceHtml(
      message.embeds[0].fields[0]
        ? message.embeds[0].fields[0].value
        : message.embeds[0].description,
    ))
        || '';
    if (content.includes('<p>')) {
      content = content.split('<p>')[1].split('</p>');
    }
    htmlString += `
      <div class="message">
        <div style="display: inline-block;vertical-align: top;">
          <img src="${message.embeds[0].author ? message.embeds[0].author.iconURL : null || message.embeds[0].author.proxyIconURL}" alt="user icon" class="avatar" width="40px" height="40px">
        </div>
        <div style="color: white;position: relative;top:0px;display: inline-block;">
        <span id="nickname" style="font-size: small">
          ${replaceHtml(message.embeds[0].author.name)} ${message.embeds[0].footer ? `(${message.embeds[0].footer.text})` : ''}
        </span>
        <br>
        <span id="content" style="font-size: medium;">
                    ${content}
                    ${message.attachments.first() ? message.attachments.map(m=>m).forEach(attachment => {
                        const url = attachment.proxyURL.split(".");
                        const urlSuffix = url[url.length-1];
                        return `<br>
                        ${["gif","webp","png","jpg","jpeg"].includes(urlSuffix?.toLowerCase()) 
                            ? `<img src='${url.join(".")}' alt="Message Attachment Image" class="image" width="80px" height="80px"`
                            : `<span class="attachment" style="font-szie: medium;">${url.join(".")}</span>`}`;
                    }) : ''}
        </span>
        ${message.embeds[0].image ? `<br>
        <img src="${message.embeds[0].image.proxyURL}" alt="image" style="border-radius: 1%;max-width: 500px;">` : ''}
        </div>
      </div>`;
  });
  htmlString += `</div>
    </body>
    </html>`;

  return htmlString;
};
