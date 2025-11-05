import { APIGatewayProxyEvent } from 'aws-lambda';
import { parse, ParsedUrlQuery } from 'querystring';
import { decodeJwt } from 'jose';

interface LtiEvent {
  protocol: string;
  method: string;
  url: string;
  body: ParsedUrlQuery;
  host: string;
}

export interface Lti13Event extends LtiEvent {
  ltiVersion: 1.3;
  clientId: string;
  token: string;
  state: string;
  nonce: string;
}

export interface Lti11Event extends LtiEvent {
  ltiVersion: 1.1;
  schoolName: string;
}

type Event = Lti11Event | Lti13Event;

export default (event: APIGatewayProxyEvent): Event => {
  const protocol = event.headers['X-Forwarded-Proto'] ?? 'http';
  const method = event.httpMethod;
  const host = event.headers.Host ?? '';
  const path = event.requestContext.path;
  const body = parse(event.body ?? '');
  const url = `${protocol}://${host}${path}`;

  if (typeof body.id_token === 'string') {
    const { aud, nonce } = decodeJwt(body.id_token);

    if (typeof aud !== 'string') {
      throw new Error('Bad aud sent');
    }

    if (typeof nonce !== 'string') {
      throw new Error('Bad nonce sent');
    }

    if (typeof body.state !== 'string') {
      throw new Error('Bad state sent');
    }

    const obj: Lti13Event = {
      protocol,
      url,
      body,
      method,
      host,
      token: body.id_token,
      state: body.state,
      clientId: aud,
      ltiVersion: 1.3,
      nonce,
    };

    return obj;
  } else if (typeof body.oauth_consumer_key === 'string') {
    const schoolName = body.oauth_consumer_key;

    if (typeof schoolName !== 'string') {
      console.info(body);
      throw new Error('Unable to extract school from request');
    }

    const obj: Lti11Event = {
      protocol,
      url,
      body,
      method,
      host,
      schoolName,
      ltiVersion: 1.1,
    };

    return obj;
  }

  console.info(body);
  throw new Error('Unknown LTI Type');
};
