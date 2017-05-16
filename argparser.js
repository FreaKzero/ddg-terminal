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

module.exports = parseArgs
