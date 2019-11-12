
![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)

# Project Catalyst

Project Catalyst is a microservices framework which allows you to create and deploy secured base application development tools within 10 minutes.

1.0 Goals:
 - [x] User Management
	 - [x] User Registration
	 - [x] User Login
	 - [ ] Account Verify
	 - [ ] Password Reset
	 - [ ] Forgot Username
	 - [x] Global User Registration Event
 - [x] Database Setup
	 - [x] Local dev support container
	 - [x] Configurable db adapter
	 - [x] Migrations support
	 - [x] Bootstrap on service at launch
 - [ ] Metrics Services
	 - [x] Prometheus setup
	 - [x]  Grafana setup at /grafana
	 - [x]  Metrics config setup for services
		 - [ ] Add to template generation
 - [ ] Tracing Services
	 - [x] Jaeger setup at /jaeger
	 - [x] Tracing config setup for services
		 - [ ] Add to template generation
 - [x] SSL Support
	 - [x]  LetsEncrypt Setup
	 - [x]  Traefik Setup at :8080/dashboard
	 - [ ]  Domain setup instruction in README.md
 - [x] Redis Cache
 - [x] API Gateway
	 - [x] REST
	 - [x]  GraphQL
 - [x] OAuth 2.0
   - [x] implicit flow
   - [x] consent flow
   - [x] auth code flow
 - [ ] ORY Keto
 - [ ] Email Suport
   - [x] Service setup w/ mailgun provider 
   - [x] Templating
   - [x] User registration event consumption for welcome email

1.1 Goals:
  - [ ] Kubernetes configuation
  - [ ] Helm charts for each base service
  - [ ] Jenkins X Support

1.2 Gaols: 
  - [ ] Social Login
  - [ ] Lerna multi repo support
  - [ ] One time password support
	
## Initial setup

  

Run `npm i` first to setup any global dev tools which are used. These are defined in the `package.json` which is at the root of the project.

  

## Ports Configs

  

These can also be viewed by looking at the `docker-compose.yaml` file in the project root. Any exposed service is then label within this file for Traefik configuration

  

|Port |Service |

|----------------|-------------------------------|

|3000 |Traefik Main |

|3001 |Traefik Admin |

|4444 |Hydra Main |

## `Required Setup Step: .ENV Config Setup`

  

If you have not setup a .env file you must create one at the root of the project.

  

Example:

  
```
HOST_NAME={YOUR_HOSTNAME}
POSTGRES_HOST==#############
POSTGRES_USER==#############
POSTGRES_PORT=5432
POSTGRES_PASSWORD==#############
POSTGRES_DB=postgres
ADMIN_OAUTH2_CLIENT_ID==############# -- !!CHANGE THIS VALUE!!
ADMIN_OAUTH2_CLIENT_SECRET=############# -- !!CHANGE THIS VALUE!!
EMAIL_API_KEY==############# !! mailgun specific, use nodemailer config for help !!
EMAIL_DOMAIN==############# !! mailgun specific, use nodemailer config for help !!
EMAIL_PROVIDER==#############
```

#### Notes

  

`HOST_NAME`: hostname of choice to have the stack run on, if you do this: make sure that LetsEncrypt can do a hostname validation, certbot can be run via nginx if you need it but traefik will auto setup the SSL cert and hold it on a volumes in `traefik/acme.json`

## Global Make Commands
- `make start-stack` - build and launch all containers
- `make start-stack-metrics` - build and launch all containers with metrics
  - Tip: You need to restart any running services with a updated docker-compose.env where METRICS_ENABLED=true
- `make stop-stack` - stop all launched containers
- `make dbash SVC=SERVICE_NAME` - takes `SVC` arg and creates a bash command line inside the running service
- `make dlog SVC=SERVICE_NAME` - takes `SVC` arg and logs with following and tails the last 400 lines of a service
- `start-code-server` - create web served version of VS Code, helpful for working on an iPad (iOS 13 preferrable)

## Global NPM Scripts

  

### Hygen Specific:

- `npm run hygen` - This is a link to the executable bin/script for the hygen generator library.

- `npm run hygen generator help` - View generator help

- `npm run hygen generator new [name]` - Create new generator

- `npm run hygen generator new-with-prompt [name]`: Create new generator w/ prompt

### Project Specific:

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

-- `Code Generator`: [Hygen](https://www.hygen.io/)

-- `Router`: [Traefik](https://docs.traefik.io/)

-- `Containers`: [Docker](https://docker.com/)

-- `Microservice Framework`: [Moleculer](http://moleculer.services/)

-- `Message Bus`: [NATS](https://nats-io.github.io/docs/)

-- `Database`: [Postgresql](https://www.postgresql.org/)

-- `Metrics`: [Prometheus](https://prometheus.io/)

-- `Tracing`: [Jaeger](https://www.jaegertracing.io/)

-- `OAuth2`: [Hydra](https://www.ory.sh/hydra)

-- `GraphQL`: [GraphQL](https://graphql.org/)

-- `PassportJS`: [PassportJS](https://passportjs.org)