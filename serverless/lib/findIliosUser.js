export default async ({ fetch, createJWT, config, searchString }) => {
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
    console.log(`User ${userId} found`);
    return userId;
  } else {
    return `Unable to find Ilios account for ${searchString}.`;
  }
};
