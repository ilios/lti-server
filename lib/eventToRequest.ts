import { APIGatewayProxyEvent } from 'aws-lambda';
import { parse, ParsedUrlQuery } from 'querystring';

export interface Event {
  protocol: string;
  method: string;
  url: string;
  body: ParsedUrlQuery;
  host: string;
  schoolName: string;
}

export default (event: APIGatewayProxyEvent): Event => {
  const protocol = event.headers['X-Forwarded-Proto'] ?? 'http';
  const method = event.httpMethod;
  const host = event.headers.Host ?? '';
  const path = event.requestContext.path;
  const body = parse(event.body ?? '');
  const url = `${protocol}://${host}${path}`;
  const schoolName = body.oauth_consumer_key;

  if (typeof schoolName !== 'string') {
    console.info(body);
    throw new Error("Missing 'oauth_consumer_key' in request body");
  }

  const rhett = {
    protocol,
    url,
    body,
    method,
    host,
    schoolName,
  };

  return rhett;
};
