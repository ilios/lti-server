import jwt from 'jsonwebtoken';
const PREPEND_KEY = 'ilios.jwt.key.';
const TOKEN_ISS = 'ilios-lti-server';
const TOKEN_AUD = 'ilios-lti-app';

export default (userId, apiHost, apiNameSpace, secret) => {
  const fullSecret = PREPEND_KEY + secret;
  const token = jwt.sign({user_id: userId, apiHost, apiNameSpace}, fullSecret, {
    algorithm: 'HS256',
    expiresIn: '60 seconds',
    issuer: TOKEN_ISS,
    audience: TOKEN_AUD,
  });

  return token;
};
