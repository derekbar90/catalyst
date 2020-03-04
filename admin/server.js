/* eslint-disable no-console */
const express = require('express');
const next = require('next');
const compression = require('compression');
const LRUCache = require('lru-cache');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const nodeFetch = require('node-fetch');

const session = require("express-session");
// 1 - importing dependencies
const passport = require("passport");
const uid = require('uid-safe');
const OAuth2Strategy = require('passport-oauth2');
const refresh = require('passport-oauth2-refresh')


dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';
const isProd = !isDev;
const ngrok = isDev && process.env.ENABLE_TUNNEL ? require('ngrok') : null;
const router = require('./routes');
const logger = require('./server/logger');

const customHost = process.env.HOST;
const host = customHost || null;
const prettyHost = customHost || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;
const publicEnvFilename = 'public.env';
const subPath = `/${process.env.SUB_PATH}` || '';

const app = next({ dev: isDev });
const handle = app.getRequestHandler();

const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1hour
});

const makeBearerRequest = (url, authorization) => nodeFetch(url, {
  headers: { Authorization: 'bearer ' + authorization }
}).then((res) => res.ok ? res.json() : res.text())
  .then((body) => {
    return typeof body === 'string' ? body : JSON.stringify(body, null, 2)
  })
  .catch(err => console.log(err))

// share public env variables (if not already set)
try {
  if (fs.existsSync(path.resolve(__dirname, publicEnvFilename))) {
    const publicEnv = dotenv.parse(
      fs.readFileSync(path.resolve(__dirname, publicEnvFilename))
    );
    Object.keys(publicEnv).forEach(key => {
      if (!process.env[key]) {
        process.env[key] = publicEnv[key];
      }
    });
  }
} catch (err) {
  // silence is golden
}

const buildId = isProd
  ? fs.readFileSync('./.next/BUILD_ID', 'utf8').toString()
  : null;

/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
const getCacheKey = function getCacheKey(req) {
  return `${req.url}`;
};

const renderAndCache = function renderAndCache(
  req,
  res,
  pagePath,
  queryParams
) {
  const key = getCacheKey(req);

  if (ssrCache.has(key) && !isDev) {
    console.log(`CACHE HIT: ${key}`);
    res.send(ssrCache.get(key));
    return;
  }


  app
    .renderToHTML(req, res, pagePath, queryParams)
    .then(html => {
      // Let's cache this page
      if (!isDev) {
        console.log(`CACHE MISS: ${key}`);
        ssrCache.set(key, html);
      }

      res.send(html);
    })
    .catch(err => {
      app.renderError(err, req, res, pagePath, queryParams);
    });
};

const routerHandler = router.getRequestHandler(
  app,
  ({ req, res, route, query }) => {
    if (!req.isAuthenticated()) {
      req.session.redirectTo = req.url
      res.redirect(`${subPath}/auth`)
      return
    }
    
    renderAndCache(req, res, route.page, query);
  }
);

app.prepare().then(() => {
  const server = express();

  server.use(compression({ threshold: 0 }));
  // server.use(
    // cors({
    //   origin:
    //     prettyHost.indexOf('http') !== -1 ? prettyHost : `http://${prettyHost}}`,
    //     credentials: true
    // })
  // );
  const sessionConfig = {
    secret: uid.sync(18),
    cookie: {
      maxAge: 86400 * 1000 // 24 hours in milliseconds
    },
    resave: false,
    saveUninitialized: true
  };
  server.use(session(sessionConfig));
  server.use(helmet());

  // 3 - configuring Auth0Strategy
  const oAuth2Strategy = new OAuth2Strategy({
      authorizationURL: `https://${process.env.HOST_NAME}/oauth/oauth2/auth`,
      tokenURL: 'http://hydra:4444/oauth2/token',
      clientID: process.env.ADMIN_OAUTH2_CLIENT_ID,
      clientSecret: process.env.ADMIN_OAUTH2_CLIENT_SECRET,
      callbackURL: `https://${process.env.HOST_NAME}${subPath}/callback`,
      state: true,
      scope: ['offline', 'openid']
    },
    async (accessToken, refreshToken, profile, cb) => {
      makeBearerRequest(`http://hydra:4444/userinfo`, accessToken).then(
        res => {
          return cb(null, { accessToken, profile: res })
        }
      );
    }
  );

  // 4 - configuring Passport
  passport.use('oauth2', oAuth2Strategy);

  passport.use('refresh', refresh)

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  // 5 - adding Passport and authentication routes
  server.use(passport.initialize());
  server.use(passport.session());

  server.get(`${subPath}/auth`, passport.authenticate('oauth2'))

  server.get(`${subPath}/callback`, passport.authenticate('oauth2'), (req, res, next) => {
    // After success, redirect to the page we came from originally
    res.redirect(subPath.length === 0 ? '/' : subPath);
  })

  server.get(`${subPath}/logout`, function(req, res){
    req.session.destroy(function (err) {
      req.logout();
      res.redirect(subPath.length === 0 ? '/' : subPath); //Inside a callback… bulletproof!
    });
  });

  server.get(`${subPath}/favicon.ico`, (req, res) =>
    app.serveStatic(req, res, path.resolve('./static/icons/favicon.ico'))
  );

  server.get(`${subPath}/sw.js`, (req, res) =>
    app.serveStatic(req, res, path.resolve('./.next/sw.js'))
  );

  server.get(`${subPath}/manifest.html`, (req, res) =>
    app.serveStatic(req, res, path.resolve('./.next/manifest.html'))
  );

  server.get(`${subPath}/manifest.appcache`, (req, res) =>
    app.serveStatic(req, res, path.resolve('./.next/manifest.appcache'))
  );

  if (isProd) {
    server.get(`${subPath}/_next/-/app.js`, (req, res) =>
      app.serveStatic(req, res, path.resolve('./.next/app.js'))
    );

    const hash = buildId;

    server.get(`${subPath}/_next/${hash}/app.js`, (req, res) =>
      app.serveStatic(req, res, path.resolve('./.next/app.js'))
    );
  }

  server.use(routerHandler);

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, host, err => {
    if (err) {
      return logger.error(err.message);
    }

    if (ngrok) {
      ngrok.connect(
        port,
        (innerErr, url) => {
          if (innerErr) {
            return logger.error(innerErr);
          }
          logger.appStarted(port, prettyHost, url);
        }
      );
    } else {
      logger.appStarted(port, prettyHost);
    }
  });
});
