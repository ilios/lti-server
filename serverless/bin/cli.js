import createJWT from '../lib/createJWT.js';
import meow from 'meow';

const cli = meow(
  `
  Usage
    $ generate-url <ltiAppUrl> <apiServer> <apiNameSpace> <iliosSecret> <userId>

  Examples
    $ generate-url 'https://localhost' 'https://demo-api.com' 'api/v3' 'secret' 24
    https://lti-site.com/login/TOKEN
`,
  {
    importMeta: import.meta,
  },
);
const generateUrl = ([ltiAppUrl, apiServer, apiNameSpace, iliosSecret, userId]) => {
  if (
    undefined == ltiAppUrl ||
    undefined == apiServer ||
    undefined == apiNameSpace ||
    undefined == iliosSecret ||
    undefined == userId
  ) {
    process.stderr.write('Missing parameters <apiServer> <apiNameSpace> <iliosSecret> <userId> are required.\n');
    cli.showHelp([1]);
  }
  const token = createJWT(userId, apiServer, apiNameSpace, iliosSecret);
  const targetUrl = `${ltiAppUrl}/login/${token}`;

  process.stdout.write(targetUrl + '\n');
};

generateUrl(cli.input);
