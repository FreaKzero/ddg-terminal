var fs = require('fs');
var mockSnippet = fs.readFileSync('./tests/mock-snippet.html', 'utf8');
var mockNoSnippet = fs.readFileSync('./tests/mock-items.html', 'utf8');
var scrape = require('../scrape.js');

describe("#scraper snippets", function() {
  it("Should Scape 1 item and 1 snippet", function() {
    var options = {
      limit: 1
    };

    var res = scrape.extract(mockSnippet, options);
    expect(res.items.length).toBe(1);
    expect(res.head.length).not.toBe(0);
  });

  it("Should Scape 5 Items", function() {
    var options = {
      limit: 5
    };

    var res = scrape.extract(mockSnippet, options);
    expect(res.items.length).toBe(5);
  });


  it("Snippet should direct to MDN", function() {
    var MDNLINK='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise';

    var options = {
      limit: 1
    };

    var res = scrape.extract(mockSnippet, options);
    expect(res.head).toContain(MDNLINK);
  });
});
