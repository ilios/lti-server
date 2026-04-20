import { CreateJWT } from './createJWT';
import { SchoolConfig } from './readSchoolConfig';

export type FindIliosUser = (config: SchoolConfig, searchString: string, createJWT: CreateJWT) => Promise<number>;

export default async (config: SchoolConfig, searchString: string, createJWT: CreateJWT): Promise<number> => {
  if (config.iliosMatchField === 'authentication-username') {
    return fetchByUsername(config, createJWT, searchString);
  }

  if (config.iliosMatchField === 'user-campusid') {
    return fetchByCampusId(config, createJWT, searchString);
  }

  throw new Error(`Unknown iliosMatchField "${config.iliosMatchField}" in school config.`);
};

async function fetchByUsername(config: SchoolConfig, createJWT: CreateJWT, username: string): Promise<number> {
  const url = `${config.apiServer}${config.apiNameSpace}/authentications?filters[username]=${username}`;
  const adminToken = createJWT(config.ltiUserId, config.apiServer, config.apiNameSpace, config.iliosSecret);
  console.log(`Searching for user at ${url} with token ${adminToken}`);
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
    throw new Error(`Unable to find Ilios account for username "${username}".`);
  }
}

async function fetchByCampusId(config: SchoolConfig, createJWT: CreateJWT, campusId: string): Promise<number> {
  const url = `${config.apiServer}${config.apiNameSpace}/users?filters[campusId]=${campusId}`;
  const adminToken = createJWT(config.ltiUserId, config.apiServer, config.apiNameSpace, config.iliosSecret);
  console.log(`Searching for user at ${url} with token ${adminToken}`);
  const data = await fetch(url, {
    headers: {
      'X-JWT-Authorization': `Token ${adminToken}`,
    },
  });
  const result = await data.json();
  if ('users' in result && result.users.length > 0) {
    const userId = result.users[0].id;
    console.log(`User ${userId} found`);
    return userId;
  } else {
    throw new Error(`Unable to find Ilios account for campusId "${campusId}".`);
  }
}
