# Express & mongoose REST API with cache system Boilerplate in ES6 with Code Coverage
## Overview

This is a boilerplate application for building REST APIs in Node.js using ES6 and Express.js

## Getting Started

Clone the repo

Fix autocrlf(Convert to LF) -- UNIX vs Windows (I am working on Windows)
```js
git config --global core.autocrlf input
```

Install yarn:
```js
npm install -g yarn
```

Install dependencies:
```sh
yarn
```

Start server:
```sh
# Start server
yarn start

# Selectively set DEBUG env var to get logs
DEBUG=cache-rest:* yarn start
```
Refer [debug](https://www.npmjs.com/package/debug) to know how to selectively turn on logs.


Tests:
```sh
# Run tests written in ES6 
yarn test

# Run test along with code coverage
yarn test:coverage

# Run tests on file change
yarn test:watch

# Run tests enforcing code coverage (configured via .istanbul.yml)
yarn test:check-coverage
```

Lint:
```sh
# Lint code with ESLint
yarn lint

# Run lint on any file change
yarn lint:watch
```

Other gulp tasks:
```sh
# Wipe out dist and coverage directory
gulp clean

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

##### Deployment

```sh
# compile to ES5
1. yarn build

# upload dist/ to your server
2. scp -rp dist/ user@dest:/path

# install production dependencies only
3. yarn --production

# Use any process manager to start your services
4. pm2 start dist/index.js
```

## License
This project is licensed under the [MIT License](https://github.com/KunalKapadia/cache-rest/blob/master/LICENSE)

## Meta

