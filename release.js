var zip = new require('node-zip')();
var fs = require("fs");
var pkg = require('./package.json');
var git = require('simple-git')(__dirname);
var path = require('path');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');
var GitHub = require('github-api');
var openurl = require("openurl");

var REMOTE;
var TAGBEFORE;
var CHANGELOG = `*CHANGELOG:*\n\n`;
var TOKEN = fs.readFileSync('token.json','utf8').token;

console.log('  ☕  Checking /dist folder ...')
if (!fs.existsSync('./dist')) {
  console.log(`  😢  No /dist folder found please run "npm run build" first`);
  process.exit();
}

checkError = (err) => {
  if (err) {
    console.log(`  😢  Error occured: \n ${err}`)
    process.exit();
  }
}

console.log('  ☕  Testing ...')
const test = spawn('npm test', { shell: true });
test.on('close', (code) => {
  if (code > 0) {
    console.log(`  😢  Tests failed! Purging /dist`);
    rimraf('./dist',() => {
      console.log(`  🤖  /dist purged!`);
    });
    process.exit();
  } else {
    console.log(`  🤖  All Tests OK!`);
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

function publishNpm() {
  console.log('  ☕  Publish on NPM ...')
  const npmpub = spawn('npm publish', { shell: true });
    npmpub.on('close', (code) => {
    if (code > 0) {
      console.log(`  😢  NPM Publish failed`);
      process.exit();
    } else {
      console.log(`  🤖  NPM Package Published!`);
      publishGitHub();
    }
  });
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
      TAGBEFORE = tags.all[tags.all.length-2];
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
  })
  .log({from: TAGBEFORE, to: pkg.version}, (err, data) => {
    checkError(err);
    data.all.filter((item) => {
      return item.message.includes('#')
    }).map((item) => {
       CHANGELOG += `- ${item.message} \n`
    });
  }).exec(() => {
    publishNpm();
  })
}

function publishGitHub() {
  console.log('  ☕  Publish on GitHub ...')
  var gh = new GitHub({
    token: TOKEN,
    auth: 'oauth'
  });

  const repo = gh.getRepo('freakzero', 'ddg-terminal')
    repo.createRelease({
      tag_name: pkg.version,
      target_commitish: "master",
      name: `Version ${pkg.version}`,
      body: CHANGELOG,
      draft: true,
      prerelease: false
    }, (err, data) => {
        checkError(err);
        console.log(`  🤓  Release Successful!`)
        openurl.open(`https://github.com/FreaKzero/ddg-terminal/releases/edit/${pkg.version}`);
    });
}

// TODO check if TAGBEFORE is given
// TODO write this nicely
