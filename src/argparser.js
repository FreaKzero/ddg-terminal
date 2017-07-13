var CONFIG = require('./config');
var ap = require('argparser');

function parseArgs() {
   var args = ap.arg(0)
   .defaults(CONFIG.argConfig)
   .nums('l')
   .nonvals('u')
   .nonvals('d')
   .nonvals('o')
   .parse();

   return {
    search: encodeURIComponent(args._args.join(' ')),
    args: args
   }
}

function printUsage() {
  console.log(`DuckDuckGo Terminal Seach Results
Usage:
  ddg [FLAGS]... [SEARCHTERM]...

Flags:
  -l [integer]: Limit Results, default 10
  -d Show Descriptions
  -u Show only urls
  -h Show this Help
  -o Open found urls in Browser automatically

Examples:
  $ ddg applepie recipie           # Only headlines and urls
  $ ddg -l 5 javascript Promise    # Limit to 5, common programming question it will show instant answer
  $ ddg -l 10 -d blog programming  # Limit to 10, display also Descriptions
  $ ddg -l 3 -u wat meme           # Limit to 3 only show urls
  `)
}
module.exports = {
  parseArgs,
  printUsage
}
