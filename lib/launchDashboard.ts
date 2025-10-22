//Inspiration and code from: https://github.com/atomicjolt/lti-lambda
import { APIGatewayProxyResult } from 'aws-lambda';
import { S3Client } from '@aws-sdk/client-s3';
import { Event } from './eventToRequest';
import { LtiRequestValidator } from './ltiRequestValidator';
import { ReadSchoolConfig } from './readSchoolConfig';
import { FindIliosUser } from './findIliosUser';
import { CreateJWT } from './createJWT';
export default async (
  request: Event,
  s3Client: S3Client,
  ltiRequestValidator: LtiRequestValidator,
  readSchoolConfig: ReadSchoolConfig,
  findIliosUser: FindIliosUser,
  createJWT: CreateJWT,
): Promise<APIGatewayProxyResult> => {
  const config = await readSchoolConfig(request.schoolName, s3Client);

  console.log(`Configuration for ${request.schoolName} read succesfully`);
  const isValid = ltiRequestValidator(config.consumerSecret, '', request);
  if (isValid) {
    const searchString = request.body[config.ltiPostField];
    if (typeof searchString !== 'string') {
      console.info(request.body);
      throw new Error(`Unable to extract a valid searchString from the request, looking for ${config.ltiPostField}`);
    }
    const userId = await findIliosUser(config, searchString);
    if (userId) {
      console.log(`Found user ${userId}.`);
      const token = createJWT(userId, config.apiServer, config.apiNameSpace, config.iliosSecret);

      if (!process.env.DASHBOARD_APP_URL) {
        throw new Error('DASHBOARD_APP_URL is not defined, nowhere to redirect authenticated user');
      }

      const targetUrl = `${process.env.DASHBOARD_APP_URL}/login/${token}`;
      const response = {
        statusCode: 302,
        headers: {
          Location: targetUrl,
        },
        body: '',
      };
      return response;
    } else {
      console.error(`No user found for ${searchString}`);
    }
  }

  throw new Error('Unable to validate request. Please ensure your consumer secret is correct.');
};
