'use strict';

const jwt = require('jsonwebtoken');
const PREPEND_KEY = 'ilios.jwt.key.';
const TOKEN_ISS = 'ilios-lti-server';
const TOKEN_AUD = 'ilios-lti-app';

const createJWT = (userId, apiHost, apiNameSpace, supportEmailAddress, secret) => {
  const fullSecret = PREPEND_KEY + secret;
  const token = jwt.sign({user_id: userId, apiHost, apiNameSpace, supportEmailAddress}, fullSecret, {
    algorithm: 'HS256',
    expiresIn: '60 seconds',
    issuer: TOKEN_ISS,
    audience: TOKEN_AUD,
  });

  return token;
};

module.exports = createJWT;
