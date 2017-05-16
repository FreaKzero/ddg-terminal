function parseArgs(argvArray, args) {
  argvArray = argvArray.slice(2);
  var out = {};

  args.map(function(item) {
    var ind = argvArray.indexOf(item.arg);

    if (ind > -1) {
      out[item.name] = item.type(argvArray.splice(ind, 2)[1]);
    } else if (item.hasOwnProperty('defaultvalue')) {
        out[item.name] = item.defaultvalue;
    }
  });

  argvArray = argvArray.filter(function(item) {
    return item !== ""
  }).join(' ')

  return {
      args: out,
      search: argvArray
  }
}

function printUsage() {
  console.log(`DuckDuckGo Terminal Seach Results
Usage:
  ddg [FLAGS]... [SEARCHTERM]...

Flags:
  -l: Limit Results, default 30
  -d: Show Descriotions (1 or -1), default -1
  -h: Show this Help

Examples:
  $ ddg applepie recipie
  $ ddg -l 5 javascript Promise
  $ ddg -l 10 -d 1 blog programming
  `)
}
module.exports = {
  parseArgs,
  printUsage
}
