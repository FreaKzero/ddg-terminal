var zip = new require('node-zip')();
var fs = require("fs");
var pkg = require('./package.json');
var git = require('simple-git')(__dirname);
var path = require('path');
var spawn = require('child_process').spawn;
var REMOTE;

console.log('  ☕  Checking /dist folder ...')
if (!fs.existsSync('./dist')) {
  console.log(`😢  No /dist folder found please run "npm run build" first`);
  process.exit();
}

checkError = (err) => {
  if (err) {
    console.log(`😢  Error occured: \n ${err}`)
    process.exit();
  }
}

console.log('  ☕  Testing ...')
const test = spawn('npm test', { shell: true });
test.on('close', (code) => {
  if (code > 0) {
    console.log(`😢  Tests failed!`);
    process.exit();
  } else {
    console.log(`🤖  All Tests OK!`);
    compress();
    gitCmds();
  }
});

function compress() {
  console.log('  ☕  Zipping Release Files ...')
  zip.file('ddg', fs.readFileSync(path.join(__dirname, '/dist/bin/ddg-terminal-macos')));
  var data = zip.generate({ base64:false, compression: 'DEFLATE' });
  fs.writeFileSync('./dist/ddg-macos-x64.zip', data, 'binary');

  zip.file('ddg', fs.readFileSync(path.join(__dirname, '/dist/bin/ddg-terminal-linux')));
  var data = zip.generate({ base64:false, compression: 'DEFLATE' });
  fs.writeFileSync('./dist/ddg-linux-x64.zip', data, 'binary');

  zip.file('ddg.exe', fs.readFileSync(path.join(__dirname, '/dist/bin/ddg-terminal-win.exe')));
  var data = zip.generate({ base64:false, compression: 'DEFLATE' });
  fs.writeFileSync('./dist/ddg-win-x64.zip', data, 'binary');
}

function gitCmds() {
  git
  .pull()
  .tags(function(err, tags) {
    if (pkg.version === tags.latest) {
      console.log('  ☕  Fetching tags ...')
      console.log(`  🤖  Tag ${tags.latest} already exists`);
      process.exit();
    } else {
      console.log(`  🤓  Pushing current Changes`)
    }
  })
  .add('./*')
  .commit(`🎉 Release ${pkg.version}`)
  .push(['origin', 'master'])
  .listRemote(['--get-url'], function(err, data) {
    console.log(`  ☕  Fetch current Remote ...`)
    checkError(err);
    REMOTE = data;
    console.log(`  🤖  Current Remote: ${REMOTE}`)
  })
  .addTag(pkg.version, (err, res) => {
    console.log(`  🤓  Add Tag ${pkg.version}`)
    checkError(err);
  })
  .pushTags(REMOTE, (err, res) => {
    console.log(`  🤓  Push Tag to Remote: ${REMOTE}`)
    checkError(err);
  });
}
