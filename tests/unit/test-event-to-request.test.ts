import { APIGatewayProxyEvent } from 'aws-lambda';
import eventToRequest from '../../lib/eventToRequest';
import { expect, describe, it } from '@jest/globals';

jest.mock('jose', () => ({
  decodeJwt: jest.fn(),
}));

describe('Parses a lambda event into a node request', function () {
  const protocol = 'https';
  const host = 'localhost';
  const path = '/dev/lti';
  const body = 'foo=bar&bar=foo&what=1&oauth_consumer_key=blue';
  const method = 'POST';
  const testEvent: APIGatewayProxyEvent = {
    httpMethod: method,
    body,
    headers: {
      'X-Forwarded-Proto': protocol,
      Host: host,
    },
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path,
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
        vpcId: '',
        vpceId: '',
      },
      domainName: 'baz.io',
      path,
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

  it('returns a correctly structured response', function () {
    const request = eventToRequest(testEvent);
    expect(request).toHaveProperty('method');
    expect(request).toHaveProperty('url');
    expect(request).toHaveProperty('protocol');
    expect(request).toHaveProperty('body');
    expect(request.body).toHaveProperty('foo');
    expect(request.body).toHaveProperty('bar');
    expect(request.body).toHaveProperty('what');
    expect(request.method).toEqual(method);
    expect(request.url).toEqual(`${protocol}://${host}${path}`);
    expect(request.protocol).toEqual(protocol);
    expect(request.body.foo).toEqual('bar');
    expect(request.body.bar).toEqual('foo');
    expect(request.body.what).toEqual('1');
    expect(request.host).toEqual(host);
  });
});
