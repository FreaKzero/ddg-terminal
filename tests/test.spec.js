var fs = require('fs');
var mockSnippet = fs.readFileSync('./tests/mock-snippet.html', 'utf8');
var mockNoSnippet = fs.readFileSync('./tests/mock-items.html', 'utf8');
var rewire = require("rewire");
var scrape = require('../src/scrape.js');
var parseArgs = require('../src/argparser.js').parseArgs;
var CONFIG = require('../src/config.js');
var output = rewire("../src/output.js");

/*
todo:
  limit to 30 max
  limit to 10 max when arg o is set
  nicer/better argconfig
 */

// Copypaste from https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function isValidUrl(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    alert("Please enter valid URL.");
    return false;
  } else {
    return true;
  }
}

describe("#output", function() {
    var options = {
      opt: function(w) {
        switch (w) {
          case "l":
          return 1;
          case "d":
          return true;
        }
      }
    };

    var DATAMOCK =  {
      head: '',
      items:[{
        headline: '1. Promise - JavaScript | MDN',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
        desc: 'The <b>Promise</b> object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.'
      }]
    };

    it("Should open URLS in Browser", function() {

      output.__set__("openurl", {
        open: function (url) {
          expect(url).toBe('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise');
        }
      });

      options = {
        opt: function(w) {
            switch (w) {
              case "l":
              return 1;
              case "o":
              return true;
            }
          }
      };
      var DATAMOCK =  {
        head: '',
        items:[{
          headline: '1. Promise - JavaScript | MDN',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
          desc: 'The <b>Promise</b> object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.'
        }]
      };
      output.openResults(DATAMOCK);
    });

    it("Should print", function() {
      console.log = jasmine.createSpy("log");
      output.printResults(DATAMOCK, options);
      expect(console.log).toHaveBeenCalled();
    });

    it("Should print URL only", function() {
      options = {
        opt: function(w) {
            switch (w) {
              case "l":
              return 1;
              case "u":
              return true;
            }
          }
      };
      console.log = jasmine.createSpy("log");
      output.printResults(DATAMOCK, options);

      // .... Fix this \n
      expect(console.log).toHaveBeenCalledWith('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise\n');
    });

    it("Should reformat HTML to Markdown", function() {
      var testStr = '<section>Wat rly <em>so kewl</em> <a href="#">fu</a></section>';
      expect(output.format(testStr)).not.toContain('<a href');
    });

    it("Should not reformat HTML to Markdown", function() {
      var testStr = '<section>Wat rly *so kewl* <a href="#">fu</a></section>';
      expect(output.format(testStr, false)).toContain('<a href');
      expect(output.format(testStr, false)).not.toContain('*so kewl*');
    });

});
describe("#argparser", function() {
  it("Should have the correct default options", function() {

    process.argv = [
      '/bin/node',
      '/bin/ddg',
      'javascript',
      'promise'];

    var parsed = parseArgs();
    expect(parsed.args.opt('l')).toBe(CONFIG.argConfig.l);
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
    expect(parsed.args.opt('h')).toBe(true);
    expect(parsed.args.opt('d')).toBe(true);
    expect(parsed.args.opt('l')).toBe(40);
    expect(parsed.search).toBe('javascript%20promise');

  });

  it("Parses longs correctly", function() {

    process.argv = [
      '/bin/node',
      '/bin/ddg',
      'javascript',
      'promise',
      '--hadouken',
      '--help',
      '--desc',
      '--limit',
      '40'];

    var parsed = parseArgs();
    expect(parsed.args.opt('help')).toBe(true);
    expect(parsed.args.opt('desc')).toBe(true);
    expect(parsed.args.opt('limit')).toBe(40);
    expect(parsed.search).toBe('javascript%20promise');

  });


});

describe("#scraper snippets", function() {
  var options = {
    opt: function() {
      return 1;
    }
  };

  it("Should Scape 1 item and 1 snippet", function() {
    var res = scrape.extract(mockSnippet, options);
    expect(res.items.length).toBe(1);
    expect(res.head.length).not.toBe(0);
  });

  it("Snippet should direct to MDN", function() {
    var MDNLINK='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise';
    var res = scrape.extract(mockSnippet, options);
    expect(res.head).toContain(MDNLINK);
  });

  it("Should Scape 5 Items", function() {
    options = {
      opt: function(w) {
        switch (w) {
          case "l":
          return 5;
          case "f":
          return false;
        }
      }
    };

    var res = scrape.extract(mockSnippet, options);
    expect(res.items.length).toBe(5);
  });

  it("Items should have valid URLs", function() {
    options = {
      opt: function(w) {
        switch (w) {
          case "l":
          return 20;
          case "d":
          return false;
        }
      }
    };

    var res = scrape.extract(mockSnippet, options);

    res.items.filter((item) => {
      expect(isValidUrl(item.url)).toBe(true);
    });
  });

  it("Item Texts Should have correct Format/Structure", function() {
    options = {
      opt: function(w) {
        switch (w) {
          case "l":
          return 3;
          case "d":
          return true;
        }
      }
    };


    var res = scrape.extract(mockSnippet, options);
    var testItem = res.items[0];
    var OUTPUT = 'The <b>Promise</b> object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.';
    var structureTest = /^[0-9]\.\s.*/.test(testItem.headline);
    var urlTest = isValidUrl(testItem.url);

    expect(structureTest).toBe(true);
    expect(testItem.desc).toBe(OUTPUT)
  });


});
