import { GetObjectCommand } from '@aws-sdk/client-s3';

export default async(key, s3Client) => {
  const params = {
    Bucket: process.env.CONFIG_BUCKET,
    Key: 'config.json',
  };
  const command = new GetObjectCommand(params);
  console.log('Looking for configuration for school in: ');
  console.log(params);
  const response = await s3Client.send(command);
  const str = await response.Body.transformToString();
  const obj = JSON.parse(str);
  if (!(key in obj)) {
    throw new Error(`The Consumer Key "${key}" is not known to Ilios. Please contact support@iliosproject.org to set it up.`);
  } else {
    return obj[key];
  }
};
