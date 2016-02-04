var JiraApi = require('jira-client');
var prompt = require('prompt');
var fs = require("fs");

var action = "";
if (process.argv.length > 2){
	action = process.argv[2];
	if (action.toLowerCase() === "configure") {
		configure();
		return;
	}

	if (action.toLowerCase() === "progress") {
		getInProgress();
		return;
	}

	if (action.toLowerCase() === "help") {
		console.log("Usage node jirapi COMMAND");
		console.log("Command list:");
		console.log("Configure: Call this first to store your configuration settings");
		console.log("Progress: Get your tasks in progress");
		return;
	}
} else {
	console.log("Use Help to get command list with 'node jirapi help'");
}

function configure() {
	var schema = {
		properties: {
			protocol: {},
			host: {},
			port: {},
			username: {},
			password: {
				hidden: true
			}
		}
	};

	prompt.start();

	prompt.get(schema, function(err, result) {
		fs.writeFileSync(".\\config", JSON.stringify(result));
	});
}

function readConfig() {
	var conf = fs.readFileSync(".\\config");
	var config = JSON.parse(conf);
	return config;
}

function getInProgress() {
	var configuration = readConfig();
	var jira = new JiraApi({
			protocol:configuration.protocol,
			host:configuration.host,
			port:configuration.port,
			username:configuration.username,
			password:configuration.password,
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
}

