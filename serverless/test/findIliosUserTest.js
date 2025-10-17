import findIliosUser from '../lib/findIliosUser.js';
import assert from 'assert';

describe('Get the ID for a user', function () {
  const config = {
    apiServer: 'https://test-ilios.com',
    apiNameSpace: '/test/api/v3',
    ltiUserId: 33,
    secret: 'secret123',
    ltiPostField: 'ext_user_username',
    iliosMatchField: 'authentication-username'
  };
  const searchString = 'test-username';
  const createJWT = (id) => `TOKEN${id}`;

  it('calls the api and returns a userId when there is no data in the cache', async function () {
    const fetch = async (url) => {
      assert.strictEqual(url, `${config.apiServer}${config.apiNameSpace}/authentications?filters[username]=${searchString}`);
      return {
        json() {
          return {
            authentications: [
              { user: 24, username: searchString }
            ]
          };
        }
      };
    };
    const result = await findIliosUser({ fetch, createJWT, config, searchString });
    assert.strictEqual(result, 24);
  });

  it('dies well when a bad search is performed', async function () {
    const fetch = async () => {
      return {
        json() {
          return {
            authentications: []
          };
        }
      };
    };
    try {
      await findIliosUser({ fetch, createJWT, config, searchString });
    } catch (e) {
      assert.strictEqual(e, `Unable to find Ilios account for ${searchString}.`);
    }
  });
});
