'use strict';

const readSchoolConfig = require('../lib/readSchoolConfig');
const fs = require('fs');
const assert = require('assert');

describe('Read the configuration for a school', function() {
  const json = fs.readFileSync(`${__dirname}/sample-config.json`);
  const S3 = function(){
    this.getObject = () => {
      return {
        async promise(){
          return {
            Body: json
          };
        }
      };
    };
  };
  const aws = { S3 };
  it('reads the first school correctly', async function() {
    const result = await readSchoolConfig('demo-school-config', aws);
    assert.ok('apiServer' in result, 'result contains apiServer');
    assert.equal(result.apiServer, 'https://test-ilios.com', 'apiServer is correct');
    assert.ok('apiNameSpace' in result, 'result contains apiNameSpace');
    assert.equal(result.apiNameSpace, '/test/api/v1', 'apiNameSpace is correct');
    assert.ok('ltiUserId' in result, 'result contains ltiUserId');
    assert.equal(result.ltiUserId, 33, 'ltiUserId is correct');
    assert.ok('consumerSecret' in result, 'result contains consumerSecret');
    assert.equal(result.consumerSecret, 'secret123', 'consumerSecret is correct');
    assert.ok('iliosSecret' in result, 'result contains iliosSecret');
    assert.equal(result.iliosSecret, 'secret123', 'iliosSecret is correct');
    assert.ok('ltiPostField' in result, 'result contains ltiPostField');
    assert.equal(result.ltiPostField, 'ext_user_username', 'ltiPostField is correct');
    assert.ok('iliosMatchField' in result, 'result contains iliosMatchField');
    assert.equal(result.iliosMatchField, 'authentication-username', 'iliosMatchField is correct');
  });
  it('reads the second school correctly', async function() {
    const result = await readSchoolConfig('second-school-config', aws);
    assert.ok('apiServer' in result, 'result contains apiServer');
    assert.equal(result.apiServer, 'https://second-test-ilios.com', 'apiServer is correct');
    assert.ok('apiNameSpace' in result, 'result contains apiNameSpace');
    assert.equal(result.apiNameSpace, '/api/v1', 'apiNameSpace is correct');
    assert.ok('ltiUserId' in result, 'result contains ltiUserId');
    assert.equal(result.ltiUserId, 11, 'ltiUserId is correct');
    assert.ok('consumerSecret' in result, 'result contains consumerSecret');
    assert.equal(result.consumerSecret, 'secret456!', 'consumerSecret is correct');
    assert.ok('iliosSecret' in result, 'result contains iliosSecret');
    assert.equal(result.iliosSecret, 'abcd', 'iliosSecret is correct');
    assert.ok('ltiPostField' in result, 'result contains ltiPostField');
    assert.equal(result.ltiPostField, 'ext_user_username', 'ltiPostField is correct');
    assert.ok('iliosMatchField' in result, 'result contains iliosMatchField');
    assert.equal(result.iliosMatchField, 'authentication-username', 'iliosMatchField is correct');
  });
  it('dies well when a bad config is requested', async function() {
    try {
      await readSchoolConfig('bad-school-config', aws);
    } catch(e) {
      assert.equal(e, 'The Consumer Key "bad-school-config" is not known to Ilios. Please contact support@iliosproject.org to set it up.');
    }
  });
});
