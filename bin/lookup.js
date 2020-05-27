'use strict';

const findIliosUser = require('../lib/findIliosUser');
const createJWT = require('../lib/createJWT');
const fetch = require('node-fetch');
const aws = require('aws-sdk');

const meow = require('meow');

const cli = meow(`
  Usage
    $ lookup <ltiUserId> <apiServer> <apiNameSpace> <iliosSecret> <searchString>

  Examples
    $ lookup 61 'https://demo-api.com' 'api/v2' 'secret' test@example.edu
`);
const lookup = ([ltiUserId, apiServer, apiNameSpace, iliosSecret, searchString]) => {
  if (
    undefined == ltiUserId ||
    undefined == apiServer ||
    undefined == apiNameSpace ||
    undefined == iliosSecret ||
    undefined == searchString) {
    process.stderr.write('Missing parameters <ltiUserId> <apiServer> <apiNameSpace> <iliosSecret> <searchString> are required.\n');
    cli.showHelp([1]);
  }
  const iliosMatchField = 'authentication-username'; //we only support one right now
  const config = { ltiUserId, apiServer, apiNameSpace, iliosSecret, iliosMatchField };
  findIliosUser({
    fetch,
    createJWT,
    config,
    searchString,
    aws
  }).then(userId => {
    process.stdout.write(`User ID: ${userId}\n`);
  });
};

lookup(cli.input);
