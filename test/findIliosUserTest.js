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
  const keyHash = `${config.apiServer}:${config.apiNameSpace}:${config.ltiPostField}:${config.iliosMatchField}:userId:${searchString}`;
  it('calls the api and returns a userId when there is no data in the cache', async function() {
    const Redis = function(){
      this.get = (key) => {
        assert.equal(key, keyHash);
        return Promise.resolve(null);
      };
      this.set = (key, value) => {
        assert.equal(key, keyHash);
        assert.equal(value, 24);
      };
    };
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
    const result = await findIliosUser({fetch, createJWT, config, searchString, Redis});
    assert.equal(result, 24);
  });
  it('Users the id in the cache when it exists', async function() {
    const Redis = function(){
      this.get = (key) => {
        assert.equal(key, keyHash);
        return Promise.resolve(11);
      };
    };
    const fetch = null;
    const result = await findIliosUser({fetch, createJWT, config, searchString, Redis});
    assert.equal(result, 11);
  });
  it('dies well when a bad search is performed', async function() {
    const Redis = function(){
      this.get = (key) => {
        assert.equal(key, keyHash);
        return Promise.resolve(null);
      };
    };
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
      await findIliosUser({fetch, createJWT, config, searchString, Redis});
    } catch(e) {
      assert.equal(e, `Unable to find Ilios account for ${searchString}.`);
    }
  });
});
