import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import querystring from 'querystring';
import eventToRequest from './lib/eventToRequest';
import { launchDashboardV11, launchDashboardV13 } from './lib/launchDashboard';
import ltiRequestValidator from './lib/ltiRequestValidator';
import readSchoolConfig from './lib/readSchoolConfig';
import findIliosUser from './lib/findIliosUser';
import createJWT from './lib/createJWT';
import { generateAndStore, validate } from './lib/manageStateAndNonce';
import validateAndExtractLTI13JWT from './lib/validateAndExtractLTI13JWT';

//create the client outside of the handler:
//https://github.com/aws/aws-sdk-js-v3?tab=readme-ov-file#best-practices
const s3Client = new S3Client({});
const dynamoDbClient = new DynamoDBClient();

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
export const dashboardHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Starting generation of dashboard redirect response');
  console.log(event);
  const request = eventToRequest(event);

  try {
    switch (request.ltiVersion) {
      case 1.3:
        return await launchDashboardV13(
          request,
          s3Client,
          dynamoDbClient,
          validateAndExtractLTI13JWT,
          readSchoolConfig,
          findIliosUser,
          createJWT,
          validate,
        );
      case 1.1:
        return await launchDashboardV11(
          request,
          s3Client,
          ltiRequestValidator,
          readSchoolConfig,
          findIliosUser,
          createJWT,
        );
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `<html><body><h2>Launch Error:</h2><p>${error}</p></body></html>`,
    };
  }
};

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
export const payloadHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Starting generation of payload analysis');
  console.log('Event Data:', event);
  const { body, httpMethod, headers, requestContext } = event;
  const { domainName, protocol, path } = requestContext;

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `<html>
      <body>
        <h2>LTI POST Payload:</h2>
        <p><strong>Protocol:</strong> ${protocol}</p>
        <p><strong>Domain Name:</strong> ${domainName}</p>
        <p><strong>Path:</strong> ${path}</p>
        <p><strong>Body:</strong> ${JSON.stringify(querystring.parse(body ?? ''))}</p>
        <p><strong>Method:</strong> ${httpMethod}</p>
        <p><strong>Headers:</strong> ${JSON.stringify(headers)}</p>
      </body>
    </html>`,
  };
  console.log('Done generating payload analysis');

  return response;
};

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
export const loginHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Starting the login flow');
  console.log('Event Data:', event);
  const { body } = event;

  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing event body' }),
    };
  }

  const params = querystring.parse(body);
  const { iss, login_hint, client_id, target_link_uri } = params;

  // Validate mandatory parameters
  if (!iss || !login_hint || !client_id || !target_link_uri) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters' }),
    };
  }

  // Validate mandatory parameters
  if (
    typeof iss !== 'string' ||
    typeof login_hint !== 'string' ||
    typeof client_id !== 'string' ||
    typeof target_link_uri !== 'string'
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid parameter types' }),
    };
  }

  delete params.iss;

  const { state, nonce } = await generateAndStore(dynamoDbClient);

  params.state = state;
  params.nonce = nonce;
  params.response_type = 'id_token';
  params.scope = 'openid';
  params.redirect_uri = target_link_uri;
  params.response_mode = 'form_post';

  const qp = querystring.encode(params);

  const config = await readSchoolConfig(client_id, s3Client);

  if (config.ltiVersion !== 1.3) {
    console.log(config);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Config isn't suitable for v1.3 LTI launch" }),
    };
  }

  if (!config.authenticationRequestUrl) {
    console.log(config);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing authenticationRequestUrl in SchoolConfig' }),
    };
  }

  const authorizationUrl = `${config.authenticationRequestUrl}?${qp}`;

  console.log(`Redirecting to ${authorizationUrl}`);

  return {
    statusCode: 302,
    headers: {
      Location: authorizationUrl,
    },
    body: '',
  };
};
