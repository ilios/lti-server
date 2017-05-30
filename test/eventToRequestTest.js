'use strict';

const eventToRequest = require('../lib/eventToRequest');
const assert = require('assert');
//https://nodejs.org/api/http.html#http_http_request_options_callback
describe('Parses a lambda event into a node request', function() {
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
    body
  };
  const request = eventToRequest(testEvent);
  it('returns a correctly structured response', function() {
    assert.ok('method' in request);
    assert.ok('url' in request);
    assert.ok('protocol' in request);
    assert.ok('body' in request);
    assert.ok('foo' in request.body, 'request body contains foo key');
    assert.ok('bar' in request.body, 'request body contains bar key');
    assert.ok('what' in request.body, 'request body contains what key');
    assert.ok('headers' in request);
    assert.ok('host' in request.headers);
    assert.equal(request.method, method);
    assert.equal(request.url, `${protocol}://${host}${path}`);
    assert.equal(request.protocol, protocol);
    assert.equal(request.body.foo, 'bar');
    assert.equal(request.body.bar, 'foo');
    assert.equal(request.body.what, '1');
    assert.equal(request.headers.host, host);
  });
});
