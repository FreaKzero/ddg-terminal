#! /usr/bin/env node

var doSearch = require('./scrape');
var marked = require('marked');
var toMarkdown = require('to-markdown');
var TerminalRenderer = require('marked-terminal');

marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer()
});

const search = process.argv.slice(2).join(' ');
doSearch(search).then(function(data) {

  let output = '';
  data.items.reverse().forEach(function(item) {
    output += '<b>' + item.headline + '</b><br>' + item.url + '<br><br>';
  });

  console.log(marked(toMarkdown(output)));
  console.log(marked(toMarkdown(data.head)));

});
