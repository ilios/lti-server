#!/usr/bin/env node
'use strict';

const createJWT = require('../lib/createJWT');

const meow = require('meow');

const cli = meow(`
  Usage
    $ generate-url <ltiAppUrl> <ltiAppShortname> <apiServer> <apiNameSpace> <iliosSecret> <userId>

  Examples
    $ generate-url 'https://localhost' 'ilios-lti-app' 'https://demo-api.com' 'api/v1' 'secret' 24
    https://lti-site.com/login/TOKEN
`);
const generateUrl = ([ltiAppUrl, ltiAppShortname, apiServer, apiNameSpace, iliosSecret, userId]) => {
  if (
    undefined == ltiAppUrl ||
    undefined == ltiAppShortname ||
    undefined == apiServer ||
    undefined == apiNameSpace ||
    undefined == iliosSecret ||
    undefined == userId) {
    process.stderr.write('Missing parameters <ltiAppUrl> <ltiAppShortname> <apiServer> <apiNameSpace> <iliosSecret> <userId> are required.\n');
    cli.showHelp([1]);
  }
  const token = createJWT(ltiAppShortname, userId, apiServer, apiNameSpace, iliosSecret);
  const targetUrl = `${ltiAppUrl}/login/${token}`;

  process.stdout.write(targetUrl + '\n');
};

generateUrl(cli.input);
