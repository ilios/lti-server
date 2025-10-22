import { createHmac } from 'crypto';
const hmac = (secret: string, message: string) => createHmac('sha1', secret).update(message).digest('base64');
import encodeRFC5987ValueChars from './encodeRFC5987ValueChars';
import { Event } from './eventToRequest';

export type LtiRequestValidator = (consumerSecret: string, signature: string, request: Event) => boolean;

export default (secret: string, token: string, { body, method, url }: Event): boolean => {
  const signature = body.oauth_signature;
  delete body.oauth_signature;
  const encodedParts = Object.entries(body)
    .map(([key, value]) => {
      const encodedValue = encodeRFC5987ValueChars(value as string);
      return `${key}=${encodedValue}`;
    })
    .sort();

  const encodedString = encodeRFC5987ValueChars(encodedParts.join('&'));
  const encodedUrl = encodeRFC5987ValueChars(url);

  //correct information and order for the hash payload from http://lti.tools/oauth/
  const payload = `${method.toUpperCase()}&${encodedUrl}&${encodedString}`;
  const hash = hmac(`${secret}&${token}`, payload);

  if (hash !== signature) {
    console.log('Unable to validate LTI request');
    console.log(`signature: ${signature}`);
    console.log(`payload: ${payload}`);
    console.log(`hash: ${hash}`);
    return false;
  }

  return true;
};
