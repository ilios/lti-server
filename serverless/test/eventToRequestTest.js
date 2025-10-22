import eventToRequest from '../lib/eventToRequest.js';
import assert from 'assert';
//https://nodejs.org/api/http.html#http_http_request_options_callback
describe('Parses a lambda event into a node request', function () {
  const protocol = 'https';
  const host = 'localhost';
  const path = '/dev/lti';
  const body = 'foo=bar&bar=foo&what=1';
  const method = 'POST';
  const testEvent = {
    httpMethod: method,
    headers: {
      'X-Forwarded-Proto': protocol,
      Host: host,
    },
    requestContext: {
      path,
    },
    body,
  };
  let request;

  beforeEach(function () {
    request = eventToRequest(testEvent);
  });

  it('returns a correctly structured response', function () {
    assert.ok('method' in request);
    assert.ok('url' in request);
    assert.ok('protocol' in request);
    assert.ok('body' in request);
    assert.ok('foo' in request.body, 'request body contains foo key');
    assert.ok('bar' in request.body, 'request body contains bar key');
    assert.ok('what' in request.body, 'request body contains what key');
    assert.ok('headers' in request);
    assert.ok('host' in request.headers);
    assert.strictEqual(request.method, method);
    assert.strictEqual(request.url, `${protocol}://${host}${path}`);
    assert.strictEqual(request.protocol, protocol);
    assert.strictEqual(request.body.foo, 'bar');
    assert.strictEqual(request.body.bar, 'foo');
    assert.strictEqual(request.body.what, '1');
    assert.strictEqual(request.headers.host, host);
  });
});
