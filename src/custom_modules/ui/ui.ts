/*
	Texpansion
	(c)2020-2021 Trevor D. Brown. All rights reserved.

	ui_server.js - provides an Express.js web server for access to the app's UI

	Packages used:
	Express (https://www.npmjs.com/package/express, https://github.com/expressjs/express)

*/

// External Modules
import e = require('express');
import express = require('express');
const opn = require('opn'); 
const path = require('path');

/// <reference path="./../../app.ts" />

const app: express.Application = express();
app.use(express.json());			 
app.use(express.urlencoded({extended: true}));

// Declare static routes
app.use('/texpansion', express.static(__dirname + './../../interface'));
app.use('/texpansion/css', express.static(__dirname + './../../interface/css'));
app.use('/texpansion/js', express.static(__dirname + './../../interface/js'));
app.use('/texpansion/shared/jquery', express.static(__dirname + './../../../node_modules/jquery/dist/'));
app.use('/texpansion/shared/bootstrap', express.static(__dirname + './../../../node_modules/bootstrap/dist/'));
app.use('/texpansion/shared/datatables/js', express.static(__dirname + './../../../node_modules/datatables.net/js/'));
app.use('/texpansion/shared/datatables/js', express.static(__dirname + './../../../node_modules/datatables.net-dt/js/'));
app.use('/texpansion/shared/datatables/css', express.static(__dirname + './../../../node_modules/datatables.net-dt/css/'));

// Redirection to UI root
app.get('/', function(req, res){
	res.redirect('/texpansion');
});

// Get main interface file
app.get('/texpansion', function(req, res){
	res.sendFile(path.join(__dirname, './../../interface/app.html'));
});

// Get all snippets from snippets file.
app.get('/texpansion/snippets', function(req, res){
	res.status(200).sendFile(path.join(__dirname, './../../private/snippets.json'));
});

// Get snippet
app.get('/texpansion/snippets/:snippet', function(req, res){
	// Validate if the snippet exists
	var snippet: {snippetShorthand: string; snippetFound: boolean; snippetContent?: string} = snippets_server.findSnippet(req.params["snippet"]);
	var response: {snippetShorthand: string, snippetContent: string};

	if (snippet.snippetFound && snippet.snippetContent){
		console.log(snippet);

		response = {
			snippetShorthand: snippet.snippetShorthand,
			snippetContent: snippet.snippetContent
		}

		res.status(200).send(JSON.stringify(response));

	}else {
		response = {
			snippetShorthand: snippet.snippetShorthand,
			snippetContent: ""
		}

		res.status(400).send()
	}
});

// Get listening toggle status
app.get('/texpansion/listeningStatus', function(req, res){
	var listeningStatus = io_server.getListeningStatus();

	var response: {"listening": boolean} = {"listening": listeningStatus};
	res.status(200).send(response);
});

// // Add snippet to file.
// app.post('/texpansion/addSnippet', function(req, res){
// 	// Validate if the snippet is actually new.
// 	var notNewSnippet = snippets_server.doesSnippetExist(req.body.id);

// 	if (notNewSnippet == false){
// 		var new_snippet = {};
// 		new_snippet.id = req.body.id;
// 		new_snippet.content = req.body.content;
// 		snippets_server.addSnippetToFile(new_snippet);
// 		console.log("Snippet " + new_snippet.id + " added!");
// 		var response = {
// 				success : 'Snippet added successfully!',
// 				status	: 200
// 		}
// 	}

// 	res.end(JSON.stringify(response));
// });

// // Remove snippet from file.
// app.delete('/texpansion/removesnippet', function(req, res){
// 	var snippet_exists = snippets_server.doesSnippetExist(req.body.id);

// 	if (snippet_exists == true){
// 		snippets_server.removeSnippetFromFile(req.body.id);
// 	}
// 	else{
// 		console.log("Error: Snippet ID \"" + req.body.id + "\" does not exist.");
// 	}

// });

// // Update snippet in file.
// app.put ('/texpansion/updatesnippet', function(req, res){
// 	// Validate if the snippet is actually new.
// 	var snippet_exists = snippets_server.doesSnippetExist(req.body.id);

// 	if (snippet_exists == true){
// 		var updated_snippet = {};
// 		updated_snippet.id = req.body.id;
// 		updated_snippet.content = req.body.content;

// 		snippets_server.updateSnippet(updated_snippet);

// 		var response = {};
// 		response.status = 200;
// 		response.success = 'Update Succeeded!';

// 		res.end(JSON.stringify(response));
// 	}
// 	else{
// 		console.log("Error: Can't update non-existent snippet!");
// 	}
// });

// Check if snippet exists in file.
app.post('/texpansion/doessnippetexist', function(req, res){
	var snippet: {snippetShorthand: string; snippetFound: boolean; snippetContent?: string} = snippets_server.find(req.body.id);

	var response: {status: number; success: string; exists: string};

	if (snippet.snippetShorthand && snippet.snippetContent){
		response = {
			status	: 200,
			success : 'Snippet exist check success.',
			exists : `${snippet.snippetContent}`
		}
	}else {
		response = {
			status: 400,
			success: 'Snippet does not exist.',
			exists: "N/A"
		}
	}

	res.end(JSON.stringify(response));

});

// Listen for HTTP requests over port 3000
var server = app.listen(3000);

// Console will update with info about the Texpansion UI service
console.log('Texpansion UI service running at http://localhost:3000/texpansion');
opn("http://localhost:3000/");
