'use strict';

const { createHmac } = require('crypto');
const hmac = (secret, message) => createHmac('sha1', secret).update(message).digest('base64');
const encodeRFC5987ValueChars = require('./encodeRFC5987ValueChars');

const ltiRequestValidator = (secret, token, { body, method, url }) => {
  const signature = body.oauth_signature;
  delete body.oauth_signature;
  const encodedParts = Object.entries(body).map(([key, value]) => {
    const encodedValue = encodeRFC5987ValueChars(value);
    return `${key}=${encodedValue}`;
  }).sort();

  const encodedString = encodeRFC5987ValueChars(encodedParts.join('&'));
  const encodedUrl = encodeRFC5987ValueChars(url);

  //correct information and order for the hash payload from http://lti.tools/oauth/
  const payload = `${method.toUpperCase()}&${encodedUrl}&${encodedString}`;
  const hash = hmac(`${secret}&${token}`, payload);

  if (hash !== signature) {
    console.log('Unable to validate LTI request');
    console.log(`signature: ${signature}`);
    console.log(`payload: ${payload}`);
    console.log(`hash: ${hash}`);
    return false;
  }

  return true;
};

module.exports = ltiRequestValidator;
