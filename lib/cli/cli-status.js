'use strict';

const request = require('request');

request({
  method: 'GET',
  uri: 'http://localhost:6366/',
}, (err, res) => {
  if (err) {
    console.log(err);
  }

  //  Need sync progress from bcoin
  let json;
  try {
    json = JSON.parse(res.body);
  } catch (e) {
    throw new Error(e);
  }

  console.log(json);
})