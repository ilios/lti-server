'use strict';

const lti = require('ims-lti');
const aws = require('aws-sdk');
const fetch = require('node-fetch');
const eventToRequest = require('./lib/eventToRequest');
const readSchoolConfig = require('./lib/readSchoolConfig');
const launchResponse = require('./lib/launchResponse');
const findIliosUser = require('./lib/findIliosUser');
const createJWT = require('./lib/createJWT');

module.exports.dashboard = (event, context, callback) => {
  console.log('Starting generation of dashboard redirect response');
  launchResponse({event, lti, aws, eventToRequest, readSchoolConfig, fetch, createJWT, findIliosUser}).then(response => {
    callback(null, response);
  }).catch(error => {
    console.error(error);
    const response = {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html'
      },
      body: `<html><body><h2>Launch Error:</h2><p>${error}</p></body></html>`
    };
    callback(null, response);
  });
};
