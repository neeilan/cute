# CUTE
CUTE stands for Computer to Understand, Teach and Experiment. It runs in the browser and consists of the following parts:
- An assembly language and bytecode format
- An 8-bit virtual machine (in practice, it uses Javascript `Number`s rather than e.g `UInt8`, so you'll find words are much wider than this suggests)
- A loader, to place bytecode at any address
- A birds-eye view of memory (with disassembly overlay) and register state that is editable at any point during execution (also, a stepping debugger!)

Try it out: https://neeilan.github.io/cute/

## Create React App documentation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
