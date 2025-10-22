import readSchoolConfig from '../lib/readSchoolConfig.js';
import fs from 'fs';
import assert from 'assert';

describe('Read the configuration for a school', function () {
  let json;
  let send;
  let s3Client;

  beforeEach(function () {
    json = fs.readFileSync(new URL('sample-config.json', import.meta.url));
    send = async function () {
      return {
        Body: {
          async transformToString() {
            return json;
          },
        },
      };
    };
    s3Client = { send };
  });

  it('reads the first school correctly', async function () {
    const result = await readSchoolConfig('demo-school-config', s3Client);
    assert.ok('apiServer' in result, 'result contains apiServer');
    assert.strictEqual(result.apiServer, 'https://test-ilios.com', 'apiServer is correct');
    assert.ok('apiNameSpace' in result, 'result contains apiNameSpace');
    assert.strictEqual(result.apiNameSpace, '/test/api/v3', 'apiNameSpace is correct');
    assert.ok('ltiUserId' in result, 'result contains ltiUserId');
    assert.strictEqual(result.ltiUserId, 33, 'ltiUserId is correct');
    assert.ok('consumerSecret' in result, 'result contains consumerSecret');
    assert.strictEqual(result.consumerSecret, 'secret123', 'consumerSecret is correct');
    assert.ok('iliosSecret' in result, 'result contains iliosSecret');
    assert.strictEqual(result.iliosSecret, 'secret123', 'iliosSecret is correct');
    assert.ok('ltiPostField' in result, 'result contains ltiPostField');
    assert.strictEqual(result.ltiPostField, 'ext_user_username', 'ltiPostField is correct');
    assert.ok('iliosMatchField' in result, 'result contains iliosMatchField');
    assert.strictEqual(result.iliosMatchField, 'authentication-username', 'iliosMatchField is correct');
  });

  it('reads the second school correctly', async function () {
    const result = await readSchoolConfig('second-school-config', s3Client);
    assert.ok('apiServer' in result, 'result contains apiServer');
    assert.strictEqual(result.apiServer, 'https://second-test-ilios.com', 'apiServer is correct');
    assert.ok('apiNameSpace' in result, 'result contains apiNameSpace');
    assert.strictEqual(result.apiNameSpace, '/api/v3', 'apiNameSpace is correct');
    assert.ok('ltiUserId' in result, 'result contains ltiUserId');
    assert.strictEqual(result.ltiUserId, 11, 'ltiUserId is correct');
    assert.ok('consumerSecret' in result, 'result contains consumerSecret');
    assert.strictEqual(result.consumerSecret, 'secret456!', 'consumerSecret is correct');
    assert.ok('iliosSecret' in result, 'result contains iliosSecret');
    assert.strictEqual(result.iliosSecret, 'abcd', 'iliosSecret is correct');
    assert.ok('ltiPostField' in result, 'result contains ltiPostField');
    assert.strictEqual(result.ltiPostField, 'ext_user_username', 'ltiPostField is correct');
    assert.ok('iliosMatchField' in result, 'result contains iliosMatchField');
    assert.strictEqual(result.iliosMatchField, 'authentication-username', 'iliosMatchField is correct');
  });

  it('dies well when a bad config is requested', async function () {
    try {
      await readSchoolConfig('bad-school-config', s3Client);
    } catch (e) {
      assert.strictEqual(
        e.message,
        'The Consumer Key "bad-school-config" is not known to Ilios. Please contact support@iliosproject.org to set it up.',
      );
    }
  });
});
