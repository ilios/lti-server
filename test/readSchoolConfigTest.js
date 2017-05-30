'use strict';

const readSchoolConfig = require('../lib/readSchoolConfig');
const assert = require('assert');
describe('Read the configuration for a school', function() {
  const obj = require('./sample-config.json');
  it('reads the first school correctly', function() {
    const result = readSchoolConfig('demo-school-config', obj);
    assert.ok('apiServer' in result, 'result contains apiServer');
    assert.equal(result.apiServer, 'https://test-ilios.com', 'apiServer is correct');
    assert.ok('apiNameSpace' in result, 'result contains apiNameSpace');
    assert.equal(result.apiNameSpace, '/test/api/v1', 'apiNameSpace is correct');
    assert.ok('ltiUserId' in result, 'result contains ltiUserId');
    assert.equal(result.ltiUserId, 33, 'ltiUserId is correct');
    assert.ok('secret' in result, 'result contains secret');
    assert.equal(result.secret, 'secret123', 'secret is correct');
    assert.ok('ltiPostField' in result, 'result contains ltiPostField');
    assert.equal(result.ltiPostField, 'ext_user_username', 'ltiPostField is correct');
    assert.ok('iliosMatchField' in result, 'result contains iliosMatchField');
    assert.equal(result.iliosMatchField, 'authentication-username', 'iliosMatchField is correct');
  });
  it('reads the second school correctly', function() {
    const result = readSchoolConfig('second-school-config', obj);
    assert.ok('apiServer' in result, 'result contains apiServer');
    assert.equal(result.apiServer, 'https://second-test-ilios.com', 'apiServer is correct');
    assert.ok('apiNameSpace' in result, 'result contains apiNameSpace');
    assert.equal(result.apiNameSpace, '/api/v1', 'apiNameSpace is correct');
    assert.ok('ltiUserId' in result, 'result contains ltiUserId');
    assert.equal(result.ltiUserId, 11, 'ltiUserId is correct');
    assert.ok('secret' in result, 'result contains secret');
    assert.equal(result.secret, 'secret456!', 'secret is correct');
    assert.ok('ltiPostField' in result, 'result contains ltiPostField');
    assert.equal(result.ltiPostField, 'ext_user_username', 'ltiPostField is correct');
    assert.ok('iliosMatchField' in result, 'result contains iliosMatchField');
    assert.equal(result.iliosMatchField, 'authentication-username', 'iliosMatchField is correct');
  });
  it('dies well when a bad config is requested', function() {
    try {
      readSchoolConfig('bad-school-config', obj);
    } catch(e) {
      assert.equal(e, 'Error: "bad-school-config" is not known to Ilios. Please contact support@iliosproject.org to set it up.');
    }
  });
});
