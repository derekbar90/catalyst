[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)]
# atom

## Initial setup

Run `npm i` first to setup any global dev tools which are used. These are defined in the `package.json` which is at the root of the project. 

## Ports Configs

These can also be viewed by looking at the 	`docker-compose.yaml` file in the project root. Any exposed service is then label within this file for Traefik configuration

|Port            |Service                        |
|----------------|-------------------------------|
|3000 			 |Traefik Main                   |
|3001            |Traefik Admin 				 |
|4444            |Hydra Main 				     |
  
## `Required Setup Step: .ENV Config Setup`

If you have not setup a .env file you must create one at the root of the project.

Example:

	HOST_NAME=https://{YOUR_HOSTNAME}

#### Notes	

`HOST_NAME`: hostname of choice to have the stack run on, if you do this: make sure that LetsEncrypt can do a hostname validation, certbot can be run via nginx if you need it but traefik will auto setup the SSL cert and hold it on a volumes in `traefik/acme.json`

## Global NPM Scripts

#### Hygen Specific:
- `npm run hygen` - This is a link to the executable bin/script for the hygen generator library. 
- `npm run hygen generator help` - View generator help
- `npm run hygen generator new [name]` - Create new generator
- `npm run hygen generator new-with-prompt [name]`: Create new generator w/ prompt

## Generator Notes

#### Hygen Specific:
- `npm run hygen` - This is a link to the executable bin/script for the hygen generator library. 
- `npm run hygen generator help` - View generator help
- `npm run hygen generator new [name]` - Create new generator
- `npm run hygen generator new-with-prompt [name]`: Create new generator w/ prompt
---
#### Project Specific:
- `npm run hygen service new`: Create new service

## Per Service NPM scripts

- `npm run dev` - Start development mode (load all services locally with hot-reload & REPL)

- `npm run build`- Uses typescript to transpile service to javascript

- `npm start` - Start production mode (set `SERVICES` env variable to load certain services) (previous build needed)

- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script

- `npm run lint` - Run TSLint

- `npm run ci` - Run continuous test mode with watching

- `npm test` - Run tests & generate coverage report

- `npm run dc:up`: Start the stack with Docker Compose

- `npm run dc:down`: Stop the stack with Docker Compose

## Links to main libraries to understand

`Code Generator`: [Hygen](https://www.hygen.io/)
`Router`: [Traefik](https://docs.traefik.io/)
`Containers`: [Docker](https://docker.com/)
`Microservice Framework`: [Moleculer](http://moleculer.services/)
`Message Bus`: [NATS](https://nats-io.github.io/docs/)
`Database`:  [Postgresql](https://www.postgresql.org/)