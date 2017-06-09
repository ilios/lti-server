'use strict';

const md5 = require('md5');

const findIliosUser = ({fetch, createJWT, config, searchString, aws}) => {
  return new Promise((resolve, reject) => {
    const db = new aws.SimpleDB();
    const key = `${config.apiServer}:${config.apiNameSpace}:${config.ltiPostField}:${config.iliosMatchField}:userId:${searchString}`;
    const keyHash = md5(key);
    console.log(`Hashed key ${key} to ${keyHash}`);
    console.log(`Searching for cached ${searchString} in SimpleDB ${process.env.USERID_SIMPLEDB_DOMAIN}`);
    db.getAttributes({
      DomainName: process.env.USERID_SIMPLEDB_DOMAIN,
      ItemName: keyHash
    }).promise().then(result => {
      if (('Attributes' in result) && result.Attributes.length > 0 && result.Attributes[0].Name === 'userId') {
        const userId = result.Attributes[0].Value;
        console.log(`User ${userId} was found in cache for ${keyHash}`);
        resolve(userId);
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
            db.putAttributes({
              DomainName: process.env.USERID_SIMPLEDB_DOMAIN,
              ItemName: keyHash,
              Attributes: [
                {Name: 'userId', Value: userId}
              ]
            }).promise().then(()=>{
              console.log(`User ${userId} found and saved to cache as ${keyHash}`);
              resolve(userId);
            });
          } else {
            reject(`Unable to find Ilios account for ${searchString}.`);
          }
        });
      }
    });

  });
};

module.exports = findIliosUser;
