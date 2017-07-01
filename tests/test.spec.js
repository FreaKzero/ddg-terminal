var fs = require('fs');
var mockSnippet = fs.readFileSync('./tests/mock-snippet.html', 'utf8');
var mockNoSnippet = fs.readFileSync('./tests/mock-items.html', 'utf8');
var scrape = require('../scrape.js');
var parseArgs = require('../argparser.js').parseArgs;

describe("#argparser", function() {
  it("Should have the correct default options", function() {

    process.argv = [
      '/bin/node',
      '/bin/ddg',
      'javascript',
      'promise'];

    var parsed = parseArgs();
    expect(parsed.args.opt('l')).toBe(30);
    expect(parsed.args.opt('u')).toBe(false);
    expect(parsed.args.opt('d')).toBe(false);
  });

  it("Limits correctly", function() {

    process.argv = [
      '/bin/node',
      '/bin/ddg',
      'javascript',
      'promise',
      '-l',
      '666'];

    var parsed = parseArgs();
    expect(parsed.args.opt('l')).toBe(666);
  });

  it("Parses correctly", function() {

    process.argv = [
      '/bin/node',
      '/bin/ddg',
      'javascript',
      'promise',
      '--nah',
      '-h',
      '-d',
      '-l',
      '40'];

    var parsed = parseArgs();
    console.log(parsed.args.opt('h'));
    expect(parsed.args.opt('h')).toBe(true);
    expect(parsed.args.opt('d')).toBe(true);
    expect(parsed.args.opt('l')).toBe(40);
    expect(parsed.search).toBe('javascript promise');

  });

});

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
