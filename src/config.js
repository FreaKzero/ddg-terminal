var chalk = require('chalk');

var SEARCH = 'https://duckduckgo.com/html/?q='

var rendererConfig = {
  em: chalk.bold.green,
  b: chalk.bold.red,
  strong: chalk.bold.red,
  width: 100, // only applicable when reflow is true
  reflowText: true
};

var argConfig = {
  l : 10,
  limit: 10
};

module.exports = {
  SEARCH,
  rendererConfig,
  argConfig
}
