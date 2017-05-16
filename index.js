#! /usr/bin/env node

var parseArgs = require('./argparser')
var doSearch = require('./scrape');
var marked = require('marked');
var toMarkdown = require('to-markdown');
var TerminalRenderer = require('marked-terminal');
var chalk = require('chalk');

marked.setOptions({
  renderer: new TerminalRenderer({
    em: chalk.bold.green,
    b: chalk.bold.red,
    strong: chalk.bold.red,
    width: 100, // only applicable when reflow is true
    reflowText: true
  })
});

var availableArgs = [
  {
    name: 'limit',
    arg: '-l',
    type: parseInt,
    value: null,
    defaultvalue: 30
  },{
    name: 'desc',
    arg: '-d',
    type: Boolean,
    value: null,
    defaultvalue: false
  }];

var parsed = parseArgs(process.argv, availableArgs);
var search = encodeURIComponent(parsed.search);

doSearch(search, parsed.args).then(function(data) {
  let output = '';
  data.items.reverse().forEach(function(item) {
    var desc = parsed.args.desc ? '<br />' + item.desc.replace(parsed.search, '<em>' + parsed.search + '</em>') : '';
    output += `<em>${item.headline}</em>${desc}<br>${item.url}<br><br>`
  });
  console.log(marked(toMarkdown(output)));
  console.log(marked(toMarkdown(data.head)));
}).catch(function(err) {
  console.log(marked(`# Oops you spammed too much \n *Too many requests*  \n Please visit https://duckduckgo.com/html/?q=${search} directly for atleast 1 time`))
})
