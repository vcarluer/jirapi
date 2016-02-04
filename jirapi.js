// import JiraApi from 'jira-client';
var JiraApi = require('jira-client');
var prompt = require('prompt');

var schema = {
	properties: {
		username: {},
		password: {
			hidden: true
		}
	}
};

prompt.start();

prompt.get(schema, function(err, result) {
var jira = new JiraApi({
	protocol:'http',
    	host:'v-jira6',
    	port:'8080',
    	username:result.username,
    	password:result.password,
    	apiVersion: '2',
    	strictSSL: false
});

jira.searchJira('status in ("In Progress") AND assignee = currentUser() ORDER BY key DESC')
	.then(results=> {
		results.issues.forEach(issueInfo => {
			jira.findIssue(issueInfo.key)
			.then(issue => {
				console.log(issue.key + " - " + issue.fields.summary);
			})
			.catch(err => {
				// console.log(err);
				console.log("Error");
			});
		});
	})
	.catch(err => {
		// console.log(err);
		console.log("Error");
	});

});

