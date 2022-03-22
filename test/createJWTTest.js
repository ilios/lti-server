import createJWT from '../lib/createJWT.js';
import jwt from 'jsonwebtoken';

import assert from 'assert';
import moment from 'moment';

describe('Generates a JWT from provided data', function () {
  const userId = 24;
  const apiHost = 'https://example.com';
  const apiNameSpace = '/api/v3';
  const secret = 'secret';
  const token = createJWT(userId, apiHost, apiNameSpace, secret);

  assert.ok(token.length > 200);
  const obj = jwt.decode(token);
  it('has the right passed values', function () {
    assert.strictEqual(obj.iss, 'ilios-lti-server');
    assert.strictEqual(obj.aud, 'ilios-lti-app');

    const expiresAt = moment(obj.exp, 'X');
    const now = moment();
    const diff = expiresAt.diff(now, 's');
    assert.ok(diff < 61);
  });
  it('has the right default values', function () {
    assert.strictEqual(obj.user_id, userId);
    assert.strictEqual(obj.apiHost, apiHost);
    assert.strictEqual(obj.apiNameSpace, apiNameSpace);
  });
  it('expires in less than 60 seconds', function () {
    const expiresAt = moment(obj.exp, 'X');
    const now = moment();
    const diff = expiresAt.diff(now, 's');
    assert.ok(diff < 61);
  });
  it('is valid', function () {
    const isValid = jwt.verify(token, 'ilios.jwt.key.' + secret);
    assert.ok(isValid);
  });
});
