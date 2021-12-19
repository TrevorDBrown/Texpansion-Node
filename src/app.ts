/*
  Texpansion
  (c)2020-2021 Trevor D. Brown. All rights reserved.

  app.js - the primary for Texpansion modules.
*/

// Console output (at launch)
console.log("Texpansion\n(c)2020-2021 Trevor D. Brown.\nDistributed with MIT License.\n");
console.log("Texpansion was made possible by the following software/Node.js packages:");
console.log("Node.js \(https://nodejs.org/en/\)\nExpress.js \(https://www.npmjs.com/package/express, https://github.com/expressjs/express\)\nIOHook \(https://www.npmjs.com/package/iohook, https://github.com/WilixLead/iohook\)\nRobot.js \(http://robotjs.io/, https://www.npmjs.com/package/robotjs, https://github.com/octalmage/robotjs\)\nOpn \(https://www.npmjs.com/package/opn, https://github.com/sindresorhus/opn\)");
console.log("Please leave this terminal/command prompt window open.");

/* Required Components */
// User Interface Module
const ui_server = require('./custom_modules/ui/ui');
// Snippet Server Module
const snippets_server = require('./custom_modules/snippets/snippets');
// Keystroke Server Module
const io_server = require('./custom_modules/io/io');
