#! /usr/bin/env node

var argparser = require('./argparser')
var scrape = require('./scrape');
var output = require('./output');
var updateAvailablePromise = require('./checkupdate');

var parsed = argparser.parseArgs();

if (parsed.args.opt('v', 'version') === true) {
  argparser.printVersion();
  
  updateAvailablePromise().then((update) => {
  if (!update.error && update.result)
    console.log('Version ${update.latest} is available under: ${update.url}');
  });
  
  process.exit();
}

if (parsed.args.opt('h', 'help') === true || parsed.args._args.length < 1) {
  argparser.printUsage();
  process.exit();
}

console.log(output.format('☕ * Please wait ...*'));

scrape.doSearch(parsed.search, parsed.args).then(function(data) {
  if (parsed.args.opt('o', 'open', 'f', 'first-hit')) {
    output.openResults(data);
  } else {
    output.printResults(data, parsed.args);
  }

}).catch(function(err) {
  if (err) console.log(`Oops you spammed too much \n Please visit https://duckduckgo.com/html/?q=${parsed.search} directly for atleast 1 time`)
})
