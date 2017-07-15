const rp = require('request-promise');
const cheerio = require('cheerio');
const urlRegex = /(https?:\/\/[^ ]*)/;

function extract(body, args) {
  var searchresults = [];
  var $ = cheerio.load(body);
  var snippet = '';
  if ($('.zci-wrapper').text() !== '') {
    snippet = $('.zci__heading').html().trim() + '\n' + $('.zci__result').html().trim() + '\n';
  }
  let id = 1;
  let LIMIT = args.opt('f', 'first-hit') ? 1 : args.opt('l', 'limit');

  $('.result__body').each(function(i, elem) {

    searchresults.push({
      headline: id + '. ' + $(this).find('h2').text().trim(),
      url: decodeURIComponent($(this).find('h2 a').attr('href')).match(urlRegex)[0],
      desc: $(this).find('.result__snippet').html()
    });

    if (id == LIMIT)
      return false;

    id++;
  });

  return {
    head: snippet,
    items: searchresults
  }
}

function doSearch(searchTerm, args, url) {
  var SEARCHURL = url || `https://duckduckgo.com/html/?q=${searchTerm}`;
  var results = {}
  function scrapeResults(searchTerm) {
    return new Promise(function(resolve, reject) {
      rp(SEARCHURL)
        .then(function (body) {
          resolve(extract(body, args));
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }

  return new Promise(function(resolve, reject) {
    scrapeResults(searchTerm).then(function(results) {
      resolve(results);
    }).catch(function(err) {
      reject(err);
    })
  });
}

module.exports = {
  doSearch,
  extract
}
