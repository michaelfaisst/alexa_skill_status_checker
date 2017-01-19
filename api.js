'use strict';
const http = require('http');
 
module.exports = url => {
  const options = {
    host: url,
    method: 'HEAD',
    path: '/'
  };
  const req = http.request(options);
  req.end();
  const promise = new Promise((resolve, reject) => {
    let connected = false;
    req.on('response', res => {
      connected = res.statusCode < 500;
      resolve(connected);
    });
 
    req.on('error', err => {
      reject(err);
    });
  });
  return promise;
};