[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# atom

## NPM scripts
- `npm run dev` - Start development mode (load all services locally with hot-reload & REPL)
- `npm run build`- Uses typescript to transpile service to javascript
- `npm start` - Start production mode (set `SERVICES` env variable to load certain services) (previous build needed)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint` - Run TSLint
- `npm run ci` - Run continuous test mode with watching
- `npm test` - Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose

# # Ports
Traefik Main: 3000
Traefik Admin UI: 3001


# # .ENV CONFIG

# # # If you have not setup a .env file you must do so

HOST_NAME: hostname of choice to have the stack run on, if you do this: make sure that LetsEncrypt can do a hostname validation, certbot can be run via nginx if you need it but traefik will auto setup the SSL cert and hold it on a volumes in `traefik/acme.json`