import findIliosUser from '../../lib/findIliosUser';
import { expect, describe, it } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { SchoolConfig } from '../../lib/readSchoolConfig';
import { CreateJWT } from '../../lib/createJWT';

describe('Get the ID for a user', function () {
  beforeAll(function () {
    fetchMock.enableMocks();
  });
  beforeEach(function () {
    fetchMock.resetMocks();
  });
  afterAll(function () {
    fetchMock.disableMocks();
  });

  const config: SchoolConfig = {
    consumerSecret: 'school-name',
    apiServer: 'https://test-ilios.com',
    apiNameSpace: '/test/api/v3',
    ltiUserId: 33,
    iliosSecret: 'secret123',
    ltiPostField: 'ext_user_username',
    iliosMatchField: 'authentication-username',
  };
  const searchString = 'test-username';
  const createJWT: CreateJWT = (id: number) => `TOKEN${id}`;

  it('calls the api and returns a userId when there is no data in the cache', async function () {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        authentications: [{ user: 24, username: searchString }],
      }),
    );

    const result = await findIliosUser(config, searchString, createJWT);
    expect(result).toEqual(24);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(
      `${config.apiServer}${config.apiNameSpace}/authentications?filters[username]=${searchString}`,
    );
  });

  it('dies well when a bad search is performed', async function () {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        authentications: [],
      }),
    );
    expect(async () => {
      await findIliosUser(config, searchString, createJWT);
    }).rejects.toThrow(`Unable to find Ilios account for ${searchString}.`);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(
      `${config.apiServer}${config.apiNameSpace}/authentications?filters[username]=${searchString}`,
    );
  });
});
