var GitHub = require('github-api');

// basic auth
var gh = new GitHub({
  token: '0bba20a2dade0af67870f6962ad0faa77564bb19',
  auth: 'oauth'
});

const user = gh.getUser();
const repo = gh.getRepo('freakzero', 'ddg-terminal')
repo.createRelease({
  "tag_name": "0.0.6",
  "target_commitish": "master",
  "name": "0.0.6",
  "body": "Description of the release",
  "draft": false,
  "prerelease": false
})
