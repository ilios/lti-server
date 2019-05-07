'use strict';

const aws = require('aws-sdk');
const fetch = require('node-fetch');
const eventToRequest = require('./lib/eventToRequest');
const readSchoolConfig = require('./lib/readSchoolConfig');
const launchDashboard = require('./lib/launchDashboard');
const launchCourseManager = require('./lib/launchCourseManager');
const findIliosUser = require('./lib/findIliosUser');
const createJWT = require('./lib/createJWT');
const ltiRequestValidator = require('./lib/ltiRequestValidator');

module.exports.dashboard = async(event, context, callback) => {
  console.log('Starting generation of dashboard redirect response');
  try {
    const response = await launchDashboard({ event, ltiRequestValidator, aws, eventToRequest, readSchoolConfig, fetch, createJWT, findIliosUser });
    callback(null, response);
  } catch (error) {
    console.error(error);
    const response = {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html'
      },
      body: `<html><body><h2>Launch Error:</h2><p>${error}</p></body></html>`
    };
    callback(null, response);
  }
};

module.exports.courseManager = async(event, context, callback) => {
  console.log('Starting generation of dashboard redirect response');
  try {
    const response = await launchCourseManager({ event, ltiRequestValidator, aws, eventToRequest, readSchoolConfig, fetch, createJWT, findIliosUser });
    callback(null, response);
  } catch (error) {
    console.error(error);
    const response = {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html'
      },
      body: `<html><body><h2>Launch Error:</h2><p>${error}</p></body></html>`
    };
    callback(null, response);
  }
};

module.exports.payload = (event, context, callback) => {
  console.log('Starting generation of payload analysis');
  const request = eventToRequest(event);
  console.log('Request Data:', request);
  const { protocol, url, body, method, headers } = request;
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: `<html>
      <body>
        <h2>LTI POST Payload:</h2>
        <p><strong>Protocol:</strong> ${protocol}</p>
        <p><strong>URL:</strong> ${url}</p>
        <p><strong>Body:</strong> ${JSON.stringify(body)}</p>
        <p><strong>Method:</strong> ${method}</p>
        <p><strong>Host Headers:</strong> ${headers.host}</p>
      </body>
    </html>`
  };
  callback(null, response);
  console.log('Done generating payload analysis');
};
