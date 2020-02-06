const core = require('@actions/core')
const github = require('@actions/github')
const { graphql } = require("@octokit/graphql");
const fs = require('fs')

async function run() {
	try {
		const {
				context: {
					repository,
					payload: {
						number
					}
				}
			} = github
		
		console.log(repository)

		const repoToken = core.getInput('repo-token')

		const graphqlWithAuth = graphql.defaults({
		  headers: {
		    authorization: `token ${repoToken}`
		  },
		  previews: ["comfort-fade-preview"]
		})

		const name = repository.replace(/.+\//, '')
		const owner = repository.replace(/\/.+/, '')

		const { 
			repository: {
				pullRequests: {
					nodes
				}
			} 
		} = await graphqlWithAuth(`
		  {
		    repository(owner: ${owner}, name: ${name}) {
		    	pullRequest(number: 7) { 
		    	  	reviewThreads(first:10){
		    	      nodes {
		    	        comments(first:50) {
		    	          nodes {
		    	            body
		    	            author {
		    	              login
		    	            }
		    	            originalPosition
		    	            path
		    	            outdated
		    	          }
		    	        }
		    	      }
		    	    }
		    	}
		  }
		`)

		const comments = x.nodes
			.flatMap(pr => pr.reviewThreads.nodes)
			.flatMap(thread => thread.comments.nodes)
			.filter(comment => !comment.outdated)

		const filePath = 'ReviewComments.json'
		fs.writeFile(filePath, JSON.stringify(comments), (err) => {
		  if(err) throw err
		  console.log('The file has been saved!');
		})
	} catch (error) {
	  core.setFailed(error.message);
	}
}

run()
