import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { payloadHandler } from '../../app';
import { expect, describe, it } from '@jest/globals';
import querystring from 'querystring';

describe('Unit test for payload handler', function () {
  it('verifies successful response', async () => {
    const event: APIGatewayProxyEvent = {
      httpMethod: 'post',
      body: querystring.encode({ one: 1, two: 2 }),
      headers: {
        foo: 'bar',
      },
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      path: '/payload',
      pathParameters: {},
      queryStringParameters: {},
      requestContext: {
        accountId: '123456789012',
        apiId: '1234',
        authorizer: {},
        httpMethod: 'post',
        identity: {
          accessKey: '',
          accountId: '',
          apiKey: '',
          apiKeyId: '',
          caller: '',
          clientCert: {
            clientCertPem: '',
            issuerDN: '',
            serialNumber: '',
            subjectDN: '',
            validity: { notAfter: '', notBefore: '' },
          },
          cognitoAuthenticationProvider: '',
          cognitoAuthenticationType: '',
          cognitoIdentityId: '',
          cognitoIdentityPoolId: '',
          principalOrgId: '',
          sourceIp: '',
          user: '',
          userAgent: '',
          userArn: '',
        },
        domainName: 'baz.io',
        path: '/payload',
        protocol: 'HTTP/1.1',
        requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        requestTimeEpoch: 1428582896000,
        resourceId: '123456',
        resourcePath: '/payload',
        stage: 'dev',
      },
      resource: '',
      stageVariables: {},
    };
    const result: APIGatewayProxyResult = await payloadHandler(event);

    expect(result.statusCode).toEqual(200);
    const html = `<html>
                <body>
                    <h2>LTI POST Payload:</h2>
                    <p><strong>Protocol:</strong> HTTP/1.1</p>
                    <p><strong>Domain Name:</strong> baz.io</p>
                    <p><strong>Body:</strong> {"one":"1","two":"2"}</p>
                    <p><strong>Method:</strong> post</p>
                    <p><strong>Headers:</strong> {"foo":"bar"}</p>
                </body>
            </html>`.replace(/\s/g, '');
    expect(result.body.replace(/\s/g, '')).toEqual(html);
  });
});
