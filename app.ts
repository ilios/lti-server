import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client } from '@aws-sdk/client-s3';
import querystring from 'querystring';
import eventToRequest from './lib/eventToRequest.js';
import launchDashboard from './lib/launchDashboard.js';
import ltiRequestValidator from './lib/ltiRequestValidator';
import readSchoolConfig from './lib/readSchoolConfig';
import findIliosUser from './lib/findIliosUser';
import createJWT from './lib/createJWT';

//create the client outside of the handler:
//https://github.com/aws/aws-sdk-js-v3?tab=readme-ov-file#best-practices
const s3Client = new S3Client({});

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
    const request = eventToRequest(event);
    try {
        const response = await launchDashboard(
            request,
            s3Client,
            ltiRequestValidator,
            readSchoolConfig,
            findIliosUser,
            createJWT,
        );

        return response;
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
    const { domainName, protocol } = requestContext;

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
        <p><strong>Body:</strong> ${JSON.stringify(querystring.parse(body ?? ''))}</p>
        <p><strong>Method:</strong> ${httpMethod}</p>
        <p><strong>Headers:</strong> ${JSON.stringify(headers)}</p>
      </body>
    </html>`,
    };
    console.log('Done generating payload analysis');

    return response;
};
