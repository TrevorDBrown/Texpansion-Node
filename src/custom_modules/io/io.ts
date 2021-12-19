/*
	Texpansion
	(c)2020-2021 Trevor D. Brown. All rights reserved.

	io.js - provides an interface for listening to I/O (primarily keystrokes).

	Packages used:
	IOHook (https://www.npmjs.com/package/iohook, https://github.com/WilixLead/iohook)
*/

'use strict';
import ioHook = require('iohook');

var userInput: {"listening": boolean; "currentSnippetID": string;} = {
	"listening": false,
	"currentSnippetID": ""
}

// JSON files
var keymap: {keycode: number; key: string;}[] = require('./../../resources/macos_keymap.json');

// Functions
function getKeyValue(keycode: number): string {
	// TODO: reimplement keycode lookup.
	var keymapEntry = keymap.find(i => i.keycode === keycode);

	if (keymapEntry){
		return keymapEntry.key;
	}else{
		return "";
	}
}

var getListeningStatus = function getListeningStatus(){
	return userInput.listening;
}

function resetInput(){
	userInput.listening = false;
	userInput.currentSnippetID = "";
}

ioHook.on("keydown", key => {
	if (userInput["listening"]){
		userInput["currentSnippetID"] += getKeyValue(key.keycode);
		console.log("Key recorded: " + getKeyValue(key.keycode));
	}
});

// Shortcut to enable listening (defaults to CMD+CTRL+ALT)
ioHook.registerShortcut([29, 56, 3675], () => {
	// Toggle Listening
	userInput["listening"] = !userInput["listening"];

	if (!userInput["listening"]){
		console.log('Stopped listening!');
		snippets_server.processSnippetShorthand(userInput["currentSnippetID"]);
		resetInput();
	}else {
		// Now Listening... log to console. (made else condition, since it may be removed later...)
		console.log('Listening for key combinations...');
	}

});

// Start IO Hook
ioHook.start();

module.exports.getListeningStatus = getListeningStatus;
