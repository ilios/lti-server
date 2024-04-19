import findIliosUser from '../lib/findIliosUser.js';
import assert from 'assert';
import { createHash } from 'crypto';
const sha256 = x => createHash('sha256').update(x, 'utf8').digest('hex');

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
  let key;
  let keyHash;

  beforeEach(function () {
    key = `${config.apiServer}:${config.apiNameSpace}:${config.ltiPostField}:${config.iliosMatchField}:userId:${searchString}`;
    keyHash = sha256(key);
    process.env.USERID_SIMPLEDB_DOMAIN = 'test-domain';
  });

  it('calls the api and returns a userId when there is no data in the cache', async function () {
    const SimpleDB = function () {
      this.getAttributes = ({ DomainName, ItemName }) => {
        assert.strictEqual(DomainName, 'test-domain');
        assert.strictEqual(ItemName, keyHash);
        return {
          async promise() {
            return {};
          }
        };
      };
      this.putAttributes = ({ DomainName, ItemName, Attributes }) => {
        assert.strictEqual(DomainName, 'test-domain');
        assert.strictEqual(ItemName, keyHash);
        assert.deepStrictEqual(Attributes, [{ Name: 'userId', Value: 24 }]);

        return {
          async promise() {
            return {};
          }
        };
      };
    };
    const aws = { SimpleDB };
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
    const result = await findIliosUser({ fetch, createJWT, config, searchString, aws });
    assert.strictEqual(result, 24);
  });

  it('Users the id in the cache when it exists', async function () {
    const SimpleDB = function () {
      this.getAttributes = ({ DomainName, ItemName }) => {
        assert.strictEqual(DomainName, 'test-domain');
        assert.strictEqual(ItemName, keyHash);
        return {
          async promise() {
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
    const result = await findIliosUser({ fetch, createJWT, config, searchString, aws });
    assert.strictEqual(result, 11);
  });

  it('dies well when a bad search is performed', async function () {
    const SimpleDB = function () {
      this.getAttributes = ({ DomainName, ItemName }) => {
        assert.strictEqual(DomainName, 'test-domain');
        assert.strictEqual(ItemName, keyHash);
        return {
          async promise() {
            return {};
          }
        };
      };
    };
    const aws = { SimpleDB };
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
      await findIliosUser({ fetch, createJWT, config, searchString, aws });
    } catch (e) {
      assert.strictEqual(e, `Unable to find Ilios account for ${searchString}.`);
    }
  });
});
