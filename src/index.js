#! /usr/bin/env node

var argparser = require('./argparser')
var scrape = require('./scrape');
var output = require('./output');

var parsed = argparser.parseArgs();

if (parsed.args.opt('h') === true) {
  argparser.printUsage();
  process.exit();
}

console.log(output.format('☕ * Please wait ...*'));
scrape.doSearch(parsed.search, parsed.args).then(function(data) {
  if (parsed.args.opt('o')) {
    output.openResults(data);
  } else {
    output.printResults(data, parsed.args);
  }

}).catch(function(err) {
  output.format(
    `# Oops you spammed too much \n *Too many requests*  \n Please visit https://duckduckgo.com/html/?q=${parsed.search} directly for atleast 1 time`,
    false
  );
})
