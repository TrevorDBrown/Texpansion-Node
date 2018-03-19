/*
  Texpansion
  (c)2018 Trevor D. Brown.

  keystroke_server.js - provides an interface for listening to keystrokes

  Packages used:
  IOHook (https://www.npmjs.com/package/iohook, https://github.com/WilixLead/iohook)
*/

// Other JS files and npm packages
'use strict';
const io = require('iohook');
const snippet_server = require('./../snippets/snippet_server.js');

// JSON files
var keymap = require('./mac_keymap.json');  // Keymap file

// Global variables
var listening_active = false;
var current_snippet_id = "";

io.on("keydown", key => {
  if (listening_active == true){
    var keyExists = validateKey(key.keycode);
    if (keyExists == true){
      var current_character = convertKeyCodeToValue(key.keycode);
      current_snippet_id += current_character;
    }
  }
});

// Shortcut to enable listening
let id = io.registerShortcut([29, 56, 3675], (keys) => {
  if (listening_active == false){
    listening_active = true;
    console.log('Listening for key combinations...');
  }
  else{
    listening_active = false;
    console.log('Stopped listening!');

    if (current_snippet_id != ""){
      console.log("Input is:", current_snippet_id);

      if (snippet_server.doesSnippetExist(current_snippet_id) == true){
        snippet_server.printSnippet(current_snippet_id);
      }
      else{
        console.log("Error: Snippet does not exist!")
      }


    }
    else{
      console.log("Error: ID is blank!");
    }

    clearID();
  }
});


function validateKey(keycode){
  return _isContains(keymap, keycode);
}

function _isContains(json, value) {
    let contains = false;
    Object.keys(json).some(key => {
        contains = typeof json[key] === 'object' ? _isContains(json[key], value) : json[key] === value;
         return contains;
    });
    return contains;
 }

 function convertKeyCodeToValue(keycode){
   var keyvalue = "";

   for (var i = 0; i < keymap.length; i++){
     if (keymap[i].keycode == keycode){
       keyvalue = keymap[i].key;
     }
   }

   return keyvalue;
 }

var getToggleStatus = (function getToggleStatus(){
  return listening_active;
});

 function clearID(){
   current_snippet_id = "";
 }

// Start IO Hook
io.start();

module.exports.getToggleStatus = getToggleStatus;
