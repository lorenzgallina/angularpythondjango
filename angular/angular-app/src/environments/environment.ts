export const environment = {
    production: false,
    apiUrl: 'http://localhost/api',
    auth: {
      clientID: '115aYqVYp4eT0ub9o7NmWLOxQBNzMU9r',
      domain: 'dev-cka8qkl3fog2ukgw.us.auth0.com',
      audience: 'http://djangoangularapi',
      auth0RedirectUri: 'http://localhost:8080/callback', // URL to return to after auth0 login
      auth0ReturnTo: 'http://localhost:8080', // URL to return to after auth0 logout
      scope: 'openid profile'
    }
  };