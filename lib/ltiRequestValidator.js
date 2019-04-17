'use strict';

const { createHmac } = require('crypto');
const hmac = (secret, message) => createHmac('sha1', secret).update(message).digest('base64');
const encodeRFC5987ValueChars = require('./encodeRFC5987ValueChars');

const ltiRequestValidator = (secret, { body, method, url }) => {
  const signature = body.oauth_signature;
  delete body.oauth_signature;
  const encodedParts = Object.entries(body).map(([key, value]) => {
    const encodedValue = encodeRFC5987ValueChars(value);
    return `${key}=${encodedValue}`;
  }).sort();

  const encodedString = encodeRFC5987ValueChars(encodedParts.join('&'));
  const encodedUrl = encodeRFC5987ValueChars(url);

  //correct information and order for the hash payload from http://lti.tools/oauth/
  const hash = hmac(secret, `${method.toUpperCase()}&${encodedUrl}&${encodedString}`);

  return hash === signature;
};

module.exports = ltiRequestValidator;
