import readSchoolConfig from '../../lib/readSchoolConfig';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import { mockClient } from 'aws-sdk-client-mock';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
describe('Read the configuration for a school', () => {
  const json = fs.readFileSync(path.join(__dirname, '../sample-config.json'));
  const s3Mock = mockClient(S3Client);
  beforeEach(() => {
    s3Mock.on(GetObjectCommand).resolves({
      Body: sdkStreamMixin(Readable.from(json)),
    });
  });

  it('reads the first school correctly', async () => {
    const result = await readSchoolConfig('demo-school-config', s3Mock as unknown as S3Client);
    expect(result).toHaveProperty('apiServer', 'https://test-ilios.com');
    expect(result).toHaveProperty('apiNameSpace', '/test/api/v3');
    expect(result).toHaveProperty('ltiUserId', 33);
    expect(result).toHaveProperty('consumerSecret', 'secret123');
    expect(result).toHaveProperty('iliosSecret', 'secret123');
    expect(result).toHaveProperty('ltiPostField', 'ext_user_username');
    expect(result).toHaveProperty('iliosMatchField', 'authentication-username');
  });

  it('reads the second school correctly', async () => {
    const result = await readSchoolConfig('second-school-config', s3Mock as unknown as S3Client);
    expect(result).toHaveProperty('apiServer', 'https://second-test-ilios.com');
    expect(result).toHaveProperty('apiNameSpace', '/api/v3');
    expect(result).toHaveProperty('ltiUserId', 11);
    expect(result).toHaveProperty('consumerSecret', 'secret456!');
    expect(result).toHaveProperty('iliosSecret', 'abcd');
    expect(result).toHaveProperty('ltiPostField', 'ext_user_username');
    expect(result).toHaveProperty('iliosMatchField', 'authentication-username');
  });

  it('dies well when a bad config is requested', async () => {
    await expect(readSchoolConfig('bad-school-config', s3Mock as unknown as S3Client)).rejects.toThrow(
      'The Consumer Key "bad-school-config" is not known to Ilios. Please contact support@iliosproject.org to set it up.',
    );
  });
});
