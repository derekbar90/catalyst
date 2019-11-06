const routes = require('next-routes')();

//
// Because of awesome Next.js, You don't need to add routes for all pages.
// Every file on Pages folder basically has route as they named.
// (index.js => /, about.js => /about, ...etc.)
//
// If you want to change url (for SEO or put different path), please add your route below.
// for more info, please look at https://github.com/Sly777/ran/blob/master/docs/Routing.md
//

const getPathFromRoot = path => `/admin${path}`;

// Please add your route between of comments
//
// ------------ ROUTES ---------------
// @RANStartRoutes
routes.add('index', getPathFromRoot(''));
routes.add('details', getPathFromRoot('/details/:postId/:postTitle'));
routes.add('create', getPathFromRoot('/create_post'));
routes.add('signin', getPathFromRoot('/sign_in'));
routes.add('signup', getPathFromRoot('/sign_up'));
routes.add('logout', getPathFromRoot('/logout'));
// @RANEndRoutes
// ------------ ROUTES ---------------
//
//

module.exports = routes;
