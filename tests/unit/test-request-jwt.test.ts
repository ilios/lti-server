import requestJWT from '../../lib/requestJWT';
import { expect, describe, it } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { ServiceTokenConfig } from '../../lib/readSchoolConfig';

describe('Requests new token from API', function () {
  const config: ServiceTokenConfig = {
    apiServer: 'https://example.com/',
    apiNameSpace: '',
    serviceToken: 'abc',
    iliosMatchField: '',
    ltiPostField: '',
  };
  beforeAll(function () {
    fetchMock.enableMocks();
  });
  beforeEach(function () {
    fetchMock.resetMocks();
  });
  afterAll(function () {
    fetchMock.disableMocks();
  });

  it('calls the API and extracts a token', async function () {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        jwt: '123',
      }),
    );

    const result = await requestJWT(123, config);
    expect(result).toEqual('123');
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(`${config.apiServer}auth/token/123`);
  });

  it('fails when request fails', async function () {
    fetchMock.mockResponseOnce('', { status: 401 });
    await expect(async () => {
      await requestJWT(123, config);
    }).rejects.toThrow(`Unable to request token for user: Unauthorized`);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(`${config.apiServer}auth/token/123`);
  });

  it('fails with bad data', async function () {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        nothing: '123',
      }),
    );
    await expect(async () => {
      await requestJWT(123, config);
    }).rejects.toThrow(/^Unable to parse token JSON \(JWT not in response/);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(`${config.apiServer}auth/token/123`);
  });

  it('fails with bad json', async function () {
    fetchMock.mockResponseOnce('<html></html>');
    await expect(async () => {
      await requestJWT(123, config);
    }).rejects.toThrow(/^Unable to parse token JSON \(Unexpected token/);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(`${config.apiServer}auth/token/123`);
  });

  it('Adds trailing slash to apiServer', async function () {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        jwt: '123',
      }),
    );

    const result = await requestJWT(123, {
      ...config,
      apiServer: 'https://example.edu',
    });
    expect(result).toEqual('123');
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(`https://example.edu/auth/token/123`);
  });
});
