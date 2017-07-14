const rp = require('request-promise');
const pkg = require('../package.json');

function updateAvailablePromise() {

return new Promise(function(resolve, reject) {  
  rp({
    uri: 'https://api.github.com/repos/freakzero/ddg-terminal/releases',
    headers: {
      'User-Agent': 'ddg-terminal updater'
    },
    json: true
  })
  .then(function (body) {
    if (body[0].tag_name === pkg.version) 
    resolve({
      error: false, 
      result: body[0].tag_name > pkg.version,
      latest: body[0].tag_name,
      url: `https://github.com/FreaKzero/ddg-terminal/releases/tag/${body[0].tag_name}`
    })
  })
  .catch(function (err) {
    resolve({
      error: true, 
      result: err,
      latest: null,
      url: null
    });
  });
});
}
module.exports = updateAvailablePromise

