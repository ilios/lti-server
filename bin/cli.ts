import { ServiceTokenConfig } from '../lib/readSchoolConfig';
import requestJWT from '../lib/requestJWT';
import { Command } from 'commander';

const program = new Command();

program
  .name('generate-url')
  .description('Generate an LTI login URL with a JWT token')
  .argument('<ltiAppUrl>', 'LTI application URL')
  .argument('<apiServer>', 'API server URL')
  .argument('<serviceToken>', 'Service Token')
  .argument('<userId>', 'User ID')
  .action(async (ltiAppUrl: string, apiServer: string, serviceToken: string, userId: string) => {
    const config: ServiceTokenConfig = {
      apiServer,
      serviceToken,
      apiNameSpace: '',
      iliosMatchField: '',
      ltiPostField: '',
    };
    const token = await requestJWT(Number(userId), config);
    const targetUrl = `${ltiAppUrl}/lti-login/${token}`;
    process.stdout.write(targetUrl + '\n');
  });

program.parse();
