#! /usr/bin/env node

var argparser = require('./argparser')
var scrape = require('./scrape');
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

var parsed = argparser.parseArgs();

if (parsed.args.opt('h') === true) {
  argparser.printUsage();
  process.exit();
}

scrape.doSearch(parsed.search, parsed.args).then(function(data) {
  let output = '';

  data.items.reverse().forEach(function(item) {
    if (parsed.args.urlonly) {
      output += `${item.url}\n`
    } else {
      var desc = parsed.args.desc ? '<br />' + item.desc : '';
      output += `<em>${item.headline}</em>${desc}<br>${item.url}<br><br>`
    }
  });

  if (parsed.args.urlonly) {
    console.log(output);
  } else {
    console.log(marked(toMarkdown(output)));
    console.log(marked(toMarkdown(data.head)));
  }

}).catch(function(err) {
  console.log(marked(`# Oops you spammed too much \n *Too many requests*  \n Please visit https://duckduckgo.com/html/?q=${search} directly for atleast 1 time`))
})
