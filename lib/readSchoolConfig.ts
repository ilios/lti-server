import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

interface BaseConfig {
  apiServer: string;
  apiNameSpace: string;
  iliosMatchField: string;
  ltiPostField: string;
}

interface SecretConfig extends BaseConfig {
  ltiUserId: number;
  iliosSecret: string;
}

export interface ServiceTokenConfig extends BaseConfig {
  serviceToken: string;
}

export interface Lti11SchoolConfig extends SecretConfig {
  ltiVersion: 1.1;
  consumerSecret: string;
}

export interface Lti13Config extends BaseConfig {
  ltiVersion: 1.3;
  keysetUrl: string;
  authenticationRequestUrl: string;
  issuer: string;
  clientId: string;
}

export interface Lti13SchoolConfig extends SecretConfig, Lti13Config {}
export interface Lti13ServiceTokenSchoolConfig extends ServiceTokenConfig, Lti13Config {}

export type SchoolConfig = Lti11SchoolConfig | Lti13SchoolConfig | Lti13ServiceTokenSchoolConfig;

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
