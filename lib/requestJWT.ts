import { ServiceTokenConfig } from './readSchoolConfig';

export type RequestJWT = (userId: number, config: ServiceTokenConfig) => Promise<string>;

export default async (userId: number, config: ServiceTokenConfig): Promise<string> => {
  const apiServer = config.apiServer.endsWith('/') ? config.apiServer : `${config.apiServer}/`;
  const url = `${apiServer}auth/token/${userId}`;
  const data = await fetch(url, {
    headers: {
      'X-JWT-Authorization': `Token ${config.serviceToken}`,
    },
  });
  if (!data.ok) {
    throw new Error(`Unable to request token for user: ${data.statusText}`);
  }
  const body = await data.text();
  try {
    const result = JSON.parse(body);

    if ('jwt' in result) {
      return result.jwt;
    }

    throw new Error('JWT not in response');
  } catch (e) {
    const message = e instanceof Error ? e.message : 'no more info';
    throw new Error(`Unable to parse token JSON (${message}) from ${url}. Body: ${body}`);
  }
};
