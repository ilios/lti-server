import { CreateJWT } from './createJWT';
import { SchoolConfig } from './readSchoolConfig';

export type FindIliosUser = (config: SchoolConfig, searchString: string, createJWT: CreateJWT) => Promise<number>;

export default async (config: SchoolConfig, searchString: string, createJWT: CreateJWT): Promise<number> => {
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
      'X-JWT-Authorization': `Token ${adminToken}`,
    },
  });
  const result = await data.json();

  if ('authentications' in result && result.authentications.length > 0) {
    const userId = result.authentications[0].user;
    console.log(`User ${userId} found`);
    return userId;
  } else {
    throw new Error(`Unable to find Ilios account for ${searchString}.`);
  }
};
