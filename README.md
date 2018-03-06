# Texpansion
A text expanding utility for macOS, Windows, and Linux.

## Prerequisites
Texpansion requires Node.js 9.7.1 or higher to run.
 
## Installation
To install Texpansion on your system:
- Clone this [repository](https://github.com/TrevorDBrown/texpansion).
- Navigate to the repository directory.
- Run `npm install`
- Run `node .`

## Usage
To manage snippets, visit [http://localhost:3000/texpansion](http://localhost:3000/texpansion)

To use a snippet:
- Press Ctrl+Alt+Command (macOS), or Ctrl+Alt+Win (Windows, Linux), once to begin listening.
- Enter the snippet ID.
- Press Ctrl+Alt+Command (macOS), or Ctrl+Alt+Win (Windows, Linux), to end listening.
- The snippet ID should be erased and the snippet should be typed.

## Support
As on 3/6/2018, Texpansion has been tested in macOS. It is assumed that Windows and Linux work as well, but I can't verify this until I've tested them.

## Node packages
Texpansion uses the following npm packages:
- [Node.js](https://github.com/nodejs/node)
  - The central backbone of the project.
- [Robot.js](https://github.com/octalmage/robotjs)
  - Allows for the replacement of text.
- [iohook](https://github.com/WilixLead/iohook) 
  - Allows for the interpretation of keystrokes.
- [Express.js] (https://github.com/expressjs/express)
  - Provides the app interface, for adding, removing, and modifying snippets.
- [Opn](https://github.com/sindresorhus/opn)
  - Allows Node.js to start system processes (i.e. open the UI in browser on launch)

## Additional Notes
I'm currently working on a version using Electron, to replace the need for the Express.js server, among other things. Any other improvements, suggestions, etc. are encouraged!

## Thanks
I'd like to thank the developers of Node.js, Robot.js, iohook, Express.js, and opn for developing those respective packages. If not for them, this project would not have been as easy to make.
