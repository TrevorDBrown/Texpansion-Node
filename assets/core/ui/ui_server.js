/*
  Texpansion
  (c)2018 Trevor D. Brown.

  ui_server.js - provides an Express.js web server for access to the app's UI

  Packages used:
  Express (https://www.npmjs.com/package/express, https://github.com/expressjs/express)

*/

// Required variables
const express = require('express');         // Express package
const app = express();                      // Express instance
const opn = require('opn');                 // Opn package

const snippet_server = require('./../snippets/snippet_server.js');  // Snippet Server
const keystroke_server = require('./../io/keystroke_server.js');  // Keystroke Server
const path = require('path');         // Path package

// For POST:
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// Declare static routes
app.use('/texpansion', express.static(__dirname + '/interface'));
app.use('/texpansion/css', express.static(__dirname + '/interface/css'));
app.use('/texpansion/js', express.static(__dirname + '/interface/js'));
app.use('/texpansion/user_content', express.static(__dirname + '/../../content'));

// Redirection to UI root
app.get('/', function(req, res){
  res.redirect('/texpansion');
});

// Get main interface file
app.get('/texpansion', function(req, res){
  res.sendFile(path.join(__dirname, '/interface/app.html'));
});

// Get all snippets from snippets file.
app.get('/texpansion/getallsnippets', function(req, res){
  res.sendFile(path.join(__dirname, '/../../content/snippets.json'));
});

// Get listening toggle status
app.get('/texpansion/gettogglestatus', function(req, res){
  var status = keystroke_server.getToggleStatus();
  res.send(status);
});

// Add snippet to file.
app.post('/texpansion/addsnippet', function(req, res){
  // Validate if the snippet is actually new.
  var notNewSnippet = snippet_server.doesSnippetExist(req.body.id);

  if (notNewSnippet == false){
    var new_snippet = {};
    new_snippet.id = req.body.id;
    new_snippet.content = req.body.content;
    snippet_server.addSnippetToFile(new_snippet);
    console.log("Snippet " + new_snippet.id + " added!");
    var response = {
        success : 'Snippet added successfully!',
        status  : 200
    }
  }

  res.end(JSON.stringify(response));
});

// Get snippet
app.post('/texpansion/getsnippet', function(req, res){
  // Validate if the snippet exists
  var snippetExists = snippet_server.doesSnippetExist(req.body.id);

  if (snippetExists == true){
    var snippet = snippet_server.findSnippet(req.body.id);
    console.log(snippet);

    var response = {
        status  : 200,
        success : 'Updated Successfully',
        snippet : `${snippet}`
    }

    res.end(JSON.stringify(response));

  }
});

// Remove snippet from file.
app.post('/texpansion/removesnippet', function(req, res){
  var snippet_exists = snippet_server.doesSnippetExist(req.body.id);

  if (snippet_exists == true){
    snippet_server.removeSnippetFromFile(req.body.id);
  }
  else{
    console.log("Error: Snippet ID \"" + req.body.id + "\" does not exist.");
  }

});

// Update snippet in file.
app.post('/texpansion/updatesnippet', function(req, res){
  // Validate if the snippet is actually new.
  var snippet_exists = snippet_server.doesSnippetExist(req.body.id);

  if (snippet_exists == true){
    var updated_snippet = {};
    updated_snippet.id = req.body.id;
    updated_snippet.content = req.body.content;

    snippet_server.updateSnippet(updated_snippet);

    var response = {};
    response.status = 200;
    response.success = 'Update Succeeded!';

    res.end(JSON.stringify(response));
  }
  else{
    console.log("Error: Can't update non-existent snippet!");
  }
});

// Check if snippet exists in file.
app.post('/texpansion/doessnippetexist', function(req, res){
  var snippet_exists = snippet_server.doesSnippetExist(req.body.id);

  var response = {
      status  : 200,
      success : 'Snippet exist check success.',
      exists : `${snippet_exists}`
  }

  res.end(JSON.stringify(response));

});

// Listen for HTTP requests over port 3000
var server = app.listen(3000);

// Console will update with info about the Texpansion UI service
console.log('Texpansion UI service running at http://localhost:3000/texpansion');
opn("http://localhost:3000/");
