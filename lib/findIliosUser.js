'use strict';

const crypto = require('crypto');
const sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');

const findIliosUser = async ({ fetch, createJWT, config, searchString, aws }) => {
  const db = new aws.SimpleDB();
  const key = `${config.apiServer}:${config.apiNameSpace}:${config.ltiPostField}:${config.iliosMatchField}:userId:${searchString}`;
  const keyHash = sha256(key);
  console.log(`Hashed key ${key} to ${keyHash}`);
  console.log(`Searching for cached ${searchString} in SimpleDB ${process.env.USERID_SIMPLEDB_DOMAIN}`);
  const result = await db.getAttributes({
    DomainName: process.env.USERID_SIMPLEDB_DOMAIN,
    ItemName: keyHash
  }).promise();
  if (('Attributes' in result) && result.Attributes.length > 0 && result.Attributes[0].Name === 'userId') {
    const userId = result.Attributes[0].Value;
    console.log(`User ${userId} was found in cache for ${keyHash}`);
    return userId;
  } else {
    console.log(`No User found in cache for ${keyHash}`);
    let url = config.apiServer + config.apiNameSpace;
    switch (config.iliosMatchField) {
    case 'authentication-username':
      url += `/authentications?filters[username]=${searchString}`;
      break;
    }
    const adminToken = createJWT(config.ltiUserId, config.apiServer, config.apiNameSpace, config.iliosSecret);
    console.log(`Searching for user ${searchString} at ${url} with token ${adminToken}`);
    const data = await fetch(url, {
      headers: {
        'X-JWT-Authorization': `Token ${adminToken}`
      }
    });
    const result = await data.json();

    if ('authentications' in result && result.authentications.length > 0) {
      const userId = result.authentications[0].user;
      await db.putAttributes({
        DomainName: process.env.USERID_SIMPLEDB_DOMAIN,
        ItemName: keyHash,
        Attributes: [
          { Name: 'userId', Value: userId }
        ]
      });
      console.log(`User ${userId} found and saved to cache as ${keyHash}`);
      return userId;
    } else {
      return `Unable to find Ilios account for ${searchString}.`;
    }
  }
};

module.exports = findIliosUser;
