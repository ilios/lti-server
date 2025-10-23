import launchDashboard from '../../lib/launchDashboard';
import { SchoolConfig } from '../../lib/readSchoolConfig';
import { Event } from '../../lib/eventToRequest';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import { mockClient } from 'aws-sdk-client-mock';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

describe('Dashboard Response handler works', () => {
  it('sends a redirect with all the right data', async () => {
    const event: Event = {
      schoolName: '',
      protocol: 'https',
      url: '',
      body: {
        foo: 'bar',
      },
      method: 'POST',
      host: '',
    };

    let json = fs.readFileSync(path.join(__dirname, '../sample-config.json'));
    const s3Mock = mockClient(S3Client);
    s3Mock.on(GetObjectCommand).resolves({
      Body: sdkStreamMixin(Readable.from(json)),
    });

    const ltiRequestValidator = jest.fn(() => true);
    const readSchoolConfig = jest.fn(
      async (str: string, S3Client): Promise<SchoolConfig> => ({
        apiServer: '',
        apiNameSpace: '',
        ltiUserId: 0,
        ltiPostField: 'foo',
        iliosMatchField: '',
        consumerSecret: '',
        iliosSecret: '',
      }),
    );
    const findIliosUser = jest.fn(() => Promise.resolve(24));
    const createJWT = jest.fn(() => 'token');

    process.env.DASHBOARD_APP_URL = 'test-dash-server.com';

    const response = await launchDashboard(
      event,
      s3Mock as unknown as S3Client,
      ltiRequestValidator,
      readSchoolConfig,
      findIliosUser,
      createJWT,
    );

    expect(response).toHaveProperty('statusCode', 302);
    expect(response).toHaveProperty('body', '');
    expect(response).toHaveProperty('headers');
    expect(response.headers).toHaveProperty('Location', 'test-dash-server.com/login/token');
  });
});
