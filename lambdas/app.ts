import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import querystring from 'querystring';

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
