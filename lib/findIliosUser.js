'use strict';

const findIliosUser = ({fetch, createJWT, config, searchString, Redis}) => {
  return new Promise((resolve, reject) => {
    const host = process.env.ELASTICACHE_ENDPOINT;
    const redis = new Redis({
      host
    });
    const keyHash = `${config.apiServer}:${config.apiNameSpace}:${config.ltiPostField}:${config.iliosMatchField}:userId:${searchString}`;
    console.log(`Searching for cached ${searchString} user on host ${host}`);
    redis.get(keyHash).then(result => {
      if (result) {
        console.log(`User ${result} was found in cache for ${keyHash}`);
        resolve(result);
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

        fetch(url, {
          headers: {
            'X-JWT-Authorization': `Token ${adminToken}`
          }
        }).then(data => {
          return data.json();
        }).then(result => {
          if ('authentications' in result && result.authentications.length > 0) {
            const userId = result.authentications[0].user;
            redis.set(keyHash, userId);
            console.log(`User {$userId} found and saved to cache as ${keyHash}`);
            resolve(userId);
          } else {
            reject(`Unable to find Ilios account for ${searchString}.`);
          }
        });
      }
    });

  });
};

module.exports = findIliosUser;
