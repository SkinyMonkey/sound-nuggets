const GitHubApi = require('github')

const github = new GitHubApi({})

github.authenticate({
  type: 'oauth',
  token: Meteor.settings.private.GITHUB_TOKEN
})

if (Meteor.isServer) {
	Meteor.methods({
	'github.issue.post': (issueTitle, issueContent) => {
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
	})
}
