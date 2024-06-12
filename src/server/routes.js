// src/server/routes.js
const { postPredict, getPredictHistories, registerHandler, loginHandler } = require('./handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredict,
    options: {
      payload: {
        allow: 'application/json',
        parse: true,
        maxBytes: 1000000
      }
    }
  },
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler
  },
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return 'Hello, world test!';
    }
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getPredictHistories
  }
];

module.exports = routes;
