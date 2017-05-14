const exec = require("child_process").exec
const rp = require('request-promise');
const cheerio = require('cheerio');
const urlRegex = /(https?:\/\/[^ ]*)/;

function doSearch(searchTerm, options) {
  const term = encodeURIComponent(searchTerm);



  function scrapeResults(term) {
    var searchresults = [];
    var results = {};
    return new Promise(function(resolve, reject) {
      rp(`https://duckduckgo.com/html/?q=${searchTerm}`)
        .then(function (body) {
          var $ = cheerio.load(body);
          var snippet = '';
          if ($('.zci-wrapper').text() !== '') {
            snippet = $('.zci__heading').html().trim() + '\n' + $('.zci__result').html().trim() + '\n';
          }
          let id = 1;
          $('.result__body').each(function(i, elem) {

            var headline = id + '. ' + $(this).find('h2').text().trim();
            var url = decodeURIComponent($(this).find('h2 a').attr('href')).match(urlRegex)[0];
            //var snippet = $(this).find('.result__snippet').text()
            searchresults.push({
              headline: `${headline}`,
              url: url
            });
            id++;
          });
          resolve({
            head: snippet,
            items: searchresults
          });
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }

  return new Promise(function(resolve, reject) {
    scrapeResults(term).then(function(results) {
      resolve(results);
    }).catch(function(err) {
      reject(err);
    })
  });
}

module.exports = doSearch
