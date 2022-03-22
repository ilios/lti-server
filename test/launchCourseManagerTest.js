import launchCourseManager from '../lib/launchCourseManager.js';
import assert from 'assert';
describe('Course Response handler works', async function() {
  it('sends a redirect with all the right data', async function () {
    const ltiRequestValidator = () => true;
    const eventToRequest = () => {
      return {
        protocol: null,
        url: null,
        body: {
          oauth_consumer_key: null,
          custom_course_id: 13,
        },
        method: null,
        headers: {
          host: null
        }
      };
    };
    const readSchoolConfig = async () => {
      return {
        apiServer: null,
        apiNameSpace: null,
        ltiUserId: null,
        secret: null,
        ltiPostField: null,
        iliosMatchField: null
      };
    };
    const event = null;
    const aws  = null;
    const fetch  = null;
    const findIliosUser  = () => Promise.resolve(24);
    const createJWT  = () => 'token';
    process.env.COURSE_MANAGER_APP_URL = 'test-course-server.com';
    const response = await launchCourseManager({event, ltiRequestValidator, aws, eventToRequest, readSchoolConfig, findIliosUser, fetch, createJWT});

    assert.ok('statusCode' in response);
    assert.strictEqual(response.statusCode, 302);
    assert.ok('body' in response);
    assert.strictEqual(response.body, '');
    assert.ok('headers' in response);
    assert.ok('Location' in response.headers);
    assert.strictEqual(response.headers.Location, 'test-course-server.com/login/token?course_id=13');
  });
});
