'use strict';

const findIliosUser = ({fetch, createJWT, config, searchString}) => {
  return new Promise((resolve, reject) => {
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
        resolve(result.authentications[0].user);
      } else {
        reject(`Unable to find Ilios account for ${searchString}.`);
      }
    });
  });
};

module.exports = findIliosUser;
