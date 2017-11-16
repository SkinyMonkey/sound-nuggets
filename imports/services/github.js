const GitHubApi = require('github')

const github = new GitHubApi({})

/* NOTE: Use for debugging
const Meteor = {
  settings: {
    private: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
    }
  }
}
createIssue('ok', 'another test')
*/

github.authenticate({
  type: 'oauth',
  token: Meteor.settings.private.GITHUB_TOKEN
})

const createIssue = (issueTitle, issueContent) => {
  return new Promise((resolve, reject) => {
      github.issues.create({
      owner: 'SkinyMonkey',
      repo: Meteor.settings.private.GITHUB_REPOSITORY,
      title: issueTitle,
      body: issueContent,
      labels: ['feedback']
    },
    (error, issue) => {
      if ( error ) {
        return reject(error.message)
      }
      resolve(issue.data.html_url)
    });
  })
} 

if (Meteor.isServer) {
	Meteor.methods({
    'github.issue.post': (issueTitle, issueContent) => {
      return createIssue(issueTitle, issueContent)
    }
  })
}
