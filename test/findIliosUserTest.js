'use strict';

const findIliosUser = require('../lib/findIliosUser');
const assert = require('assert');
const md5 = require('md5');

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
  const key = `${config.apiServer}:${config.apiNameSpace}:${config.ltiPostField}:${config.iliosMatchField}:userId:${searchString}`;
  const keyHash = md5(key);
  process.env.USERID_SIMPLEDB_DOMAIN = 'test-domain';

  it('calls the api and returns a userId when there is no data in the cache', async function() {
    const SimpleDB = function(){
      this.getAttributes = ({DomainName, ItemName}) => {
        assert.equal(DomainName, 'test-domain');
        assert.equal(ItemName, keyHash);
        return {
          async promise(){
            return {};
          }
        };
      };
      this.putAttributes = ({DomainName, ItemName, Attributes}) => {
        assert.equal(DomainName, 'test-domain');
        assert.equal(ItemName, keyHash);
        assert.deepEqual(Attributes, [ {Name: 'userId', Value: 24} ]);

        return {
          async promise(){
            return {};
          }
        };
      };
    };
    const aws = { SimpleDB };
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
    const result = await findIliosUser({fetch, createJWT, config, searchString, aws});
    assert.equal(result, 24);
  });
  it('Users the id in the cache when it exists', async function() {
    const SimpleDB = function(){
      this.getAttributes = ({DomainName, ItemName}) => {
        assert.equal(DomainName, 'test-domain');
        assert.equal(ItemName, keyHash);
        return {
          async promise(){
            return {
              'Attributes': [
                {
                  Name: 'userId',
                  Value: 11
                }
              ]
            };
          }
        };
      };
    };
    const aws = { SimpleDB };
    const fetch = null;
    const result = await findIliosUser({fetch, createJWT, config, searchString, aws});
    assert.equal(result, 11);
  });
  it('dies well when a bad search is performed', async function() {
    const SimpleDB = function(){
      this.getAttributes = ({DomainName, ItemName}) => {
        assert.equal(DomainName, 'test-domain');
        assert.equal(ItemName, keyHash);
        return {
          async promise(){
            return {};
          }
        };
      };
    };
    const aws = { SimpleDB };
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
      await findIliosUser({fetch, createJWT, config, searchString, aws});
    } catch(e) {
      assert.equal(e, `Unable to find Ilios account for ${searchString}.`);
    }
  });
});
