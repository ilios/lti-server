'use strict';

const createJWT = require('../lib/createJWT');
const jwt = require('jsonwebtoken');
const assert = require('assert');
const moment = require('moment');

describe('Generates a JWT from provided data', function() {
  const userId = 24;
  const apiHost = 'https://example.com';
  const apiNameSpace = '/api/v1';
  const secret = 'secret';
  const ltiAppShortname = 'ilios-lti-app';
  const token = createJWT(ltiAppShortname, userId, apiHost, apiNameSpace, secret);

  assert.ok(token.length > 200);
  const obj = jwt.decode(token);
  it('has the right passed values', function() {
    assert.equal(obj.iss, 'ilios-lti-server');
    assert.equal(obj.aud, ltiAppShortname);

    const expiresAt = moment(obj.exp, 'X');
    const now = moment();
    const diff = expiresAt.diff(now, 's');
    assert.ok(diff < 61);
  });
  it('has the right default values', function() {
    assert.equal(obj.user_id, userId);
    assert.equal(obj.apiHost, apiHost);
    assert.equal(obj.apiNameSpace, apiNameSpace);
  });
  it('expires in less than 60 seconds', function() {
    const expiresAt = moment(obj.exp, 'X');
    const now = moment();
    const diff = expiresAt.diff(now, 's');
    assert.ok(diff < 61);
  });
  it('is valid', function() {
    const isValid = jwt.verify(token, 'ilios.jwt.key.' + secret);
    assert.ok(isValid);
  });
});
