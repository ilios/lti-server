import createJWT from '../lib/createJWT';
import { Command } from 'commander';

const program = new Command();

program
  .name('generate-url')
  .description('Generate an LTI login URL with a JWT token')
  .argument('<ltiAppUrl>', 'LTI application URL')
  .argument('<apiServer>', 'API server URL')
  .argument('<apiNameSpace>', 'API namespace')
  .argument('<iliosSecret>', 'Ilios secret')
  .argument('<userId>', 'User ID')
  .action((ltiAppUrl: string, apiServer: string, apiNameSpace: string, iliosSecret: string, userId: string) => {
    const token = createJWT(Number(userId), apiServer, apiNameSpace, iliosSecret);
    const targetUrl = `${ltiAppUrl}/login/${token}`;
    process.stdout.write(targetUrl + '\n');
  });

program.parse();
