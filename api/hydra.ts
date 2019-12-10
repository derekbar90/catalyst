
var nodeFetch = require('node-fetch')
var querystring = require('querystring');

var hydraUrl = process.env.HYDRA_ADMIN_URL
var mockTlsTermination = {}

// A little helper that takes type (can be "login" or "consent") and a challenge and returns the response from ORY Hydra.
function get(flow: string, challenge: string) {
  const url = new URL('/oauth2/auth/requests/' + flow, hydraUrl)
  url.search = querystring.stringify({[flow + '_challenge']: challenge})
  return nodeFetch(
    url.toString(),
    {
      method: 'GET',
      headers: {
        ...mockTlsTermination
      }
    }
    )
    .then(function (res: any) {
      if (res.status < 200 || res.status > 302) {
        // This will handle any errors that aren't network related (network related errors are handled automatically)
        return res.json().then(function (body: any) {
          console.error('An error occurred while making a HTTP request: ', body)
          return Promise.reject(new Error(body.error.message))
        })
      }

      return res.json();
    });
}

// A little helper that takes type (can be "login" or "consent"), the action (can be "accept" or "reject") and a challenge and returns the response from ORY Hydra.
function put(flow: string, action: string, challenge: string, body: string | object) {
  const url = new URL('/oauth2/auth/requests/' + flow + '/' + action, hydraUrl)
  url.search = querystring.stringify({[flow + '_challenge']: challenge})
  return nodeFetch(
    // Joins process.env.HYDRA_ADMIN_URL with the request path
    url.toString(),
    {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...mockTlsTermination
      }
    }
  )
    .then(function (res: any) {
      if (res.status < 200 || res.status > 302) {
        // This will handle any errors that aren't network related (network related errors are handled automatically)
        return res.json().then(function (body: any) {
          console.error('An error occurred while making a HTTP request: ', body)
          return Promise.reject(new Error(body.error.message))
        })
      }

      return res.json();
    });
}

// A little helper that takes type (can be "login" or "consent") and a challenge and returns the response from ORY Hydra.
function introspect(access_token: string) {
  const url = new URL('/oauth2/introspect/', hydraUrl)

  const params = new URLSearchParams();
  params.append('token', access_token);

  const request = nodeFetch(
    url,
    {
      method: 'post',
      body: params
    });
  return request
    .then(function (res: any) {
      if (res.status < 200 || res.status > 302) {
        // This will handle any errors that aren't network related (network related errors are handled automatically)
        return res.json().then(function (body: any) {
          console.error('An error occurred while making a HTTP request: ', body)
          return Promise.reject(new Error(body.error.message))
        })
      }

      return res.json();
    });
}

export const hydra = {
  // nodeFetches information on a login request.
  getLoginRequest: function (challenge: string) {
    return get('login', challenge);
  },
  // Accepts a login request.
  acceptLoginRequest: function (challenge: string, body: string | object) {
    return put('login', 'accept', challenge, body);
  },
  // Rejects a login request.
  rejectLoginRequest: function (challenge: string, body: string | object) {
    return put('login', 'reject', challenge, body);
  },
  // nodeFetches information on a consent request.
  getConsentRequest: function (challenge: string) {
    return get('consent', challenge);
  },
  // Accepts a consent request.
  acceptConsentRequest: function (challenge: string, body: string | object) {
    return put('consent', 'accept', challenge, body);
  },
  // Rejects a consent request.
  rejectConsentRequest: function (challenge: string, body: string | object) {
    return put('consent', 'reject', challenge, body);
  },
  // nodeFetches information on a logout request.
  getLogoutRequest: function (challenge: string) {
    return get('logout', challenge);
  },
  // Accepts a logout request.
  acceptLogoutRequest: function (challenge: string) {
    return put('logout', 'accept', challenge, {});
  },
  // Reject a logout request.
  rejectLogoutRequest: function (challenge: string) {
    return put('logout', 'reject', challenge, {});
  },
  // Reject a logout request.
  checkToken: function (accessToken: string) {
    return introspect(accessToken);
  },
};