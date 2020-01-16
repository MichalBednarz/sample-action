const core = require('@actions/core');
const github = require('@actions/github'); // deps from toolkit or marketplace

(async () => {
	try {
	  const commentsUrl = github.context.payload.pull_request._links.review_comments.href
	  const commentsEndpoint = commentsUrl.replace('https://api.github.com', '')
	  // console.log(commentsEndpoint) ok

	// auth like this?
	  console.log('log')
	const myToken = core.getInput('myToken');
	console.log(myToken)
	const octokit = new github.Github(myToken)
	  // const octokit = new github.GitHub(github.token, {
	  // 	previews: ['comfort-fade-preview']
	  // });

	  const comments = await octokit.request(commentsUrl)
	  console.log(comments)

	} catch (error) {
	  core.setFailed(error.message);
	}
})()
