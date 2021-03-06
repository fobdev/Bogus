# The Bogue Project: Discord Bot Client
## Motivation
A automation service for the Discord Client, with music support for voice channels and useful commands that are only possible in a bot.

## Infrastructure
 - Cloud Server: [Heroku](https://heroku.com)
 - Music Player: [discord-player](https://www.npmjs.com/package/discord-player)
 - API: [Discord.JS](https://discord.js.org/)

## Local Build Requirements
- [Typescript](https://www.typescriptlang.org/)
- [Node.JS v16+](https://nodejs.org/en/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [A Discord Bot Application](https://discord.com/developers/)

## Local Build Instructions
 - Clone the project: ``git clone https://github.com/fobdev/Bogus.git``
 - Move to the project folder: ``cd Bogus``
 - Install dependencies: ``yarn install``
 - Open the project in [VS Code](https://code.visualstudio.com/): ``code .``
 - Edit the ``.env`` with the listed variables.
 - Run the local client in dev mode with Typescript: ``yarn run dev``
