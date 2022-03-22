import ltiRequestValidator from '../lib/ltiRequestValidator.js';
import encodeRFC5987ValueChars from '../lib/encodeRFC5987ValueChars.js';
import assert from 'assert';
import { createHmac } from 'crypto';
const hmac = (secret, message) => createHmac('sha1', secret).update(message).digest('base64');

const createRequest = (body) => {
  return {
    protocol: 'https',
    url: null,
    body,
    method: 'POST',
    headers: {
      host: null
    }
  };
};

describe('Validate LTI Request', function () {
  const secret = 'xx55$$1';
  const token = 'token123%%';
  const url = 'http://localhost.dev/test';
  const data = {
    third: '^$last_!data',
    first: 'some data',
    second: '--some*data',
  };

  const encodedParts = Object.entries(data).map(([key, value]) => {
    const encodedValue = encodeRFC5987ValueChars(value);
    return `${key}=${encodedValue}`;
  }).sort();
  const encodedString = encodeRFC5987ValueChars(encodedParts.join('&'));
  const encodedUrl = encodeRFC5987ValueChars(url);
  const hash = hmac(`${secret}&${token}`, `POST&${encodedUrl}&${encodedString}`);

  it('validate the signature and the data', async function () {
    const body = Object.assign({'oauth_signature': hash}, data);
    const request = createRequest(body);
    request.url = url;

    const result = ltiRequestValidator(secret, token, request);
    assert.strictEqual(result, true);
  });
  it('returns false when the secret is different', async function() {
    const body = Object.assign({'oauth_signature': hash}, data);
    const request = createRequest(body);

    const result = ltiRequestValidator('wrong secret', token, request);
    assert.strictEqual(result, false);
  });
  it('returns false when the token is different', async function() {
    const body = Object.assign({'oauth_signature': hash}, data);
    const request = createRequest(body);

    const result = ltiRequestValidator(secret, 'wrong token', request);
    assert.strictEqual(result, false);
  });
  it('returns false when signature is wrong', async function() {
    const body = Object.assign({'oauth_signature': 'bad signature'}, data);
    const request = createRequest(body);

    const result = ltiRequestValidator(secret, token, request);
    assert.strictEqual(result, false);
  });
  it('returns false when the data does not match the signature', async function() {
    const body = Object.assign({ 'oauth_signature': hash }, data);
    delete body.first;
    const request = createRequest(body);

    const result = ltiRequestValidator(secret, token, request);
    assert.strictEqual(result, false);
  });
  it('validates test data', async function () {
    //data from http://lti.tools/oauth/
    const body = {
      oauth_consumer_key: 'dpf43f3p2l4k3l03',
      oauth_token: 'nnch734d00sl2jdk',
      oauth_nonce: 'kllo9940pd9333jh',
      oauth_timestamp: '1191242096',
      oauth_signature_method: 'HMAC-SHA1',
      oauth_signature: 'tR3+Ty81lMeYAr/Fid0kMTYa/WM=',
      oauth_version: '1.0',
      size: 'original',
      file: 'vacation.jpg',
    };
    const secret = 'kd94hf93k423kf44';
    const token = 'pfkkdhi9sl3r4s00';
    const request = createRequest(body);
    request.url = 'http://photos.example.net/photos';
    request.method = 'GET';

    const result = ltiRequestValidator(secret, token, request);
    assert.strictEqual(result, true);
  });
});


