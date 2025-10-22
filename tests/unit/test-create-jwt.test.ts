import createJWT from '../../lib/createJWT';
import jwt from 'jsonwebtoken';
import { expect, describe, it } from '@jest/globals';
import { DateTime } from 'luxon';

describe('Generates a JWT from provided data', function () {
  const userId = 24;
  const apiHost = 'https://example.com';
  const apiNameSpace = '/api/v3';
  const secret = 'secret';
  let token: string;
  let obj: jwt.JwtPayload;

  beforeEach(function () {
    token = createJWT(userId, apiHost, apiNameSpace, secret);
    expect(token.length).toBeGreaterThanOrEqual(200);
    let payload = jwt.decode(token);
    if (payload && typeof payload === 'object') {
      obj = payload;
    }
    expect(obj).toHaveProperty('exp');
    expect(obj.exp).toBeTruthy();
  });

  it('has the right passed values', function () {
    expect(obj.iss).toEqual('ilios-lti-server');
    expect(obj.aud).toEqual('ilios-lti-app');

    const expiresAt = DateTime.fromSeconds(obj.exp ?? 0);
    const now = DateTime.now();
    const diff = expiresAt.diff(now, 'seconds');
    expect(diff.seconds).toBeLessThan(61);
  });

  it('has the right default values', function () {
    expect(obj.user_id).toEqual(userId);
    expect(obj.apiHost).toEqual(apiHost);
    expect(obj.apiNameSpace).toEqual(apiNameSpace);
  });

  it('expires in less than 60 seconds', function () {
    const expiresAt = DateTime.fromSeconds(obj.exp ?? 0);
    const now = DateTime.now();
    const diff = expiresAt.diff(now, 'seconds');
    expect(diff.seconds).toBeLessThan(61);
  });

  it('is valid', function () {
    const isValid = jwt.verify(token, 'ilios.jwt.key.' + secret);
    expect(isValid).toBeTruthy();
  });
});
