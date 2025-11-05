import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

interface BaseConfig {
  apiServer: string;
  apiNameSpace: string;
  iliosMatchField: string;
  ltiUserId: number;
  iliosSecret: string;
  ltiPostField: string;
}

export interface Lti11SchoolConfig extends BaseConfig {
  ltiVersion: 1.1;
  consumerSecret: string;
}
export interface Lti13SchoolConfig extends BaseConfig {
  ltiVersion: 1.3;
  keysetUrl: string;
  authenticationRequestUrl: string;
  issuer: string;
  clientId: string;
}

export type SchoolConfig = Lti11SchoolConfig | Lti13SchoolConfig;

export type ReadSchoolConfig = (key: string, s3Client: S3Client) => Promise<SchoolConfig>;

export default async (key: string, s3Client: S3Client): Promise<SchoolConfig> => {
  const params = {
    Bucket: process.env.CONFIG_BUCKET,
    Key: 'config.json',
  };
  const command = new GetObjectCommand(params);
  console.log('Looking for configuration for school in: ');
  console.log(params);
  const response = await s3Client.send(command);
  const str = await response.Body?.transformToString();
  const obj = JSON.parse(str ?? '');

  if (!(key in obj)) {
    throw new Error(
      `The Configuration for "${key}" is not known to Ilios. Please contact support@iliosproject.org to set it up.`,
    );
  } else {
    return obj[key];
  }
};
