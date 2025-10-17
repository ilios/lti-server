import { parse } from 'querystring';

export default (event) => {
  const protocol = event.headers['X-Forwarded-Proto'];
  const method = event.httpMethod;
  const host = event.headers.Host;
  const path = event.requestContext.path;
  const body = parse(event.body);
  const url = `${protocol}://${host}${path}`;

  const rhett = {
    protocol,
    url,
    body,
    method,
    headers: {
      host
    }
  };

  return rhett;
};
