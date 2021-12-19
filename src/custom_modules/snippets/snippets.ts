/*
  Texpansion
  (c)2020-2021 Trevor D. Brown. All rights reserved.

  snippet_server.js - provides an interface for adding, removing, modifying, and printing user snippets.

  Uses Robots.js to perform replacements on text.

  Packages used:
  RobotJS (http://robotjs.io/, https://www.npmjs.com/package/robotjs, https://github.com/octalmage/robotjs)
*/

// Required packages
import fs = require('fs');         // Node.js File System
const path = require('path');     // Node.js Path
const robot = require('robotjs'); // Robot.js

/// <reference path="./../../app.ts" />


// getSnippetsFile() - retrieves the entire snippets file from disk.
function getSnippetsFile(): string{
	return JSON.stringify(fs.readFileSync(path.join(__dirname, "/../../private/snippets.json"), 'utf-8'));
};

// doesSnippetExist(snippet_id) - checks a provided snippet ID against the snippets file.
// var doesSnippetExist = function doesSnippetExist(snippet_id){
//   var current_snippet = findSnippet(snippet_id);

//   if (current_snippet != ""){
//     return true;
//   }
//   else{
//     return false;
//   }

// };

// findSnippet(snippetShorthand) - finds a particular snippet in the snippet file.
var findSnippet = function findSnippet(snippetShorthand: string): {snippetShorthand: string; snippetFound: boolean; snippetContent?: string}{
	var snippetsFile: {snippetShorthand: string; snippetContent: string}[] = JSON.parse(getSnippetsFile());
	var response: {snippetShorthand: string; snippetFound: boolean; snippetContent?: string} = {
		snippetShorthand: snippetShorthand,
		snippetFound: false
	};

	var snippetEntry = snippetsFile.find(i => i.snippetShorthand === snippetShorthand);

	if (snippetEntry){
		response.snippetContent = snippetEntry.snippetContent;
	}

	return response;
};

// // addSnippetToFile(new_snippet) - adds the provided snippet to the snippets file.
// var addSnippetToFile = function AddSnippetToFile(new_snippet){
//   fs.readFile(path.join(__dirname + '/../../content', "snippets.json"), function readFileCallback(err, data) {
//     if (err){
//       console.log(err);
//     }
//     else{
//       var obj = JSON.parse(data);
//       obj.push(new_snippet);
//       //console.log(obj);
//       var json = JSON.stringify(obj);
//       fs.writeFileSync(path.join(__dirname + '/../../content', "snippets.json"), json);
//       console.log(new_snippet.id + " has been added.");
//     }
//   });
// };

// // removeSnippetFromFile(snippet_id) - removes a specified snippet ID from the snippets file.
// var removeSnippetFromFile = function removeSnippetFromFile(snippet_id){
//   fs.readFile(path.join(__dirname + '/../../content', "snippets.json"), function readFileCallback(err, data) {
//     if (err){
//       console.log(err);
//     }
//     else{
//       var obj = JSON.parse(data);
//       var filtered_snippets = obj.filter(function(item) {
//          return item.id !== snippet_id;
//       });
//       var json = JSON.stringify(filtered_snippets);
//       fs.writeFileSync(path.join(__dirname + '/../../content', "snippets.json"), json);
//       console.log(snippet_id + " has been removed.");
//     }
//   });
// };

// var updateSnippet = function updateSnippet(snippet){

//   var snippet_id = snippet.id;
//   var snippet_content = snippet.content;

//   // Verify removal
//   var check_snippet = doesSnippetExist(snippet_id);

//     // Add updated snippet
//     if (check_snippet == true){
//       fs.readFile(path.join(__dirname + '/../../content', "snippets.json"), function readFileCallback(err, data) {
//         if (err){
//           console.log(err);
//         }
//         else{
//           var obj = JSON.parse(data);

//           var theSnippet = "";

//           for (var i = 0; i < obj.length; i++){
//             if (obj[i].id == snippet_id){
//               obj[i].content = snippet_content;
//             }
//           }

//           var json = JSON.stringify(obj);
//           fs.writeFileSync(path.join(__dirname + '/../../content', "snippets.json"), json);
//           console.log(snippet_id + " has been updated.");
//         }
//       });
//     }
//     else{
//       console.log("Error: original snippet could not be updated!");
//       return false;
//     }
// };

// printSnippet(snippet_id) - replaces the snippet id with the snippet on the user's current application.
var printSnippet = function printSnippet(snippetShorthand: string, snippetContent: string): boolean {
	var success = true;

	// Replace the ID wherever it was typed.
    for (var i = 0; i < snippetShorthand.length; i++){
      robot.keyTap("backspace");
    }

    // Print the snippet (accounting for line returns)
    for (var i = 0; i < snippetContent.length; i++){
      if (String.raw`${snippetContent[i]}`.charCodeAt(0) == 10){
          robot.keyTap("enter");
      }
      else {
        robot.typeString(snippetContent[i]);
      }
	}
	
	return success;
};

const processSnippetShorthand = function processSnippetShorthand(userInputSnippetShorthand: string): void{
	var snippet: {snippetShorthand: string; snippetFound: boolean; snippetContent?: string} = findSnippet(userInputSnippetShorthand);

	if (snippet.snippetFound && snippet.snippetContent){
		printSnippet(snippet.snippetShorthand, snippet.snippetContent);
	}else{
		console.log("Error - snippet not found.");
	}

}

// Module Exports - to access the functions outside of the file.

//module.exports.addSnippetToFile = addSnippetToFile;
//module.exports.updateSnippet = updateSnippet;
//module.exports.removeSnippetFromFile = removeSnippetFromFile;

module.exports.processSnippetShorthand = processSnippetShorthand;
module.exports.findSnippet = findSnippet;