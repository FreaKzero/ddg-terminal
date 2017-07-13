var CONFIG = require('./config');
var ap = require('argparser');
var pkg = require('../package.json');

function parseArgs() {
   var args = ap.arg(0)
   .defaults(CONFIG.argConfig)
   .nums('l', 'limit')
   .nonvals('u', 'only-urls', 'd', 'desc', 'o', 'open', 'v', 'version', 'f', 'first-hit')
   .parse();

   return {
    search: encodeURIComponent(args._args.join(' ')),
    args: args
   }
}

function printVersion() {
  console.log(pkg.version);
}

function printUsage() {
  console.log(`DuckDuckGo Terminal Seach Results v${pkg.version}
Usage:
  ddg [FLAGS]... [SEARCHTERM]...

Flags:
  -v [--version]   Outputs Version
  -h [--help]      Show this Help
  -l [--limit]     Limit Results, default 10
  -d [--desc]      Show Descriptions
  -u [--only-urls] Show only urls
  -o [--open]      Open found urls in Browser automatically
  -f [--first-hit] Opens First Link in Browser

Examples:
  $ ddg applepie recipie           # Only headlines and urls
  $ ddg -l 5 javascript Promise    # Limit to 5, common programming question it will show instant answer
  $ ddg -l 10 -d blog programming  # Limit to 10, display also Descriptions
  $ ddg -l 3 -u wat meme           # Limit to 3 only show urls
  `)
}
module.exports = {
  parseArgs,
  printUsage,
  printVersion
}
