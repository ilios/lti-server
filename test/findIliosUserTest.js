'use strict';

const findIliosUser = require('../lib/findIliosUser');
const assert = require('assert');

describe('Get the ID for a user', function() {
  const config = {
    apiServer: 'https://test-ilios.com',
    apiNameSpace: '/test/api/v1',
    ltiUserId: 33,
    secret: 'secret123',
    ltiPostField: 'ext_user_username',
    iliosMatchField: 'authentication-username'
  };
  const searchString = 'test-username';

  const createJWT = (id) => `TOKEN${id}`;
  it('calls the api and returns a userId', async function() {
    const fetch = async (url) => {
      assert.equal(url, `${config.apiServer}${config.apiNameSpace}/authentications?filters[username]=${searchString}`);
      return {
        json(){
          return {
            authentications:[
              {user: 24, username: searchString}
            ]
          };
        }
      };
    };
    const result = await findIliosUser({fetch, createJWT, config, searchString});
    assert.equal(result, 24);
  });
  it('dies well when a bad search is performed', async function() {
    const fetch = async () => {
      return {
        json(){
          return {
            authentications:[]
          };
        }
      };
    };
    try {
      await findIliosUser({fetch, createJWT, config, searchString});
    } catch(e) {
      assert.equal(e, `Unable to find Ilios account for ${searchString}.`);
    }
  });
});
