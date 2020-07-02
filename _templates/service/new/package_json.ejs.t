---
to: <%=h.changeCase.snakeCase(name)%>/package.json
---

{
  "name": "atom",
  "version": "1.0.0",
  "description": "My Moleculer microservices project",
  "scripts": {
    "build": "tsc",
    "dev": "npm run nodemon & npm run start-service",
    "start-service": "cross-var node --inspect=0.0.0.0:$NODE_INSPECT_PORT -r ts-node/register ./node_modules/moleculer/bin/moleculer-runner.js --hot --config moleculer.config.ts services/*.service.ts",
    "nodemon": "./node_modules/nodemon/bin/nodemon.js --config nodemon.json --exec npm run build",
    "cli": "export MOL_METRICS__ENABLED=false && ./node_modules/moleculer/bin/moleculer-runner.js --config=moleculer.config.js --repl",
    "start": "moleculer-runner services",
    "ci": "jest --watchAll",
    "test": "jest --coverage",
    "lint": "tslint -p tsconfig.json",
    "dc:up": "docker-compose up --build -d",
    "dc:down": "docker-compose down",
<% if(locals.shouldAddDb){ -%>
    "sequelize": "sequelize"
<% } -%>
  },
  "keywords": [
    "microservices",
    "moleculer"
  ],
  "author": "",
  "devDependencies": {
    "@types/bluebird": "^3.5.30",
    "@types/jest": "^23.1.3",
    "@types/node": "^10.17.17",
    "@types/validator": "^12.0.1",
    "@types/node-fetch": "^2.5.5",
    "cross-var": "^1.1.0",
    "jest": "^25.1.0",
    "jest-cli": "^25.1.0",
    "moleculer-repl": "^0.6.3",
    "nodemon": "^2.0.2",
    "ts-jest": "^25.2.1",
    "ts-node": "^8.8.1",
    "tslint": "6.0.0",
    "typescript": "^3.8.3"
  },
  "dependencies": {
<% if(locals.shouldAddDb){ -%>
    "@thesatoshicompany/moleculer-db-graphql": "^1.0.6",
    "@thesatoshicompany/moleculer-keto": "^1.1.2",
<% } -%>
    "change-case": "4.1.1",
    "ioredis": "^4.16.0",
    "moleculer": "0.14.6",
    "node-fetch": "^2.6.0",
    "nats": "^1.4.2",
<% if(locals.shouldExposeOnPort){ -%>
    "moleculer-web": "^0.9.1",
<% } -%>
<% if(locals.shouldAddDb){ -%>
    "moleculer-db": "^0.8.6",
    "moleculer-db-adapter-sequelize": "^0.2.6",
    "pg": "^7.18.2",
    "pg-hstore": "2.3.3",
    "sequelize": "^5.21.5",
    "sequelize-cli": "^5.5.1",
<% } -%>
    "protobufjs": "^6.8.9",
    "redlock": "^4.1.0",
    "jaeger-client": "^3.17.1"
  },
  "engines": {
    "node": ">= 10.x.x"
  },
  "jest": {
    "coverageDirectory": "<rootDir>/coverage",
    "testEnvironment": "node",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "testMatch": [
      "**/*.spec.(ts|js)"
    ],
    "coveragePathIgnorePatterns": [
      "<rootDir>/moleculer.config.ts",
      "<rootDir>/node_modules/"
    ],
    "globals": {
      "ts-jest": {
        "tsConfig": "tsconfig.json"
      }
    }
  }
}
