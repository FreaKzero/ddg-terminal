var marked = require('marked');
var toMarkdown = require('to-markdown');
var TerminalRenderer = require('marked-terminal');
var openurl = require("openurl");

var CONFIG = require('./config');

marked.setOptions({
  renderer: new TerminalRenderer(CONFIG.rendererConfig)
});

function openResults(data) {
  data.items.reverse().forEach(function(item) {
    openurl.open(item.url);
  });
}

function format(msg, toMark) {
  return toMark === false ? marked(msg) : marked(toMarkdown(msg));
}

function printResults(data, args) {
  let output = '';
  data.items.reverse().forEach(function(item) {
    if (args.opt('u', 'only-urls')) {
      output += `${item.url}\n`
    } else {
      var desc = args.opt('d', 'desc') ? '<br />' + item.desc : '';
      output += `<em>${item.headline}</em>${desc}<br>${item.url}<br><br>`
    }
  });

  if (args.opt('u', 'only-urls')) {
    console.log(output);
  } else {
    console.log(format(output));
    console.log(format(data.head));
  }
}

module.exports = {
  printResults,
  openResults,
  format
}
