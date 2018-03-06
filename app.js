/*
  Texpansion
  (c)2018 Trevor D. Brown.

  app.js - the primary juncture for Texpansion modules.
*/

// Console output (at launch)
console.log("Texpansion\n(c)2018 Trevor D. Brown.\nMIT License\n");
console.log("Texpansion was made possible by the following software/Node.js packages:");
console.log("Node.js \(https://nodejs.org/en/\)\nExpress.js \(https://www.npmjs.com/package/express, https://github.com/expressjs/express\)\nIOHook \(https://www.npmjs.com/package/iohook, https://github.com/WilixLead/iohook\)\nRobot.js \(http://robotjs.io/, https://www.npmjs.com/package/robotjs, https://github.com/octalmage/robotjs\)\nOpn \(https://www.npmjs.com/package/opn, https://github.com/sindresorhus/opn\)");
console.log("Please leave this terminal/command prompt window open.");

/* Required Components */
// User Interface Module
require('./assets/core/ui/ui_server.js');
// Snippet Server Module
require('./assets/core/snippets/snippet_server.js');
// Keystroke Server Module
require('./assets/core/io/keystroke_server.js');

/* Optional Components */
// None available, at the moment.
