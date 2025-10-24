import findIliosUser from '../lib/findIliosUser.js';
import createJWT from '../lib/createJWT.js';
import { Command } from 'commander';

const program = new Command();

program
  .name('lookup')
  .description('Look up an Ilios user by search string')
  .argument('<ltiUserId>', 'LTI user ID')
  .argument('<apiServer>', 'API server URL')
  .argument('<apiNameSpace>', 'API namespace')
  .argument('<iliosSecret>', 'Ilios secret')
  .argument('<searchString>', 'Search string')
  .action(
    async (ltiUserId: string, apiServer: string, apiNameSpace: string, iliosSecret: string, searchString: string) => {
      const iliosMatchField = 'authentication-username';
      const config = {
        ltiUserId: Number(ltiUserId),
        apiServer,
        apiNameSpace,
        iliosSecret,
        iliosMatchField,
        consumerSecret: '',
        ltiPostField: '',
      };
      const userId = await findIliosUser(config, searchString, createJWT);
      process.stdout.write(`User ID: ${userId}\n`);
    },
  );

program.parseAsync().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
