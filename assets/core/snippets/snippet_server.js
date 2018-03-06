/*
  Texpansion
  (c)2018 Trevor D. Brown. All rights reserved.

  snippet_server.js - provides an interface for adding, removing, modifying, and printing user snippets.

  Uses Robots.js to perform replacements on text.

  Packages used:
  RobotJS (http://robotjs.io/, https://www.npmjs.com/package/robotjs, https://github.com/octalmage/robotjs)
*/

// Required packages
const fs = require('fs');         // Node.js File System
const path = require('path');     // Node.js Path
const robot = require('robotjs'); // Robot.js


// getSnippetsFile() - retrieves the entire snippets file from disk.
var getSnippetsFile = function getSnippetsFile(){
  return JSON.parse(fs.readFileSync(path.join(__dirname + '/../../content', "snippets.json"), 'utf8'));
};

// doesSnippetExist(snippet_id) - checks a provided snippet ID against the snippets file.
var doesSnippetExist = function doesSnippetExist(snippet_id){
  var current_snippet = findSnippet(snippet_id);

  if (current_snippet != ""){
    return true;
  }
  else{
    return false;
  }

};

// findSnippet(snippet_id, snippets_file) - finds a particular snippet in the snippet file.
var findSnippet = function findSnippet(snippet_id){
  var snippets_file = getSnippetsFile();
  var theSnippet = "";

  for (var i = 0; i < snippets_file.length; i++){
    if (snippets_file[i].id == snippet_id){
      theSnippet = snippets_file[i].content;
    }
  }

  return theSnippet;
};

// addSnippetToFile(new_snippet) - adds the provided snippet to the snippets file.
var addSnippetToFile = function AddSnippetToFile(new_snippet){
  fs.readFile(path.join(__dirname + '/../../content', "snippets.json"), function readFileCallback(err, data) {
    if (err){
      console.log(err);
    }
    else{
      var obj = JSON.parse(data);
      obj.push(new_snippet);
      //console.log(obj);
      var json = JSON.stringify(obj);
      fs.writeFileSync(path.join(__dirname + '/../../content', "snippets.json"), json);
      console.log(snippet_id + " has been added.");
    }
  });
};

// removeSnippetFromFile(snippet_id) - removes a specified snippet ID from the snippets file.
var removeSnippetFromFile = function removeSnippetFromFile(snippet_id){
  fs.readFile(path.join(__dirname + '/../../content', "snippets.json"), function readFileCallback(err, data) {
    if (err){
      console.log(err);
    }
    else{
      var obj = JSON.parse(data);
      var filtered_snippets = obj.filter(function(item) {
         return item.id !== snippet_id;
      });
      var json = JSON.stringify(filtered_snippets);
      fs.writeFileSync(path.join(__dirname + '/../../content', "snippets.json"), json);
      console.log(snippet_id + " has been removed.");
    }
  });
};

var updateSnippet = function updateSnippet(snippet){

  var snippet_id = snippet.id;
  var snippet_content = snippet.content;

  // Verify removal
  var check_snippet = doesSnippetExist(snippet_id);

    // Add updated snippet
    if (check_snippet == true){
      fs.readFile(path.join(__dirname + '/../../content', "snippets.json"), function readFileCallback(err, data) {
        if (err){
          console.log(err);
        }
        else{
          var obj = JSON.parse(data);

          var theSnippet = "";

          for (var i = 0; i < obj.length; i++){
            if (obj[i].id == snippet_id){
              obj[i].content = snippet_content;
            }
          }

          var json = JSON.stringify(obj);
          fs.writeFileSync(path.join(__dirname + '/../../content', "snippets.json"), json);
          console.log(snippet_id + " has been updated.");
        }
      });
    }
    else{
      console.log("Error: original snippet could not be updated!");
      return false;
    }
};

// printSnippet(snippet_id) - replaces the snippet id with the snippet on the user's current application.
var printSnippet = function printSnippet(snippet_id){

    var snippet = findSnippet(snippet_id);

    // Replace the ID wherever it was typed.
    for (var i = 0; i < snippet_id.length; i++){
      robot.keyTap("backspace");
    }

    // Print the snippet (accounting for line returns)
    for (var i = 0; i < snippet.length; i++){
      if (String.raw`${snippet[i]}`.charCodeAt(0) == 10){
          robot.keyTap("enter");
      }
      else {
        //console.log("Character: " + String.raw`${snippet[i]}`);
        robot.typeString(snippet[i]);
      }
    }
};

// Module Exports - to access the functions outside of the file.
module.exports.getSnippetsFile = getSnippetsFile;
module.exports.doesSnippetExist = doesSnippetExist;
module.exports.addSnippetToFile = addSnippetToFile;
module.exports.updateSnippet = updateSnippet;
module.exports.removeSnippetFromFile = removeSnippetFromFile;
module.exports.findSnippet = findSnippet;
module.exports.printSnippet = printSnippet;
