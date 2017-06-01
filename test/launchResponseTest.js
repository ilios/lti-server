'use strict';

const launchResponse = require('../lib/launchResponse');
const assert = require('assert');
describe('Launch Response handler works', async function() {
  it('sends a redirect with all the right data', async function() {
    const Provider = function(){
      this.valid_request = (request, callback) => {
        //error, isValid
        callback(null, true);
      };
    };
    const lti = { Provider };
    const eventToRequest = () => {
      return {
        protocol: null,
        url: null,
        body: {
          oauth_consumer_key: null
        },
        method: null,
        headers: {
          host: null
        }
      };
    };
    const readSchoolConfig = async () => {
      return {
        apiServer: null,
        apiNameSpace: null,
        ltiUserId: null,
        secret: null,
        ltiPostField: null,
        iliosMatchField: null
      };
    };
    const event = null;
    const aws  = null;
    const fetch  = null;
    const findIliosUser  = () => Promise.resolve(24);
    const createJWT  = () => 'token';
    const response = await launchResponse({event, lti, aws, eventToRequest, readSchoolConfig, findIliosUser, fetch, createJWT});

    assert.ok('statusCode' in response);
    assert.equal(response.statusCode, 302);
    assert.ok('body' in response);
    assert.equal(response.body, '');
    assert.ok('headers' in response);
    assert.ok('Location' in response.headers);
    assert.equal(response.headers.Location, 'https://d4jps70wc8ppm.cloudfront.net/login/token');
  });
});
