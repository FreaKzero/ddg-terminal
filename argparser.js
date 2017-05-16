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
  -l [integer]: Limit Results, default 30
  -d [1/-1]: Show Descriotions (1 or -1), default -1
  -u [1/-1]: Show only urls
  -h: Show this Help

Examples:
  $ ddg applepie recipie             # Only headlines and urls
  $ ddg -l 5 javascript Promise      # Limit to 5, common programming question it will show instant answer
  $ ddg -l 10 -d 1 blog programming  # Limit to 10, display also Descriptions
  $ ddg -l 3  -u 1 wat meme          # Limit to 3 only show urls (useful for xargs)
  `)
}
module.exports = {
  parseArgs,
  printUsage
}
