'use strict';
//Inspiration and code from: https://github.com/atomicjolt/lti-lambda

const launchResponse = async ({event, ltiRequestValidator, aws, eventToRequest, readSchoolConfig, findIliosUser, fetch, createJWT}) => {

  const request = eventToRequest(event);
  const consumerKey = request.body.oauth_consumer_key;
  const config = await readSchoolConfig(consumerKey, aws);

  console.log(`Configuration for ${consumerKey} read succesfully`);
  const isValid = ltiRequestValidator(config.consumerSecret, '', request);
  if (isValid) {
    const searchString = request.body[config.ltiPostField];
    const userId = await findIliosUser({ fetch, createJWT, config, searchString, aws });
    if (userId) {
      console.log(`Found user ${userId}.`);
      const token = createJWT(userId, config.apiServer, config.apiNameSpace, config.iliosSecret);

      const targetUrl = `${process.env.LTI_APP_URL}/login/${token}`;
      const response = {
        statusCode: 302,
        headers: {
          'Location': targetUrl
        },
        body: ''
      };
      return response;
    }
  } else {
    throw new Error('Unable to validate request. Please ensure your consumer secret is correct.');
  }
};

module.exports = launchResponse;
