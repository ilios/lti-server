import { APIGatewayProxyEvent } from 'aws-lambda';
import eventToRequest, { Lti11Event, Lti13Event } from '../../lib/eventToRequest';
import { expect, describe, it } from '@jest/globals';
import { decodeJwt } from 'jose';

jest.mock('jose', () => ({
  decodeJwt: jest.fn(),
}));

describe('Parses a lambda event into a standard interface', function () {
  const protocol = 'https';
  const host = 'localhost';
  const path = '/dev/lti';
  const method = 'POST';
  const baseEvent: APIGatewayProxyEvent = {
    httpMethod: method,
    body: '',
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

  it('returns a correctly structured response for v1.1 LTI Requests', function () {
    const lti11TestEvent = { ...baseEvent };
    lti11TestEvent.body = 'foo=bar&bar=foo&what=1&oauth_consumer_key=blue';
    const request = eventToRequest(lti11TestEvent) as Lti11Event;
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
    expect(request.schoolName).toEqual('blue');
  });

  it('returns a correctly structured response for v1.3 LTI Requests', function () {
    (decodeJwt as jest.MockedFunction<typeof decodeJwt>).mockReturnValue({ aud: 'jackson', nonce: 'nce1' });
    const lti13TestEvent = { ...baseEvent };

    lti13TestEvent.body = `id_token=123&state=123S`;
    const request = eventToRequest(lti13TestEvent) as Lti13Event;
    expect(request.method).toEqual(method);
    expect(request.url).toEqual(`${protocol}://${host}${path}`);
    expect(request.protocol).toEqual(protocol);
    expect(request.host).toEqual(host);
    expect(request.nonce).toEqual('nce1');
    expect(request.state).toEqual('123S');
    expect(request.clientId).toEqual('jackson');
  });
});
