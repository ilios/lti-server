import { S3Client } from '@aws-sdk/client-s3';
import fetch from 'node-fetch';
import eventToRequest from './lib/eventToRequest.js';
import readSchoolConfig from './lib/readSchoolConfig.js';
import launchDashboard from './lib/launchDashboard.js';
import launchCourseManager from './lib/launchCourseManager.js';
import findIliosUser from './lib/findIliosUser.js';
import createJWT from './lib/createJWT.js';
import ltiRequestValidator from './lib/ltiRequestValidator.js';


//create the client outside of the handler:
//https://github.com/aws/aws-sdk-js-v3?tab=readme-ov-file#best-practices
const s3Client = new S3Client({});

const dashboard = async(event, context, callback) => {
  console.log('Starting generation of dashboard redirect response');
  try {
    const response = await launchDashboard({ event, ltiRequestValidator, s3Client, eventToRequest, readSchoolConfig, fetch, createJWT, findIliosUser });
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

const courseManager = async(event, context, callback) => {
  console.log('Starting generation of dashboard redirect response');
  try {
    const response = await launchCourseManager({ event, ltiRequestValidator, s3Client, eventToRequest, readSchoolConfig, fetch, createJWT, findIliosUser });
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

const payload = (event, context, callback) => {
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

export { dashboard, courseManager, payload};
