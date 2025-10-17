import findIliosUser from '../lib/findIliosUser.js';
import createJWT from '../lib/createJWT.js';
import meow from 'meow';

import fetch from 'node-fetch';

const cli = meow(`
  Usage
    $ lookup <ltiUserId> <apiServer> <apiNameSpace> <iliosSecret> <searchString>

  Examples
    $ lookup 61 'https://demo-api.com' 'api/v3' 'secret' test@example.edu
`, {
  importMeta: import.meta,
});
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
    searchString
  }).then(userId => {
    process.stdout.write(`User ID: ${userId}\n`);
  });
};

lookup(cli.input);
